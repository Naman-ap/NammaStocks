"""
AI Agent service — orchestrates LLM calls with RAG context injection.

Architecture:
  1. Extract user query from message history
  2. Build RAG context (real stock prices + news) for any mentioned symbols
  3. Construct full message list with enriched system prompt
  4. Call LLM with bound tools (intent detection)
  5. Return a structured AgentResponse — no magic string tokens
"""

import json
import re
import asyncio
from typing import List, AsyncIterator

from langchain_core.tools import tool
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_core.language_models.chat_models import BaseChatModel

from src.config import settings
from src.ai.schemas import Message, AgentResponse, AgentAction, AgentActionPayload
from src.ai.rag import build_rag_context, extract_symbols


# ---------------------------------------------------------------------------
# LLM Factory — swap provider via LLM_PROVIDER env var, zero code change
# ---------------------------------------------------------------------------

def _get_llm(model_override: str | None = None) -> BaseChatModel:
    """Return a configured LLM instance based on settings.LLM_PROVIDER."""
    model = model_override or settings.LLM_MODEL
    provider = settings.LLM_PROVIDER.lower()

    if provider == "openai":
        from langchain_openai import ChatOpenAI
        return ChatOpenAI(model=model, api_key=settings.LLM_API_KEY, temperature=settings.LLM_TEMPERATURE)

    elif provider == "gemini":
        from langchain_google_genai import ChatGoogleGenerativeAI
        return ChatGoogleGenerativeAI(model=model, google_api_key=settings.LLM_API_KEY, temperature=settings.LLM_TEMPERATURE)

    elif provider == "anthropic":
        from langchain_anthropic import ChatAnthropic
        return ChatAnthropic(model=model, api_key=settings.LLM_API_KEY, temperature=settings.LLM_TEMPERATURE)

    else:
        # Default: Ollama (local)
        from langchain_ollama import ChatOllama
        return ChatOllama(
            model=model,
            base_url=settings.OLLAMA_HOST,
            temperature=settings.LLM_TEMPERATURE,
        )


# ---------------------------------------------------------------------------
# Tool definitions — intent detection hooks
# (The LLM calls these to signal a desired UI action)
# ---------------------------------------------------------------------------

@tool
def propose_compare_stocks(symbols: List[str], message: str) -> str:
    """Propose a UI action to compare multiple stocks side-by-side. Use this when the user wants to compare two or more companies. Extract all ticker symbols mentioned (e.g. RELIANCE, TCS, INFY, HDFCBANK).
    'message' MUST contain your helpful, natural language conversational response to the user."""
    pass


@tool
def propose_time_travel(symbol1: str, symbol2: str, message: str) -> str:
    """Propose a UI action to run a visual backtest / time-travel simulation for two stocks.
    'message' MUST contain your helpful, natural language conversational response to the user."""
    pass


@tool
def propose_rebalance(message: str) -> str:
    """Propose a UI action to de-risk or rebalance the user's portfolio.
    'message' MUST contain your helpful, natural language conversational response to the user."""
    pass


_TOOLS = [propose_compare_stocks, propose_time_travel, propose_rebalance]


# ---------------------------------------------------------------------------
# Symbol extraction helpers (duplicated from rag.py for tool call args)
# ---------------------------------------------------------------------------

def _extract_symbols_from_args(args: dict) -> List[str]:
    """Safely extract a list of symbols from LLM tool call args."""
    raw = args.get("symbols", [])
    if isinstance(raw, str):
        try:
            raw = json.loads(raw)
        except json.JSONDecodeError:
            raw = [s.strip(' "[]') for s in raw.split(",")]
    if isinstance(raw, list):
        symbols = [str(s).upper().strip() for s in raw]
    else:
        symbols = []

    if len(symbols) < 2:
        sym1 = args.get("symbol1", "")
        sym2 = args.get("symbol2", "")
        if sym1 and sym2:
            symbols = [str(sym1).upper(), str(sym2).upper()]

    return symbols


