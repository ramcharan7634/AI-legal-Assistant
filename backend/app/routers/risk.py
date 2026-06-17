from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.session import get_db
from app.models.user import User
from app.models.risk_analysis import RiskAnalysis
from app.schemas.risk_analysis import RiskAnalysisCreate, RiskAnalysisResponse, RiskAnalysisRequest
from app.services.risk_analyzer import risk_analyzer_service
from app.core.security import get_current_user

router = APIRouter(prefix="/api/risk", tags=["Risk Analysis"])


@router.post("/analyze", response_model=RiskAnalysisResponse, status_code=status.HTTP_201_CREATED)
def analyze_clause(
    request: RiskAnalysisRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Analyze a legal clause for risk level."""
    # Analyze the clause using AI
    result = risk_analyzer_service.analyze(request.clause)
    
    # Save to database
    risk_analysis = RiskAnalysis(
        user_id=current_user.id,
        clause=request.clause,
        risk_level=result["risk_level"],
        confidence_score=result["confidence_score"]
    )
    
    db.add(risk_analysis)
    db.commit()
    db.refresh(risk_analysis)
    
    return risk_analysis


@router.get("/history", response_model=List[RiskAnalysisResponse])
def get_risk_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's risk analysis history."""
    analyses = db.query(RiskAnalysis).filter(
        RiskAnalysis.user_id == current_user.id
    ).order_by(RiskAnalysis.created_at.desc()).all()
    
    return analyses


@router.get("/{analysis_id}", response_model=RiskAnalysisResponse)
def get_analysis(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific risk analysis."""
    analysis = db.query(RiskAnalysis).filter(
        RiskAnalysis.id == analysis_id,
        RiskAnalysis.user_id == current_user.id
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    return analysis

