from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional, Dict, Any

from app.models.user import User
from app.services.document_generator import document_generator_service
from app.core.security import get_current_user

router = APIRouter(prefix="/api/generate", tags=["Document Generator"])


class RentalAgreementRequest(BaseModel):
    landlord_name: str
    tenant_name: str
    property_address: str
    rent_amount: float
    security_deposit: float
    duration_months: int = 12
    start_date: str  # Format: YYYY-MM-DD


class NDARequest(BaseModel):
    disclosing_party: str
    receiving_party: str
    purpose: str
    duration_years: int = 2
    effective_date: str  # Format: YYYY-MM-DD


class GeneratedDocumentResponse(BaseModel):
    document_type: str
    document_content: str
    created_at: str


@router.post("/rental-agreement", response_model=GeneratedDocumentResponse)
def generate_rental_agreement(
    request: RentalAgreementRequest,
    current_user: User = Depends(get_current_user)
):
    """Generate a rental agreement."""
    # Validate inputs
    if not request.landlord_name or not request.tenant_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Landlord and tenant names are required"
        )
    
    if request.rent_amount <= 0 or request.security_deposit < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rent amount must be positive and deposit must be non-negative"
        )
    
    if request.duration_months <= 0 or request.duration_months > 120:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Duration must be between 1 and 120 months"
        )
    
    document = document_generator_service.generate_rental_agreement(
        {
            "landlord_name": request.landlord_name,
            "tenant_name": request.tenant_name,
            "property_address": request.property_address,
            "rent_amount": str(request.rent_amount),
            "security_deposit": str(request.security_deposit),
            "duration_months": request.duration_months,
            "start_date": request.start_date
        }
    )
    
    from datetime import datetime
    return GeneratedDocumentResponse(
        document_type="Rental Agreement",
        document_content=document,
        created_at=datetime.now().isoformat()
    )


@router.post("/nda", response_model=GeneratedDocumentResponse)
def generate_nda(
    request: NDARequest,
    current_user: User = Depends(get_current_user)
):
    """Generate a Non-Disclosure Agreement."""
    # Validate inputs
    if not request.disclosing_party or not request.receiving_party:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Disclosing and receiving party names are required"
        )
    
    if request.duration_years <= 0 or request.duration_years > 50:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Duration must be between 1 and 50 years"
        )
    
    document = document_generator_service.generate_nda(
        {
            "disclosing_party": request.disclosing_party,
            "receiving_party": request.receiving_party,
            "purpose": request.purpose,
            "duration_years": request.duration_years,
            "effective_date": request.effective_date
        }
    )
    
    from datetime import datetime
    return GeneratedDocumentResponse(
        document_type="Non-Disclosure Agreement",
        document_content=document,
        created_at=datetime.now().isoformat()
    )

