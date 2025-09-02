# Python spaCy Backend Service for X-Ear CRM
# File: spacy-backend/app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
import spacy
import logging
from datetime import datetime
import re
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for web app integration

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TurkishMedicalNLP:
    def __init__(self):
        self.nlp = None
        self.custom_entities = {}
        self.medical_terms = {}
        self.initialized = False
        
    def initialize(self):
        """Initialize spaCy models and custom components"""
        try:
            # Try loading Turkish language models in order of preference
            models_to_try = [
                "tr_core_news_lg",
                "tr_core_news_md", 
                "tr_core_news_sm",
                "xx_ent_wiki_sm",  # Multilingual model as fallback
                "en_core_web_sm"   # English model as last resort
            ]
            
            for model_name in models_to_try:
                try:
                    logger.info(f"Attempting to load model: {model_name}")
                    self.nlp = spacy.load(model_name)
                    logger.info(f"✅ Successfully loaded model: {model_name}")
                    break
                except OSError:
                    logger.warning(f"Model {model_name} not available")
                    continue
            else:
                # If no models work, create a blank Turkish model
                logger.warning("No pre-trained models available, creating blank Turkish model...")
                self.nlp = spacy.blank("tr")
                # Add sentence segmentation for blank model
                self.nlp.add_pipe("sentencizer")
                logger.info("✅ Created blank Turkish model with sentencizer")
            
            # Add custom medical entity patterns
            self._add_medical_patterns()
            
            # Load medical terminology
            self._load_medical_terms()
            
            self.initialized = True
            logger.info("✅ Turkish Medical NLP initialized successfully")
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize NLP: {e}")
            # Create minimal fallback
            self.nlp = spacy.blank("tr")
            self.medical_terms = {}
            self.initialized = False
            raise
    
    def _add_medical_patterns(self):
        """Add custom medical entity patterns"""
        from spacy.matcher import Matcher
        
        # Create matcher for custom patterns
        matcher = Matcher(self.nlp.vocab)
        
        # TC Number patterns
        tc_pattern = [{"TEXT": {"REGEX": r"\d{11}"}}]
        matcher.add("TC_NUMBER", [tc_pattern])
        
        # Medical device patterns
        device_patterns = [
            [{"LOWER": "işitme"}, {"LOWER": "cihazı"}],
            [{"LOWER": "hearing"}, {"LOWER": "aid"}],
            [{"LOWER": "koklear"}, {"LOWER": "implant"}],
            [{"LOWER": "cochlear"}, {"LOWER": "implant"}]
        ]
        matcher.add("MEDICAL_DEVICE", device_patterns)
        
        # Medical condition patterns
        condition_patterns = [
            [{"LOWER": "işitme"}, {"LOWER": "kaybı"}],
            [{"LOWER": "hearing"}, {"LOWER": "loss"}],
            [{"LOWER": "sağırlık"}],
            [{"LOWER": "tinnitus"}],
            [{"LOWER": "vertigo"}]
        ]
        matcher.add("MEDICAL_CONDITION", condition_patterns)
        
        # Patient name patterns (prioritize these)
        patient_patterns = [
            [{"LOWER": "hasta"}, {"LOWER": "adi"}, {"LOWER": "soyadi"}, {"LOWER": ":"}, {"IS_ALPHA": True, "LENGTH": {">=": 2}}],
            [{"LOWER": "hasta"}, {"LOWER": "adı"}, {"LOWER": "soyadı"}, {"LOWER": ":"}, {"IS_ALPHA": True, "LENGTH": {">=": 2}}],
            [{"LOWER": "hasta"}, {"LOWER": "adi"}, {"LOWER": ":"}, {"IS_ALPHA": True, "LENGTH": {">=": 2}}],
            [{"LOWER": "hasta"}, {"LOWER": "adı"}, {"LOWER": ":"}, {"IS_ALPHA": True, "LENGTH": {">=": 2}}],
            [{"LOWER": "patient"}, {"LOWER": "name"}, {"LOWER": ":"}, {"IS_ALPHA": True, "LENGTH": {">=": 2}}]
        ]
        matcher.add("PATIENT_NAME", patient_patterns)
        
        # Doctor/staff patterns (to exclude)
        doctor_patterns = [
            [{"LOWER": "dr"}, {"LOWER": "."}, {"IS_ALPHA": True}],
            [{"LOWER": "doktor"}, {"IS_ALPHA": True}],
            [{"LOWER": "müdür"}, {"IS_ALPHA": True}],
            [{"LOWER": "sorumlu"}, {"IS_ALPHA": True}]
        ]
        matcher.add("DOCTOR_STAFF", doctor_patterns)
        
        self.matcher = matcher
    
    def _load_medical_terms(self):
        """Load Turkish medical terminology"""
        self.medical_terms = {
            "hearing_conditions": [
                "işitme kaybı", "işitme azalması", "sağırlık", "hearing loss",
                "sensörinöral işitme kaybı", "iletim tipi işitme kaybı",
                "karma tip işitme kaybı", "presbyküzi", "ototoksisite"
            ],
            "devices": [
                "işitme cihazı", "hearing aid", "işitme aleti",
                "BTE", "ITE", "CIC", "RIC", "kulak arkası cihaz",
                "kulak içi cihaz", "koklear implant", "cochlear implant"
            ],
            "procedures": [
                "odyometri", "audiometry", "işitme testi",
                "timpanometri", "ABR", "ameliyat", "surgery"
            ]
        }
    
    def process_document(self, text, doc_type="medical"):
        """Process medical document with spaCy"""
        if not self.initialized:
            self.initialize()
        
        doc = self.nlp(text)
        
        # Extract entities using spaCy's built-in NER
        entities = []
        for ent in doc.ents:
            entities.append({
                "text": ent.text,
                "label": ent.label_,
                "start": ent.start_char,
                "end": ent.end_char,
                "confidence": float(ent._.get("confidence", 0.8))
            })
        
        # Extract custom medical entities
        custom_entities = self._extract_custom_entities(text)
        
        # Document classification
        classification = self._classify_document(text, doc)
        
        # Extract key medical terms
        medical_terms = self._extract_medical_terms(text)
        
        return {
            "entities": entities,
            "custom_entities": custom_entities,
            "classification": classification,
            "medical_terms": medical_terms,
            "tokens": [{"text": token.text, "pos": token.pos_, "lemma": token.lemma_} for token in doc],
            "sentences": [sent.text for sent in doc.sents],
            "language": doc.lang_,
            "processing_time": datetime.now().isoformat()
        }
    
    def _extract_custom_entities(self, text):
        """Extract custom medical entities"""
        doc = self.nlp(text)
        matches = self.matcher(doc)
        
        custom_entities = []
        for match_id, start, end in matches:
            span = doc[start:end]
            label = self.nlp.vocab.strings[match_id]
            
            custom_entities.append({
                "text": span.text,
                "label": label,
                "start": span.start_char,
                "end": span.end_char,
                "confidence": 0.9
            })
        
        return custom_entities
    
    def _classify_document(self, text, doc):
        """Classify medical document type"""
        text_lower = text.lower()
        
        # Classification rules based on content
        if any(term in text_lower for term in ["sgk", "sosyal güvenlik", "cihaz raporu"]):
            return {"type": "sgk_device_report", "confidence": 0.95}
        elif any(term in text_lower for term in ["reçete", "prescription", "ilaç"]):
            return {"type": "prescription", "confidence": 0.90}
        elif any(term in text_lower for term in ["odyometri", "audiometry", "işitme testi"]):
            return {"type": "audiometry_report", "confidence": 0.88}
        elif any(term in text_lower for term in ["rapor", "muayene", "bulgular"]):
            return {"type": "medical_report", "confidence": 0.75}
        else:
            return {"type": "other", "confidence": 0.50}
    
    def _extract_medical_terms(self, text):
        """Extract medical terminology from text"""
        found_terms = []
        text_lower = text.lower()
        
        for category, terms in self.medical_terms.items():
            for term in terms:
                if term.lower() in text_lower:
                    found_terms.append({
                        "term": term,
                        "category": category,
                        "start": text_lower.find(term.lower()),
                        "end": text_lower.find(term.lower()) + len(term)
                    })
        
        return found_terms
    
    def extract_patient_name(self, text):
        """Extract patient name from Turkish medical document"""
        if not self.initialized:
            self.initialize()
        
        # First try pattern matching for "HASTA ADI SOYADI:" format
        import re
        
        # Turkish patient name patterns - support both mixed case and uppercase
        patterns = [
            # All uppercase names (like ONUR AYDOĞDU)
            r'HASTA\s+ADI?\s+SOYADI?\s*[:\-]\s*([A-ZÇĞIİÖŞÜ\s]+)',
            r'HASTA\s+ADI?\s*[:\-]\s*([A-ZÇĞIİÖŞÜ\s]+)',
            # Mixed case names (like Onur Aydoğdu)
            r'HASTA\s+ADI?\s+SOYADI?\s*[:\-]\s*([A-ZÇĞIİÖŞÜ][a-zçğıöşü]+(?:\s+[A-ZÇĞIİÖŞÜ][a-zçğıöşü]+)*)',
            r'HASTA\s+ADI?\s*[:\-]\s*([A-ZÇĞIİÖŞÜ][a-zçğıöşü]+(?:\s+[A-ZÇĞIİÖŞÜ][a-zçğıöşü]+)*)',
            r'PATIENT\s+NAME\s*[:\-]\s*([A-ZÇĞIİÖŞÜ][a-zçğıöşü]+(?:\s+[A-ZÇĞIİÖŞÜ][a-zçğıöşü]+)*)',
            r'ADI?\s+SOYADI?\s*[:\-]\s*([A-ZÇĞIİÖŞÜ][a-zçğıöşü]+(?:\s+[A-ZÇĞIİÖŞÜ][a-zçğıöşü]+)*)'
        ]
        
        # Names to exclude (doctors, staff, institutions)
        exclude_terms = [
            'DOKTOR', 'DR', 'MÜDÜR', 'SORUMLU', 'HEKIM', 'UZMAN', 'PROF', 'DOÇ',
            'SGK', 'HASTANE', 'KLINIK', 'MERKEZ', 'SAĞLIK', 'TIP', 'UNIVERSITE',
            'UMIT KANAY', 'ÜMİT KANAY'  # Specific exclusions
        ]
        
        found_names = []
        
        for pattern in patterns:
            matches = re.finditer(pattern, text.upper(), re.MULTILINE)
            for match in matches:
                name = match.group(1).strip()
                
                # Clean up the extracted name
                # Remove extra whitespace and clean common artifacts
                name = re.sub(r'\s+', ' ', name)  # Multiple spaces to single space
                name = name.strip()
                
                # Check if it's not a doctor/staff name
                is_excluded = any(exclude_term in name.upper() for exclude_term in exclude_terms)
                
                if not is_excluded and len(name) > 3:
                    # Convert to proper case (First Letter Of Each Word)
                    formatted_name = ' '.join(word.capitalize() for word in name.split())
                    
                    found_names.append({
                        "name": formatted_name,
                        "start": match.start(1),
                        "end": match.end(1),
                        "confidence": 0.9,
                        "method": "pattern_matching"
                    })
        
        # If no patterns found, try spaCy entity extraction
        if not found_names:
            doc = self.nlp(text)
            matches = self.matcher(doc)
            
            for match_id, start, end in matches:
                label = self.nlp.vocab.strings[match_id]
                if label == "PATIENT_NAME":
                    span = doc[start:end]
                    # Extract the actual name part (after the label)
                    name_part = span.text.split(':')[-1].strip()
                    if name_part and len(name_part) > 3:
                        found_names.append({
                            "name": name_part.title(),
                            "start": span.start_char,
                            "end": span.end_char,
                            "confidence": 0.8,
                            "method": "spacy_matching"
                        })
        
        # Return the best match (highest confidence)
        if found_names:
            return max(found_names, key=lambda x: x['confidence'])
        
        return None
    
    def calculate_similarity(self, text1, text2):
        """Calculate semantic similarity between texts"""
        if not self.initialized:
            self.initialize()
        
        doc1 = self.nlp(text1)
        doc2 = self.nlp(text2)
        
        # Use spaCy's built-in similarity
        similarity = doc1.similarity(doc2)
        
        return {
            "similarity": float(similarity),
            "text1_tokens": len(doc1),
            "text2_tokens": len(doc2),
            "method": "spacy_vectors"
        }

