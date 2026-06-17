from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Dict, Any

from app.models.user import User
from app.services.entity_extractor import entity_extractor_service
from app.core.security import get_current_user

router = APIRouter(prefix="/api/entities", tags=["Entity Extraction"])


class ExtractRequest(BaseModel):
    text: str


class EntityResponse(BaseModel):
    entities: Dict[str, List[Dict[str, Any]]]
    total_count: int
    text_length: int


class KeyTermsResponse(BaseModel):
    key_terms: List[str]


@router.post("/extract", response_model=EntityResponse)
def extract_entities(
    request: ExtractRequest,
    current_user: User = Depends(get_current_user)
):
    """Extract legal entities from text using spaCy."""
    if not request.text or len(request.text.strip()) < 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Text must be at least 10 characters long"
        )
    
    result = entity_extractor_service.extract_entities(request.text)
    
    return EntityResponse(
        entities=result.get("entities", {}),
        total_count=result.get("total_count", 0),
        text_length=result.get("text_length", 0)
    )


@router.post("/terms", response_model=KeyTermsResponse)
def extract_key_terms(
    request: ExtractRequest,
    current_user: User = Depends(get_current_user)
):
    """Extract key legal terms from text."""
    if not request.text or len(request.text.strip()) < 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Text must be at least 10 characters long"
        )
    
    key_terms = entity_extractor_service.extract_key_terms(request.text)
    
    return KeyTermsResponse(key_terms=key_terms)