# ---------------------------------------------------------------------------
# Tool call → structured AgentAction converter
# ---------------------------------------------------------------------------

def _tool_call_to_action(name: str, args: dict, ai_text: str = "") -> AgentResponse | None:
    """
    Convert an LLM tool call into a structured AgentResponse.
    Returns None if the tool name is unrecognised.
    """
    name = (name or "").lower().replace(" ", "_")
    ai_text = ai_text.strip() if ai_text else ""
    
    # Extract the generated conversational response from the tool arguments
    tool_message = args.get("message", "").strip()
    final_text = tool_message or ai_text or "Here is the information you requested."

    if name in ("propose_compare_stocks", "compare_stocks"):
        symbols = _extract_symbols_from_args(args)
        if not symbols:
            return None
        return AgentResponse(
            text=final_text,
            action=AgentAction(
                type="NAVIGATE_COMPARE",
                payload=AgentActionPayload(symbols=symbols),
                label=f"Compare {' vs '.join(symbols)}",
            ),
            model_used=settings.LLM_MODEL,
        )

    elif name == "propose_time_travel":
        sym1 = args.get("symbol1", "").upper()
        sym2 = args.get("symbol2", "").upper()
        symbols = [s for s in [sym1, sym2] if s]
        return AgentResponse(
            text=final_text,
            action=AgentAction(
                type="NAVIGATE_TIMETRAVEL",
                payload=AgentActionPayload(symbols=symbols),
                label=f"Time Travel: {sym1} vs {sym2}" if sym1 and sym2 else "Time Travel",
            ),
            model_used=settings.LLM_MODEL,
        )

    elif name == "propose_rebalance":
        return AgentResponse(
            text=final_text,
            action=AgentAction(
                type="NAVIGATE_REBALANCE",
                payload=AgentActionPayload(),
                label="Rebalance Portfolio",
            ),
            model_used=settings.LLM_MODEL,
        )

    return None


# ---------------------------------------------------------------------------
# JSON fallback — some Ollama models return tool calls as raw JSON text
# ---------------------------------------------------------------------------

# Regex to find a JSON object anywhere inside a string
_JSON_OBJ_RE = re.compile(r'\{[^{}]*"name"\s*:\s*"(?:propose_\w+|compare_\w+)"[^{}]*\}', re.DOTALL)


def _try_parse_json_tool_call(content: str) -> AgentResponse | None:
    """
    Handle models (e.g. llama3.2) that sometimes return tool calls as
    raw JSON text — either as the full content OR embedded inside prose.

    Handles three patterns:
      1. Entire content is JSON: `{"name": "propose_compare_stocks", ...}`
      2. JSON embedded mid-sentence: `Sure! {"name": "propose_rebalance", ...}`
      3. JSON at end after text: `Let me help. {"name": ...}`
    """
    clean_text = _clean_leaked_json(content)

    # Pattern 1: Entire content is valid JSON
    try:
        parsed = json.loads(content.strip())
        if isinstance(parsed, dict) and parsed.get("name"):
            name = parsed.get("name", "")
            args = parsed.get("parameters", parsed.get("args", parsed.get("arguments", {})))
            return _tool_call_to_action(name, args, clean_text)
    except (json.JSONDecodeError, Exception):
        pass

    # Pattern 2 & 3: JSON blob embedded inside text — find and extract it
    match = _JSON_OBJ_RE.search(content)
    if match:
        try:
            parsed = json.loads(match.group())
            if isinstance(parsed, dict) and parsed.get("name"):
                name = parsed.get("name", "")
                args = parsed.get("parameters", parsed.get("args", parsed.get("arguments", {})))
                result = _tool_call_to_action(name, args, clean_text)
                if result:
                    return result
        except (json.JSONDecodeError, Exception):
            pass

    return None


