from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.database.session import get_db
from app.models.user import User
from app.models.chat_message import ChatMessage
from app.schemas.chat import ChatRequest, ChatResponse, ChatHistoryResponse, ChatMessageResponse
from app.services.chat_assistant import chat_assistant_service
from app.core.security import get_current_user

router = APIRouter(prefix="/api/chat", tags=["Chat"])


@router.post("", response_model=ChatResponse)
def send_message(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Send a message to the AI legal chat assistant."""
    if not request.message or len(request.message.strip()) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message must be at least 2 characters long"
        )
    
    # Get chat history for context
    history = db.query(ChatMessage).filter(
        ChatMessage.user_id == current_user.id
    ).order_by(ChatMessage.timestamp.desc()).limit(10).all()
    
    # Build context from history
    context = []
    for msg in reversed(history):
        context.append({"role": "user", "content": msg.message})
        context.append({"role": "assistant", "content": msg.response})
    
    # Get AI response
    result = chat_assistant_service.chat(request.message, context)
    
    # Save to database
    chat_message = ChatMessage(
        user_id=current_user.id,
        message=request.message,
        response=result["response"]
    )
    
    db.add(chat_message)
    db.commit()
    db.refresh(chat_message)
    
    return ChatResponse(response=result["response"])


@router.get("/history", response_model=ChatHistoryResponse)
def get_chat_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's chat history."""
    messages = db.query(ChatMessage).filter(
        ChatMessage.user_id == current_user.id
    ).order_by(ChatMessage.timestamp.desc()).limit(50).all()
    
    return ChatHistoryResponse(messages=messages)


@router.delete("/history", status_code=status.HTTP_204_NO_CONTENT)
def clear_chat_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Clear user's chat history."""
    db.query(ChatMessage).filter(
        ChatMessage.user_id == current_user.id
    ).delete()
    db.commit()
    
    return None

