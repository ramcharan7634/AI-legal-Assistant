from transformers import pipeline, AutoTokenizer, AutoModelForSeq2SeqLM
from typing import Dict, Any
import warnings
warnings.filterwarnings('ignore')


class SummarizerService:
    """AI Service for summarizing legal documents."""
    
    def __init__(self):
        # Load FLAN-T5-base model for summarization
        self.model_name = "google/flan-t5-base"
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(self.model_name)
        
        self.summarizer = pipeline(
            "summarization",
            model=self.model,
            tokenizer=self.tokenizer,
            device=-1  # Use CPU
        )
    
    def summarize(self, text: str, max_length: int = 200, min_length: int = 50) -> Dict[str, Any]:
        """
        Summarize legal text using FLAN-T5.
        
        Args:
            text: The legal text to summarize
            max_length: Maximum length of summary
            min_length: Minimum length of summary
            
        Returns:
            Dictionary with summary and metadata
        """
        # Truncate text if too long (model has token limits)
        if len(text) > 3000:
            text = text[:3000]
        
        try:
            # Use the summarization pipeline
            result = self.summarizer(
                text,
                max_length=max_length,
                min_length=min_length,
                do_sample=False
            )
            
            summary = result[0]['summary_text']
            
            return {
                "summary": summary,
                "original_length": len(text),
                "summary_length": len(summary),
                "compression_ratio": round(len(summary) / len(text), 2) if text else 0
            }
        except Exception as e:
            # Fallback to extractive summarization if model fails
            return self._extractive_summarize(text)
    
    def _extractive_summarize(self, text: str) -> Dict[str, Any]:
        """
        Fallback extractive summarization.
        
        Args:
            text: The legal text to summarize
            
        Returns:
            Dictionary with summary
        """
        # Simple extractive summarization
        sentences = text.split('. ')
        if len(sentences) <= 3:
            summary = text
        else:
            # Take first 3 sentences as summary
            summary = '. '.join(sentences[:3]) + '.'
        
        return {
            "summary": summary,
            "original_length": len(text),
            "summary_length": len(summary),
            "compression_ratio": round(len(summary) / len(text), 2) if text else 0,
            "note": "Extractive summarization used due to model limitations"
        }


# Singleton instance
summarizer_service = SummarizerService()

