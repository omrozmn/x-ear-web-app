/**
 * SGK Document Classifier Module
 * Classifies SGK document types
 */

window.SGK = window.SGK || {};

window.SGK.DocumentClassifier = class {
    constructor() {
        this.documentTypes = [
            { type: 'pil_recete', displayName: 'Pil Reçete', keywords: ['pil', 'reçete', 'recete'] },
            { type: 'cihaz_recete', displayName: 'Cihaz Reçete', keywords: ['cihaz', 'işitme', 'reçete'] },
            { type: 'odyogram', displayName: 'Odyogram', keywords: ['odyogram', 'audiogram', 'odyometri'] },
            { type: 'uygunluk_belgesi', displayName: 'Uygunluk Belgesi', keywords: ['uygunluk', 'belge'] },
            { type: 'sgk_raporu', displayName: 'SGK Raporu', keywords: ['rapor', 'sgk', 'muayene'] },
            { type: 'recete', displayName: 'Reçete', keywords: ['reçete', 'recete'] }
        ];
    }

    classifyDocument(text, fileName = '') {
        console.log('📋 Classifying document type...');
        
        const combinedText = (text + ' ' + fileName).toLowerCase();
        
        for (const docType of this.documentTypes) {
            const matchCount = docType.keywords.filter(keyword => 
                combinedText.includes(keyword.toLowerCase())
            ).length;
            
            if (matchCount > 0) {
                const confidence = Math.min(0.9, matchCount / docType.keywords.length + 0.3);
                console.log(`✅ Document classified as: ${docType.displayName} (confidence: ${confidence.toFixed(2)})`);
                
                return {
                    type: docType.type,
                    displayName: docType.displayName,
                    confidence: confidence,
                    matchedKeywords: docType.keywords.filter(k => combinedText.includes(k.toLowerCase()))
                };
            }
        }
        
        console.log('❓ Document type could not be determined');
        return {
            type: 'unknown',
            displayName: 'Bilinmeyen Belge',
            confidence: 0.1,
            matchedKeywords: []
        };
    }

    getSupportedTypes() {
        return this.documentTypes;
    }
};

console.log('✅ SGK Document Classifier module loaded');