def _clean_leaked_json(text: str) -> str:
    """
    Strip any leaked JSON tool-call blobs from a plain-text response.
    Called on Path C (plain text) as a safety net in case pattern matching
    in _try_parse_json_tool_call missed something but the blob is still
    visible in the output.
    """
    cleaned = _JSON_OBJ_RE.sub('', text).strip()
    # Also strip trailing punctuation artifacts left after removal
    cleaned = re.sub(r'\s{2,}', ' ', cleaned)  # collapse multiple spaces
    cleaned = re.sub(r'\.\s*\.', '.', cleaned)  # collapse double periods
    return cleaned.strip()


# ---------------------------------------------------------------------------
# System prompt builder
# ---------------------------------------------------------------------------

_BASE_SYSTEM_PROMPT = """You are Bolt, an intelligent stock market AI assistant for NammaStocks — an Indian stock market platform focused on NSE-listed equities.

Your capabilities:
- Analyze Indian stocks (NSE), sectors, and market trends
- Compare multiple stocks side-by-side
- Run visual backtests (time-travel simulations)
- Suggest portfolio rebalancing strategies
- Answer questions about fundamentals, technicals, and market sentiment

Rules:
- ALWAYS provide a helpful, natural language conversational response to the user's query.
- If the user's request matches a UI action (compare, backtest, rebalance), YOU MUST use the relevant tool to trigger the UI widget, and pass your conversational response into the 'message' argument of the tool.
- If the request DOES NOT match a UI action, just reply normally as text.
- When using tools, extract EXACT NSE ticker symbols (e.g. RELIANCE, TCS, INFY, HDFCBANK, not company names)
- If live market data is provided below, USE IT in your answer — do not rely on training data for current prices
- Be concise and direct. This is a trading platform, not a chatbot.
- Format numbers in Indian style (lakhs, crores) when relevant
"""


def _build_system_message(rag_context: str) -> SystemMessage:
    if rag_context:
        content = _BASE_SYSTEM_PROMPT + "\n\n" + rag_context
    else:
        content = _BASE_SYSTEM_PROMPT
    return SystemMessage(content=content)


# ---------------------------------------------------------------------------
# Main entry point
# ---------------------------------------------------------------------------

async def get_chat_response(messages: List[Message], model: str | None = None) -> AgentResponse:
    """
    Process a conversation and return a structured AgentResponse.

    Steps:
    1. Build RAG context from the latest user message
    2. Construct LangChain messages with enriched system prompt
    3. Call LLM with tool bindings
    4. Parse tool calls → AgentAction, or return plain text
    """
    # 1. Get the latest user message for RAG
    user_messages = [m for m in messages if m.role == "user"]
    latest_query = user_messages[-1].content if user_messages else ""

    # 2. Build RAG context (concurrent: stock prices + news)
    rag_context = await build_rag_context(latest_query)

    # 3. Build LangChain message list
    lc_messages = [_build_system_message(rag_context)]
    for msg in messages:
        if msg.role == "user":
            lc_messages.append(HumanMessage(content=msg.content))
        elif msg.role == "assistant":
            lc_messages.append(AIMessage(content=msg.content))
        elif msg.role == "system":
            # Allow caller to inject additional system context
            lc_messages.append(SystemMessage(content=msg.content))

    # 4. Call LLM with fallback (docker host → localhost)
    return await _invoke_with_fallback(lc_messages, model)


async def _invoke_with_fallback(lc_messages: list, model: str | None) -> AgentResponse:
    """Try primary Ollama host, fallback to localhost if connection fails."""
    try:
        return await _invoke_llm(lc_messages, model, base_url=settings.OLLAMA_HOST)
    except Exception as primary_err:
        print(f"[AI] Primary host failed ({settings.OLLAMA_HOST}): {primary_err}")
        # Only fallback for Ollama provider
        if settings.LLM_PROVIDER.lower() == "ollama":
            try:
                return await _invoke_llm(lc_messages, model, base_url="http://localhost:11434")
            except Exception as fallback_err:
                print(f"[AI] Localhost fallback also failed: {fallback_err}")
        return AgentResponse(
            text="I'm having trouble connecting to my brain right now. Please ensure Ollama is running locally.",
            action=None,
            model_used=None,
        )


