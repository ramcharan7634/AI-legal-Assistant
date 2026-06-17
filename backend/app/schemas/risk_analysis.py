from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class RiskAnalysisBase(BaseModel):
    clause: str


class RiskAnalysisCreate(RiskAnalysisBase):
    pass


class RiskAnalysisResponse(RiskAnalysisBase):
    id: int
    user_id: int
    risk_level: str
    confidence_score: float
    created_at: datetime

    class Config:
        from_attributes = True


class RiskAnalysisRequest(BaseModel):
    clause: str

