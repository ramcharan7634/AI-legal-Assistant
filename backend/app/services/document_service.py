import fitz  # PyMuPDF
from typing import Dict, Any
import warnings
warnings.filterwarnings('ignore')


class DocumentService:
    """Service for handling PDF documents."""
    
    def extract_text_from_pdf(self, pdf_content: bytes) -> str:
        """
        Extract text from PDF content.
        
        Args:
            pdf_content: PDF file content as bytes
            
        Returns:
            Extracted text from the PDF
        """
        try:
            # Open PDF from bytes
            pdf_document = fitz.open(stream=pdf_content, filetype="pdf")
            
            text = ""
            for page in pdf_document:
                text += page.get_text()
            
            pdf_document.close()
            
            if not text.strip():
                return "No text could be extracted from the PDF."
            
            return text
        except Exception as e:
            raise Exception(f"Error extracting text from PDF: {str(e)}")
    
    def get_pdf_metadata(self, pdf_content: bytes) -> Dict[str, Any]:
        """
        Get metadata from PDF.
        
        Args:
            pdf_content: PDF file content as bytes
            
        Returns:
            Dictionary with PDF metadata
        """
        try:
            pdf_document = fitz.open(stream=pdf_content, filetype="pdf")
            
            metadata = {
                "title": pdf_document.metadata.get("title", ""),
                "author": pdf_document.metadata.get("author", ""),
                "subject": pdf_document.metadata.get("subject", ""),
                "creator": pdf_document.metadata.get("creator", ""),
                "page_count": len(pdf_document),
            }
            
            pdf_document.close()
            return metadata
        except Exception as e:
            return {"page_count": 0, "error": str(e)}


# Singleton instance
document_service = DocumentService()

