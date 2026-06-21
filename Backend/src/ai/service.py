import os
import json
from typing import List
from src.ai.schemas import Message
from langchain_core.tools import tool
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

@tool
def propose_compare_stocks(symbols: List[str]) -> str:
    """Propose a UI action to compare multiple stocks. Use this when the user asks to compare two or more companies. Extract all mentioned ticker symbols into a list."""
    pass

@tool
def propose_time_travel(symbol1: str, symbol2: str) -> str:
    """Propose a UI action to run a visual backtest or time travel for stocks."""
    pass

@tool
def propose_rebalance() -> str:
    """Propose a UI action to de-risk or rebalance the portfolio."""
    pass

def _extract_symbols(args: dict) -> List[str]:
    raw = args.get("symbols", [])
    if isinstance(raw, str):
        try:
            raw = json.loads(raw)
        except json.JSONDecodeError:
            raw = [s.strip(' "[]') for s in raw.split(',')]
    if isinstance(raw, list):
        symbols = [str(s).upper() for s in raw]
    else:
        symbols = []
        
    if len(symbols) < 2:
        sym1 = args.get("symbol1", "")
        sym2 = args.get("symbol2", "")
        if sym1 and sym2:
            symbols = [str(sym1).upper(), str(sym2).upper()]
            
    return symbols

def _handle_tool_call(name: str, args: dict) -> str | None:
    if not name: return None
    
    if name in ["propose_compare_stocks", "compare_stocks"]:
        symbols = _extract_symbols(args)
        sym_str = ",".join(symbols)
        human_readable = ", ".join(symbols[:-1]) + " and " + symbols[-1] if len(symbols) > 1 else symbols[0] if symbols else ""
        return f"I can help you compare {human_readable}. Should I go ahead and execute this? [PROPOSAL:NAVIGATE_COMPARE:{sym_str}]"
    elif name == "propose_time_travel":
        sym1 = args.get("symbol1", "").upper()
        sym2 = args.get("symbol2", "").upper()
        return f"I can run a visual backtest for {sym1} vs {sym2}. Should I go back in time and show you? [PROPOSAL:NAVIGATE_TIMETRAVEL:{sym1},{sym2}]"
    elif name == "propose_rebalance":
        return "I can help you de-risk your portfolio. Shall I set up a rebalance scenario? [PROPOSAL:NAVIGATE_REBALANCE:]"
    return None

async def get_chat_response(messages: List[Message], model: str = "mistral") -> str:
    """
    Get a chat response using LangChain and ChatOllama with tool binding.
    """
    try:
        # 1. Convert pydantic models to LangChain messages
        langchain_messages = []
        # Add a system prompt to guide the tool usage
        langchain_messages.append(SystemMessage(content="You are a helpful stock market AI assistant. Use the provided tools to propose UI actions if the user's request matches them. Always extract exact stock ticker symbols (e.g., RELIANCE, TCS, INFY, HDFCBANK) when using tools."))
        
        for msg in messages:
            if msg.role == "user":
                langchain_messages.append(HumanMessage(content=msg.content))
            elif msg.role == "assistant":
                langchain_messages.append(AIMessage(content=msg.content))
            elif msg.role == "system":
                langchain_messages.append(SystemMessage(content=msg.content))
        
        # 2. Initialize ChatOllama
        # Try docker internal host first, fallback to localhost is handled by passing both or trying
        host = os.getenv("OLLAMA_HOST", "http://host.docker.internal:11434")
        
        llm = ChatOllama(
            model=model,
            base_url=host,
            temperature=0.0
        )
        
        # 3. Bind tools
        llm_with_tools = llm.bind_tools([propose_compare_stocks, propose_time_travel, propose_rebalance])
        
        # 4. Invoke LLM
        response = await llm_with_tools.ainvoke(langchain_messages)
        
        # 5. Intercept Tool Calls
        if response.tool_calls:
            tool_call = response.tool_calls[0]
            result = _handle_tool_call(tool_call.get("name", ""), tool_call.get("args", {}))
            if result: return result
                
        # 6. Fallback to regular text if no tools called
        # Llama3.2 sometimes fails tool_calls and returns JSON text directly.
        try:
            content_json = json.loads(response.content)
            if isinstance(content_json, dict):
                name = content_json.get("name")
                args = content_json.get("parameters", content_json.get("args", {}))
                result = _handle_tool_call(name, args)
                if result: return result
        except:
            pass

        return response.content
        
    except Exception as e:
        # Fallback to localhost if host.docker.internal fails (e.g. running uvicorn locally)
        try:
            llm = ChatOllama(
                model=model,
                base_url="http://localhost:11434",
                temperature=0.0
            )
            llm_with_tools = llm.bind_tools([propose_compare_stocks, propose_time_travel, propose_rebalance])
            response = await llm_with_tools.ainvoke(langchain_messages)
            
            if response.tool_calls:
                tool_call = response.tool_calls[0]
                result = _handle_tool_call(tool_call.get("name", ""), tool_call.get("args", {}))
                if result: return result
                
            try:
                content_json = json.loads(response.content)
                if isinstance(content_json, dict):
                    name = content_json.get("name")
                    args = content_json.get("parameters", content_json.get("args", {}))
                    result = _handle_tool_call(name, args)
                    if result: return result
            except:
                pass
                    
            return response.content
        except Exception as inner_e:
            print(f"Error communicating with Ollama via LangChain: {inner_e}")
            return "I'm having trouble connecting to my local brain right now. Please ensure Ollama is running locally."
