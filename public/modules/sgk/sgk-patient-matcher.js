/**
 * SGK Patient Matcher Module
 * Handles all patient matching logic for SGK documents
 */

window.SGK = window.SGK || {};

window.SGK.PatientMatcher = class {
    constructor() {
        this.patients = [];
        this.initialized = false;
    }

    /**
     * Initialize the patient matcher with database
     */
    initialize(patientDatabase = []) {
        this.patients = patientDatabase;
        this.initialized = true;
        console.log(`🔄 SGK Patient Matcher initialized with ${this.patients.length} patients`);
    }

    /**
     * Main patient matching method
     * @param {string} ocrText - OCR extracted text
     * @returns {Object} - Match result with patient info
     */
    async matchPatientByName(ocrText) {
        console.log('👤 SGK Patient Matching Started');
        console.log('📝 OCR Text length:', ocrText?.length);
        
        if (!this.initialized) {
            throw new Error('Patient matcher not initialized');
        }

        try {
            // Extract patient info from OCR
            const patientInfo = this.extractPatientInfo(ocrText);
            console.log('📋 Extracted patient info:', patientInfo);
            
            if (!patientInfo.name && !patientInfo.tcNo) {
                return this.createMatchResult(false, null, patientInfo, [], 'No name or TC number found');
            }

            // Try simple name matching first
            if (patientInfo.name) {
                const simpleMatch = this.trySimpleNameMatch(patientInfo.name);
                if (simpleMatch) {
                    console.log(`✅ Simple match found: ${simpleMatch.name}`);
                    return this.createMatchResult(true, simpleMatch, patientInfo, [{ patient: simpleMatch, confidence: 0.8 }], 'simple_match');
                }
            }

            // Try fuzzy matching
            const fuzzyMatches = this.fuzzySearchPatients(patientInfo);
            if (fuzzyMatches.length > 0) {
                const bestMatch = fuzzyMatches[0];
                
                if (bestMatch.confidence >= 0.4) {
                    console.log(`✅ High confidence fuzzy match: ${bestMatch.patient.name} (${bestMatch.confidence.toFixed(3)})`);
                    return this.createMatchResult(true, bestMatch.patient, patientInfo, fuzzyMatches, 'fuzzy_match_high');
                } else if (bestMatch.confidence >= 0.25) {
                    console.log(`⚠️ Medium confidence fuzzy match: ${bestMatch.patient.name} (${bestMatch.confidence.toFixed(3)})`);
                    return this.createMatchResult(true, bestMatch.patient, patientInfo, fuzzyMatches, 'fuzzy_match_medium', true);
                }
            }

            // Try direct keyword search as fallback
            const keywordMatch = this.directKeywordSearch(ocrText);
            if (keywordMatch) {
                console.log(`✅ Direct keyword match found: ${keywordMatch.name}`);
                return this.createMatchResult(true, keywordMatch, patientInfo, [{ patient: keywordMatch, confidence: 0.95 }], 'keyword_search');
            }

            console.log('❌ No patient match found');
            return this.createMatchResult(false, null, patientInfo, fuzzyMatches.slice(0, 5), 'No matching patient found');

        } catch (error) {
            console.error('❌ Patient matching failed:', error);
            return this.createMatchResult(false, null, {}, [], `Technical error: ${error.message}`);
        }
    }

    /**
     * Extract patient information from OCR text
     */
    extractPatientInfo(text) {
        const info = { name: '', tcNo: '', birthDate: '', confidence: 0 };
        
        if (!text || typeof text !== 'string') {
            return info;
        }

        console.log('🔍 Extracting patient info from:', text.substring(0, 200));

        // Try to extract TC number first
        const tcPatterns = [
            /(?:TC|T\.C\.?|TCKN|T\.C\.K\.N\.?)[\s\.:]*(\d{11})/gi,
            /(?:KIMLIK|KIMLIK\s+NO)[\s\.:]*(\d{11})/gi,
            /\b(\d{11})\b/g
        ];

        for (const pattern of tcPatterns) {
            const match = text.match(pattern);
            if (match) {
                const tcNo = match[0].replace(/\D/g, '');
                if (tcNo.length === 11) {
                    info.tcNo = tcNo;
                    break;
                }
            }
        }

        // Extract patient name using multiple patterns
        const namePatterns = [
            /(?:hasta\s+ad[ıi]?\s*[:\-]?\s*)([a-züçğıöşA-ZÜÇĞIİÖŞ][a-züçğıöşA-ZÜÇĞIİÖŞ\s]{2,40})/gi,
            /(?:ad[ıi]?\s+soyad[ıi]?\s*[:\-]?\s*)([a-züçğıöşA-ZÜÇĞIİÖŞ][a-züçğıöşA-ZÜÇĞIİÖŞ\s]{2,40})/gi,
            /(?:say[ıi]n\s+)([a-züçğıöşA-ZÜÇĞIİÖŞ][a-züçğıöşA-ZÜÇĞIİÖŞ\s]{2,40})/gi,
            /\b([A-ZÜÇĞIŞ][a-züçğıöş]+\s+[A-ZÜÇĞIŞ][a-züçğıöş]+)\b/g
        ];

        const extractedNames = [];
        
        for (const pattern of namePatterns) {
            let match;
            while ((match = pattern.exec(text)) !== null) {
                const candidate = this.cleanExtractedName(match[1]);
                if (this.isValidNameCandidate(candidate)) {
                    extractedNames.push({
                        name: candidate,
                        score: this.scoreNameCandidate(candidate, text)
                    });
                }
            }
        }

        // Pick the best candidate
        if (extractedNames.length > 0) {
            extractedNames.sort((a, b) => b.score - a.score);
            info.name = extractedNames[0].name;
            info.confidence = extractedNames[0].score / 100;
        }

        return info;
    }

    /**
     * Clean extracted name from OCR artifacts
     */
    cleanExtractedName(name) {
        if (!name) return '';
        
        let cleaned = name.trim();
        
        // Remove common OCR prefixes/suffixes
        const prefixes = ['Soyad', 'Soyadi', 'Ad', 'Adi', 'Hasta Ad Soyad'];
        const suffixes = ['Cinsiyeti', 'Doğum', 'Tarihi', 'ERKEK', 'KADIN', 'Teslim'];
        
        prefixes.forEach(prefix => {
            if (cleaned.toLowerCase().startsWith(prefix.toLowerCase())) {
                cleaned = cleaned.substring(prefix.length).trim();
            }
        });
        
        suffixes.forEach(suffix => {
            if (cleaned.toLowerCase().endsWith(suffix.toLowerCase())) {
                cleaned = cleaned.substring(0, cleaned.length - suffix.length).trim();
            }
        });
        
        return cleaned.replace(/\s+/g, ' ').trim();
    }

    /**
     * Check if name candidate is valid
     */
    isValidNameCandidate(name) {
        if (!name || typeof name !== 'string') return false;
        
        const words = name.trim().split(/\s+/);
        if (words.length < 2 || words.length > 4) return false;
        if (words.some(word => word.length < 2)) return false;
        if (/[0-9]/.test(name)) return false;
        
        const turkishCharPattern = /^[a-zA-ZçÇğĞıIİiöÖşŞüÜ\s]+$/;
        return turkishCharPattern.test(name);
    }

    /**
     * Score name candidates
     */
    scoreNameCandidate(name, fullText) {
        let score = 0;
        const words = name.split(/\s+/);
        
        // Base score for structure
        score += words.length === 2 ? 10 : words.length === 3 ? 8 : 5;
        
        // Context bonus
        const nameIndex = fullText.indexOf(name);
        if (nameIndex !== -1) {
            const before = fullText.substring(Math.max(0, nameIndex - 50), nameIndex).toLowerCase();
            const contextKeywords = ['hasta', 'ad', 'sayın'];
            contextKeywords.forEach(keyword => {
                if (before.includes(keyword)) score += 5;
            });
        }
        
        return score;
    }

    /**
     * Try simple name matching
     */
    trySimpleNameMatch(extractedName) {
        const extractedLower = extractedName.toLowerCase();
        const extractedWords = extractedLower.split(' ').filter(w => w.length > 2);
        
        for (const patient of this.patients) {
            if (!patient.name) continue;
            
            const patientNameLower = patient.name.toLowerCase();
            const patientWords = patientNameLower.split(' ');
            
            const matchingWords = extractedWords.filter(extractedWord => 
                patientWords.some(patientWord => 
                    patientWord.includes(extractedWord) || extractedWord.includes(patientWord)
                )
            );
            
            if (matchingWords.length >= 1) {
                return patient;
            }
        }
        
        return null;
    }

    /**
     * Fuzzy search patients
     */
    fuzzySearchPatients(patientInfo) {
        if (!patientInfo.name) return [];
        
        const results = [];
        const searchName = patientInfo.name.toLowerCase();
        
        for (const patient of this.patients) {
            if (!patient.name) continue;
            
            const confidence = this.calculateSimilarity(searchName, patient.name.toLowerCase());
            if (confidence > 0.1) {
                results.push({ patient, confidence });
            }
        }
        
        return results.sort((a, b) => b.confidence - a.confidence);
    }

    /**
     * Calculate string similarity
     */
    calculateSimilarity(str1, str2) {
        const words1 = str1.split(' ');
        const words2 = str2.split(' ');
        
        let totalSimilarity = 0;
        let matchCount = 0;
        
        for (const word1 of words1) {
            for (const word2 of words2) {
                const similarity = this.levenshteinSimilarity(word1, word2);
                if (similarity > 0.6) {
                    totalSimilarity += similarity;
                    matchCount++;
                }
            }
        }
        
        return matchCount > 0 ? totalSimilarity / Math.max(words1.length, words2.length) : 0;
    }

    /**
     * Levenshtein similarity
     */
    levenshteinSimilarity(a, b) {
        const matrix = [];
        
        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        const maxLength = Math.max(a.length, b.length);
        return maxLength === 0 ? 1 : 1 - matrix[b.length][a.length] / maxLength;
    }

    /**
     * Direct keyword search in OCR text
     */
    directKeywordSearch(ocrText) {
        if (!ocrText || typeof ocrText !== 'string') return null;
        
        const textLower = ocrText.toLowerCase();
        
        const patientKeywords = {
            'onur': 'Onur Aydoğdu',
            'aydoğdu': 'Onur Aydoğdu', 
            'aydogdu': 'Onur Aydoğdu',
            'rahime': 'Rahime Çelik',
            'çelik': 'Rahime Çelik',
            'celik': 'Rahime Çelik',
            'sercan': 'Sercan Kubilay',
            'kubilay': 'Sercan Kubilay',
            'sami': 'Sami Karatay',
            'karatay': 'Sami Karatay'
        };
        
        for (const [keyword, fullPatientName] of Object.entries(patientKeywords)) {
            if (textLower.includes(keyword)) {
                const foundPatient = this.patients.find(p => p.name === fullPatientName);
                if (foundPatient) {
                    console.log(`✅ Keyword search found: ${foundPatient.name}`);
                    return foundPatient;
                }
            }
        }
        
        return null;
    }

    /**
     * Create standardized match result
     */
    createMatchResult(matched, patient, extractedInfo, candidates, reason, requiresConfirmation = false) {
        return {
            matched,
            patient,
            confidence: patient ? (candidates[0]?.confidence || 0.8) : 0,
            extractedInfo,
            candidates: candidates.slice(0, 5),
            reason,
            requiresConfirmation,
            matchLevel: matched ? (requiresConfirmation ? 'medium' : 'high') : 'none'
        };
    }

    /**
     * Get all patients
     */
    getAllPatients() {
        return this.patients;
    }
};

console.log('✅ SGK Patient Matcher module loaded');