# Initialize NLP service
nlp_service = TurkishMedicalNLP()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "initialized": nlp_service.initialized,
        "timestamp": datetime.now().isoformat()
    })

@app.route('/initialize', methods=['POST'])
def initialize_nlp():
    """Initialize spaCy models"""
    try:
        nlp_service.initialize()
        return jsonify({
            "success": True,
            "message": "NLP service initialized successfully",
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }), 500

@app.route('/process', methods=['POST'])
def process_document():
    """Process document with spaCy NLP"""
    try:
        data = request.get_json()
        text = data.get('text', '')
        doc_type = data.get('type', 'medical')
        
        if not text:
            return jsonify({"error": "No text provided"}), 400
        
        result = nlp_service.process_document(text, doc_type)
        
        return jsonify({
            "success": True,
            "result": result,
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Processing error: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }), 500

@app.route('/similarity', methods=['POST'])
def calculate_similarity():
    """Calculate semantic similarity"""
    try:
        data = request.get_json()
        text1 = data.get('text1', '')
        text2 = data.get('text2', '')
        
        if not text1 or not text2:
            return jsonify({"error": "Both texts required"}), 400
        
        result = nlp_service.calculate_similarity(text1, text2)
        
        return jsonify({
            "success": True,
            "result": result,
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Similarity calculation error: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }), 500

@app.route('/entities', methods=['POST'])
def extract_entities():
    """Extract entities from text"""
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        if not text:
            return jsonify({"error": "No text provided"}), 400
        
        # Process with NLP
        result = nlp_service.process_document(text)
        
        # Return only entities
        return jsonify({
            "success": True,
            "entities": result["entities"],
            "custom_entities": result["custom_entities"],
            "medical_terms": result["medical_terms"],
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Entity extraction error: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }), 500

@app.route('/extract_patient', methods=['POST'])
def extract_patient_name():
    """Extract patient name from Turkish medical document"""
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        if not text:
            return jsonify({"error": "No text provided"}), 400
        
        # Extract patient name
        patient_info = nlp_service.extract_patient_name(text)
        
        return jsonify({
            "success": True,
            "patient_info": patient_info,
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Patient extraction error: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }), 500

if __name__ == '__main__':
    # Initialize on startup
    try:
        nlp_service.initialize()
        logger.info("🚀 Starting spaCy backend service...")
    except Exception as e:
        logger.error(f"Failed to initialize: {e}")
    
    # Run the Flask app
    app.run(host='0.0.0.0', port=5000, debug=True)
