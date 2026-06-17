from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional

from app.models.user import User
from app.services.summarizer import summarizer_service
from app.core.security import get_current_user

router = APIRouter(prefix="/api/summarize", tags=["Summarizer"])


class SummarizeRequest(BaseModel):
    text: str
    max_length: Optional[int] = 200
    min_length: Optional[int] = 50


class SummarizeResponse(BaseModel):
    summary: str
    original_length: int
    summary_length: int
    compression_ratio: float
    note: Optional[str] = None


@router.post("", response_model=SummarizeResponse)
def summarize_text(
    request: SummarizeRequest,
    current_user: User = Depends(get_current_user)
):
    """Summarize legal text using AI."""
    if not request.text or len(request.text.strip()) < 50:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Text must be at least 50 characters long"
        )
    
    result = summarizer_service.summarize(
        request.text,
        max_length=request.max_length,
        min_length=request.min_length
    )
    
    return SummarizeResponse(
        summary=result.get("summary", ""),
        original_length=result.get("original_length", 0),
        summary_length=result.get("summary_length", 0),
        compression_ratio=result.get("compression_ratio", 0),
        note=result.get("note")
    )

