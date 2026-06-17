import spacy
from typing import Dict, Any, List
import warnings
warnings.filterwarnings('ignore')


class EntityExtractorService:
    """Service for extracting legal entities from text using spaCy."""
    
    def __init__(self):
        # Load English language model
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            # Download the model if not available
            import subprocess
            subprocess.run(["python", "-m", "spacy", "download", "en_core_web_sm"])
            self.nlp = spacy.load("en_core_web_sm")
        
        # Add money pattern to the pipeline
        self.nlp.add_pipe("merge_noun_chunks")
    
    def extract_entities(self, text: str) -> Dict[str, Any]:
        """
        Extract legal entities from text.
        
        Args:
            text: The legal text to analyze
            
        Returns:
            Dictionary with extracted entities
        """
        doc = self.nlp(text)
        
        entities = {
            "persons": [],
            "organizations": [],
            "dates": [],
            "money": [],
            "locations": [],
            "other": []
        }
        
        for ent in doc.ents:
            if ent.label_ == "PERSON":
                entities["persons"].append({
                    "text": ent.text,
                    "start": ent.start_char,
                    "end": ent.end_char
                })
            elif ent.label_ == "ORG":
                entities["organizations"].append({
                    "text": ent.text,
                    "start": ent.start_char,
                    "end": ent.end_char
                })
            elif ent.label_ in ["DATE", "TIME"]:
                entities["dates"].append({
                    "text": ent.text,
                    "start": ent.start_char,
                    "end": ent.end_char
                })
            elif ent.label_ == "MONEY":
                entities["money"].append({
                    "text": ent.text,
                    "start": ent.start_char,
                    "end": ent.end_char
                })
            elif ent.label_ in ["GPE", "LOC", "FAC"]:
                entities["locations"].append({
                    "text": ent.text,
                    "start": ent.start_char,
                    "end": ent.end_char
                })
            else:
                entities["other"].append({
                    "text": ent.text,
                    "label": ent.label_,
                    "start": ent.start_char,
                    "end": ent.end_char
                })
        
        # Extract money amounts using regex pattern
        import re
        money_pattern = r'\$[\d,]+(?:\.\d{2})?(?:\s*(?:USD|dollars?|million|billion|k))?'
        money_matches = re.findall(money_pattern, text)
        for match in money_matches:
            if not any(m['text'] == match for m in entities["money"]):
                entities["money"].append({
                    "text": match,
                    "start": text.find(match),
                    "end": text.find(match) + len(match)
                })
        
        # Count total entities
        total_entities = sum(len(v) for v in entities.values())
        
        return {
            "entities": entities,
            "total_count": total_entities,
            "text_length": len(text)
        }
    
    def extract_key_terms(self, text: str) -> List[str]:
        """
        Extract key legal terms from text.
        
        Args:
            text: The legal text to analyze
            
        Returns:
            List of key terms
        """
        doc = self.nlp(text)
        
        # Extract nouns and proper nouns
        key_terms = []
        for token in doc:
            if token.pos_ in ["NOUN", "PROPN"] and len(token.text) > 3:
                key_terms.append(token.text)
        
        # Remove duplicates while preserving order
        seen = set()
        unique_terms = []
        for term in key_terms:
            if term.lower() not in seen:
                seen.add(term.lower())
                unique_terms.append(term)
        
        return unique_terms[:20]  # Return top 20 terms


# Singleton instance
entity_extractor_service = EntityExtractorService()

