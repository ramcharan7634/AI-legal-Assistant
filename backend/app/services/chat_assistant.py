from transformers import pipeline, AutoTokenizer, AutoModelForSeq2SeqLM
from typing import Dict, Any, List
import warnings
warnings.filterwarnings('ignore')


class ChatAssistantService:
    """Generative AI service for legal chat using an LLM."""
    
    def __init__(self):
        # Load FLAN-T5 LLM for conversational GenAI responses
        self.model_name = "google/flan-t5-base"
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(self.model_name)
        
        # Legal context prompt
        self.legal_prompt = """You are a helpful legal assistant AI. 
You provide general legal information and guidance, but you are not a lawyer and cannot provide legal advice.
Always remind users to consult with a qualified attorney for specific legal matters.
Be helpful, clear, and concise in your responses."""
    
    def chat(self, message: str, context: List[Dict[str, str]] = None) -> Dict[str, Any]:
        """
        Process a chat message and generate a response.
        
        Args:
            message: The user's message
            context: Previous chat history for context
            
        Returns:
            Dictionary with response and metadata
        """
        # Build context from history
        conversation = self.legal_prompt + "\n\n"
        
        if context:
            for msg in context[-5:]:  # Use last 5 messages for context
                if msg.get("role") == "user":
                    conversation += f"User: {msg['content']}\n"
                else:
                    conversation += f"Assistant: {msg['content']}\n"
        
        conversation += f"User: {message}\nAssistant:"
        
        # Generate response
        try:
            inputs = self.tokenizer(conversation, return_tensors="pt", max_length=512, truncation=True)
            
            outputs = self.model.generate(
                inputs.input_ids,
                max_new_tokens=256,
                num_beams=4,
                do_sample=True,
                temperature=0.7,
                top_p=0.9,
                pad_token_id=self.tokenizer.eos_token_id
            )
            
            response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            
            # Clean up response
            response = response.strip()
            
            # Add disclaimer if not present
            if "consult" not in response.lower() and "attorney" not in response.lower() and "lawyer" not in response.lower():
                response += "\n\n⚠️ Please note: I am an AI assistant and not a lawyer. For specific legal advice, please consult with a qualified attorney."
            
            return {
                "response": response,
                "model": self.model_name,
                "success": True
            }
        except Exception as e:
            return {
                "response": self._fallback_response(message),
                "model": self.model_name,
                "success": False,
                "error": str(e)
            }
    
    def _fallback_response(self, message: str) -> str:
        """Generate a fallback response when the model fails."""
        message_lower = message.lower()
        
        # Simple keyword-based responses
        if "contract" in message_lower:
            return "A contract is a legally binding agreement between two or more parties. For specific contract advice, please consult with an attorney."
        elif "lease" in message_lower or "rent" in message_lower:
            return "A lease is a legal agreement where a landlord rents property to a tenant. Key terms typically include rent amount, duration, and responsibilities."
        elif "nda" in message_lower or "non-disclosure" in message_lower:
            return "A Non-Disclosure Agreement (NDA) is a legal contract to protect confidential information. It establishes a confidential relationship between parties."
        elif "liability" in message_lower:
            return "Liability refers to legal responsibility for one's actions or debts. It's important to understand liability in any legal agreement."
        elif "copyright" in message_lower:
            return "Copyright protects original works of authorship. It automatically exists upon creation, but registration provides additional legal protections."
        elif "trademark" in message_lower:
            return "A trademark is a word, phrase, symbol, or design that identifies and distinguishes the source of goods from others."
        else:
            return """I'm here to help with general legal information. However, I'm an AI assistant and not a substitute for professional legal advice.

For specific legal matters, please:
• Consult with a qualified attorney
• Contact your local bar association for referrals
• Use legal aid services if you cannot afford an attorney

How can I help you with general legal information?"""


# Singleton instance
chat_assistant_service = ChatAssistantService()

