from fastapi import APIRouter, HTTPException
from src.ai.schemas import ChatRequest, ChatResponse
from src.ai.service import get_chat_response

router = APIRouter(prefix="/ai", tags=["AI Agent"])

@router.post("/chat", response_model=ChatResponse)
async def chat_with_agent(request: ChatRequest):
    """
    Send a conversation to the AI agent and get a response.
    """
    try:
        response_text = await get_chat_response(request.messages, request.model)
        return ChatResponse(response=response_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