async def _invoke_llm(lc_messages: list, model: str | None, base_url: str | None = None) -> AgentResponse:
    """
    Core LLM invocation with tool binding and response parsing.
    `base_url` is only used for Ollama provider overrides.
    """
    actual_model = model or settings.LLM_MODEL

    # Build LLM — override base_url for Ollama fallback path
    if settings.LLM_PROVIDER.lower() == "ollama" and base_url:
        from langchain_ollama import ChatOllama
        llm = ChatOllama(
            model=actual_model,
            base_url=base_url,
            temperature=settings.LLM_TEMPERATURE,
        )
    else:
        llm = _get_llm(actual_model)

    llm_with_tools = llm.bind_tools(_TOOLS)
    response = await llm_with_tools.ainvoke(lc_messages)

    # --- Path A: proper structured tool_calls from the model ---
    if response.tool_calls:
        tool_call = response.tool_calls[0]
        
        # Some models put the answer in response.content alongside the tool_call
        ai_text = response.content if isinstance(response.content, str) else ""
        
        result = _tool_call_to_action(
            tool_call.get("name", ""),
            tool_call.get("args", {}),
            ai_text=ai_text
        )
        if result:
            result.model_used = actual_model
            return result

    # --- Path B: model returned JSON text (llama3.2 quirk) ---
    if response.content:
        json_result = _try_parse_json_tool_call(response.content)
        if json_result:
            json_result.model_used = actual_model
            return json_result

    # --- Path C: plain text answer ---
    # Safety net: strip any leaked JSON tool-call blobs the model may have
    # embedded in an otherwise plain-text response (llama3.2 quirk).
    clean_text = _clean_leaked_json(response.content) if response.content else ""
    return AgentResponse(
        text=clean_text or "I couldn't generate a response. Please try again.",
        action=None,
        model_used=actual_model,
    )


# ---------------------------------------------------------------------------
# Streaming support
# ---------------------------------------------------------------------------

async def stream_chat_response(messages: List[Message], model: str | None = None) -> AsyncIterator[str]:
    """
    Stream the LLM response token-by-token as Server-Sent Events data strings.
    Yields JSON strings: `{"chunk": "text"}` or `{"done": true, "action": {...}}`

    Note: Tool calls don't stream — if a tool is detected, we emit the full action at the end.
    """
    user_messages = [m for m in messages if m.role == "user"]
    latest_query = user_messages[-1].content if user_messages else ""
    rag_context = await build_rag_context(latest_query)

    lc_messages = [_build_system_message(rag_context)]
    for msg in messages:
        if msg.role == "user":
            lc_messages.append(HumanMessage(content=msg.content))
        elif msg.role == "assistant":
            lc_messages.append(AIMessage(content=msg.content))

    actual_model = model or settings.LLM_MODEL
    accumulated = ""

    try:
        if settings.LLM_PROVIDER.lower() == "ollama":
            from langchain_ollama import ChatOllama
            llm = ChatOllama(model=actual_model, base_url=settings.OLLAMA_HOST, temperature=settings.LLM_TEMPERATURE)
        else:
            llm = _get_llm(actual_model)

        # Stream without tools first (tools don't support streaming in most providers)
        async for chunk in llm.astream(lc_messages):
            text = chunk.content or ""
            accumulated += text
            if text:
                yield f"data: {json.dumps({'chunk': text})}\n\n"

        # After full accumulation, check if it was a JSON tool call
        json_result = _try_parse_json_tool_call(accumulated)
        if json_result:
            yield f"data: {json.dumps({'done': True, 'action': json_result.action.model_dump() if json_result.action else None, 'text': json_result.text})}\n\n"
        else:
            yield f"data: {json.dumps({'done': True, 'action': None})}\n\n"

    except Exception as e:
        print(f"[AI Stream] Error: {e}")
        yield f"data: {json.dumps({'chunk': 'Sorry, I encountered an error. Please try again.'})}\n\n"
        yield f"data: {json.dumps({'done': True, 'action': None})}\n\n"
