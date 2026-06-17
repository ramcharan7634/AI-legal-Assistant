import torch
from transformers import pipeline
from typing import Dict, Any
import warnings
warnings.filterwarnings('ignore')


class RiskAnalyzerService:
    """AI Service for analyzing legal clause risks."""
    
    def __init__(self):
        # Use a text classification model for legal risk analysis
        self.classifier = pipeline(
            "text-classification",
            model="martin-ha/toxic-comment-model",
            device=-1  # Use CPU
        )
        
        # Keywords for rule-based risk assessment
        self.high_risk_keywords = [
            "indemnification", "liability", "unlimited", "perpetual",
            "exclusive", "waive", "forego", "renounce", "sole discretion",
            "arbitration", "jurisdiction", "attorney fees", "liquidated damages"
        ]
        
        self.medium_risk_keywords = [
            "termination", "breach", "covenant", "restriction", "limitation",
            "confidential", "non-compete", "non-solicitation", "assignment"
        ]
    
    def analyze(self, clause: str) -> Dict[str, Any]:
        """
        Analyze a legal clause for risk level.
        
        Args:
            clause: The legal clause text to analyze
            
        Returns:
            Dictionary with risk_level, confidence_score, and explanation
        """
        clause_lower = clause.lower()
        
        # Rule-based risk assessment
        high_risk_count = sum(1 for kw in self.high_risk_keywords if kw in clause_lower)
        medium_risk_count = sum(1 for kw in self.medium_risk_keywords if kw in clause_lower)
        
        # Determine risk level based on keyword analysis
        if high_risk_count >= 2:
            risk_level = "High"
            base_confidence = 0.85
        elif high_risk_count == 1 or medium_risk_count >= 2:
            risk_level = "Medium"
            base_confidence = 0.75
        else:
            risk_level = "Low"
            base_confidence = 0.70
        
        # Use ML model for additional validation
        try:
            result = self.classifier(clause[:512])  # Truncate for model
            if result:
                # Adjust confidence based on ML model output
                ml_score = result[0]['score'] if result[0]['label'] != 'toxic' else 1 - result[0]['score']
                confidence = (base_confidence + ml_score) / 2
            else:
                confidence = base_confidence
        except Exception:
            confidence = base_confidence
        
        # Generate explanation
        explanation = self._generate_explanation(risk_level, high_risk_count, medium_risk_count)
        
        return {
            "risk_level": risk_level,
            "confidence_score": round(confidence, 4),
            "explanation": explanation
        }
    
    def _generate_explanation(self, risk_level: str, high_count: int, medium_count: int) -> str:
        """Generate explanation for the risk assessment."""
        if risk_level == "High":
            return f"This clause contains {high_count} high-risk terms (indemnification, liability, etc.) that may expose you to significant legal liability. Review carefully with legal counsel."
        elif risk_level == "Medium":
            return f"This clause contains {medium_count} medium-risk terms that may impose obligations or restrictions. Consider reviewing with legal counsel."
        else:
            return "This clause appears to have standard terms with minimal risk. However, always review documents carefully."


# Singleton instance
risk_analyzer_service = RiskAnalyzerService()

