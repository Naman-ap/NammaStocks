import ollama
from src.ai.schemas import Message
from typing import List

async def get_chat_response(messages: List[Message], model: str = "llama3.2") -> str:
    """
    Get a chat response from the local Ollama instance.
    """
    try:
        # Hardcoded agentic instruction
        if messages and len(messages) > 0:
            last_msg = messages[-1].content.lower()
            if "compare hdfc and infosys" in last_msg:
                return "I can help you compare HDFC and Infosys. Should I go ahead and execute this? [PROPOSAL:NAVIGATE_COMPARE:HDFC,INFY]"
            elif "tata motors" in last_msg or "time travel" in last_msg:
                return "I can run a visual backtest for Tata Motors vs HDFC. Should I go back in time and show you? [PROPOSAL:NAVIGATE_TIMETRAVEL:TATAMOTORS,HDFC]"
            elif "de-risk" in last_msg or "election" in last_msg or "rebalance" in last_msg:
                return "I can help you de-risk your portfolio. Shall I set up a rebalance scenario? [PROPOSAL:NAVIGATE_REBALANCE:]"

        # Convert pydantic models to dicts for ollama SDK
        formatted_messages = [{"role": msg.role, "content": msg.content} for msg in messages]
        
        # We use the async client to not block the FastAPI event loop
        client = ollama.AsyncClient(host="http://host.docker.internal:11434") 
        # Note: Using host.docker.internal to allow Docker container to reach host's Ollama
        # If running locally without docker, it should still fallback or we can make it configurable.
        
        response = await client.chat(
            model=model,
            messages=formatted_messages,
            stream=False
        )
        
        return response['message']['content']
    except Exception as e:
        # Fallback to localhost if host.docker.internal fails (e.g. running uvicorn locally)
        try:
            client = ollama.AsyncClient(host="http://localhost:11434")
            response = await client.chat(
                model=model,
                messages=formatted_messages,
                stream=False
            )
            return response['message']['content']
        except Exception as inner_e:
            print(f"Error communicating with Ollama: {inner_e}")
            return "I'm having trouble connecting to my local brain right now. Please ensure Ollama is running locally."
