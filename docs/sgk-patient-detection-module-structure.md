# SGK Patient Detection Module Structure

## Current Problem
The SGK patient detection functionality is scattered across multiple files:
- `sgk-document-pipeline.js` (3000+ lines) - Contains everything
- `sgk.html` - Has duplicate patient matching logic
- `ocr-engine.js` - Has its own patient extraction
- Multiple test files with hardcoded logic

## Proposed Modular Structure

### Core Modules (in `/public/assets/js/sgk/`)

#### 1. `patient-matcher.js` - Core Patient Matching Logic
```javascript
class PatientMatcher {
    // Main matching methods
    matchPatientByName(ocrText)
    fuzzySearchPatients(patients, patientInfo) 
    directKeywordSearch(ocrText)
    
    // Scoring and confidence
    calculateNameSimilarity(name1, name2)
    scoreNameCandidate(name, fullText)
}
```

#### 2. `patient-extractor.js` - Name Extraction from OCR
```javascript
class PatientExtractor {
    // Extraction methods
    extractPatientInfo(ocrText)
    extractPatientInfoFallback(text)
    
    // Cleaning and validation
    cleanExtractedName(name)
    isValidNameCandidate(name)
    isTurkishNamePattern(name)
    isInstitutionalText(text)
}
```

#### 3. `patient-database.js` - Database Operations
```javascript
class PatientDatabase {
    // Database access
    getAllPatients()
    findPatientByName(name)
    findPatientByTC(tcNumber)
    
    // Search operations
    searchPatients(query)
    getPatientById(id)
}
```

#### 4. `sgk-document-classifier.js` - Document Type Detection
```javascript
class SGKDocumentClassifier {
    // Document classification
    classifyDocument(ocrText, fileName)
    detectDocumentType(text, filename)
    
    // Document validation
    validateSGKDocument(text)
}
```

#### 5. `sgk-patient-detection.js` - Main Orchestrator
```javascript
class SGKPatientDetection {
    constructor() {
        this.matcher = new PatientMatcher();
        this.extractor = new PatientExtractor();
        this.database = new PatientDatabase();
        this.classifier = new SGKDocumentClassifier();
    }
    
    // Main public API
    async processDocument(ocrText, fileName)
    async matchPatient(ocrText)
    classifyDocument(ocrText, fileName)
}
```

### Benefits of This Structure

1. **Single Responsibility**: Each class has one clear purpose
2. **Easy Testing**: Can test each module independently  
3. **Easy Debugging**: Know exactly which file to check for specific issues
4. **Maintainability**: Changes to matching logic only affect `patient-matcher.js`
5. **Reusability**: Other parts of the app can use these modules independently

### Migration Plan

1. Extract patient matching logic from `sgk-document-pipeline.js` → `patient-matcher.js`
2. Extract name extraction logic → `patient-extractor.js`  
3. Extract database operations → `patient-database.js`
4. Extract document classification → `sgk-document-classifier.js`
5. Create main orchestrator → `sgk-patient-detection.js`
6. Update `sgk.html` to use the new modular API
7. Remove duplicate logic from other files

### File Mapping for Current Issues

| Issue Type | File to Edit |
|------------|-------------|
| Patient matching problems | `patient-matcher.js` |
| Name extraction issues | `patient-extractor.js` |  
| Database queries | `patient-database.js` |
| Document type detection | `sgk-document-classifier.js` |
| Integration issues | `sgk-patient-detection.js` |
| UI display problems | `sgk.html` |

### Current vs Proposed

**Current**: One 3000+ line file with everything mixed together
**Proposed**: 5 focused files, each ~200-400 lines, with clear responsibilities

This will make the codebase much more maintainable and easier to debug!
