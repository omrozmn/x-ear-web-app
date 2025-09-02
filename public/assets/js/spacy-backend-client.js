/**
 * Real spaCy Backend Client for X-Ear CRM
 * Connects to Python spaCy backend service for advanced NLP processing
 */

class SpacyBackendClient {
    constructor(options = {}) {
        this.baseURL = options.baseURL || 'http://localhost:5001';
        this.timeout = options.timeout || 30000; // 30 seconds
        this.debug = options.debug || false;
        this.fallbackService = options.fallbackService; // Your existing JS simulation
        this.isConnected = false;
        
        // Performance monitoring
        this.stats = {
            requests: 0,
            successes: 0,
            failures: 0,
            averageResponseTime: 0,
            totalResponseTime: 0
        };
        
        if (this.debug) console.log('🐍 spaCy Backend Client initialized:', this.baseURL);
    }

    /**
     * Initialize connection to spaCy backend
     */
    async initialize() {
        try {
            console.log('🔄 Connecting to spaCy backend service...');
            
            // Set a shorter timeout for initial connection
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Connection timeout')), 3000)
            );
            
            // Check health endpoint with timeout
            const healthCheck = await Promise.race([
                this.makeRequest('/health', 'GET'),
                timeoutPromise
            ]);
            
            if (healthCheck.status === 'healthy') {
                this.isConnected = true;
                console.log('✅ Connected to spaCy backend service');
                
                // Initialize the NLP service on backend
                await this.makeRequest('/initialize', 'POST');
                console.log('🧠 spaCy NLP service initialized on backend');
                
                return true;
            } else {
                throw new Error('Backend health check failed');
            }
            
        } catch (error) {
            console.log('ℹ️ spaCy backend not available (this is normal for local development)');
            console.log('🔄 Using JavaScript NLP simulation instead');
            this.isConnected = false;
            return false;
        }
    }

    /**
     * Process document with real spaCy NLP
     */
    async processDocument(text, documentType = 'medical') {
        const startTime = Date.now();
        
        try {
            // Try real spaCy backend first
            if (this.isConnected) {
                const result = await this.makeRequest('/process', 'POST', {
                    text: text,
                    type: documentType
                });
                
                this.updateStats(Date.now() - startTime, true);
                
                return this.formatSpacyResult(result.result);
            }
            
        } catch (error) {
            console.warn('❌ spaCy backend failed:', error.message);
            this.updateStats(Date.now() - startTime, false);
        }
        
        // Fallback to JavaScript simulation
        if (this.fallbackService) {
            console.log('🔄 Using fallback JavaScript NLP service...');
            return await this.fallbackService.processDocument(text, documentType);
        }
        
        throw new Error('No NLP service available');
    }

    /**
     * Extract entities using real spaCy NER
     */
    async extractEntities(text) {
        const startTime = Date.now();
        
        try {
            if (this.isConnected) {
                const result = await this.makeRequest('/entities', 'POST', {
                    text: text
                });
                
                this.updateStats(Date.now() - startTime, true);
                
                return {
                    entities: result.entities || [],
                    customEntities: result.custom_entities || [],
                    medicalTerms: result.medical_terms || [],
                    confidence: this.calculateOverallConfidence(result),
                    processingTime: Date.now() - startTime,
                    source: 'spacy_backend'
                };
            }
            
        } catch (error) {
            console.warn('❌ spaCy entity extraction failed:', error.message);
            this.updateStats(Date.now() - startTime, false);
        }
        
        // Fallback
        if (this.fallbackService) {
            const result = await this.fallbackService.extractEntitiesAdvanced(text, 'medical');
            result.source = 'fallback';
            return result;
        }
        
        return { entities: [], source: 'none' };
    }

    /**
     * Calculate semantic similarity using spaCy vectors
     */
    async calculateSemanticSimilarity(text1, text2) {
        const startTime = Date.now();
        
        try {
            if (this.isConnected) {
                const result = await this.makeRequest('/similarity', 'POST', {
                    text1: text1,
                    text2: text2
                });
                
                this.updateStats(Date.now() - startTime, true);
                
                return {
                    similarity: result.result.similarity,
                    method: result.result.method,
                    tokens1: result.result.text1_tokens,
                    tokens2: result.result.text2_tokens,
                    processingTime: Date.now() - startTime,
                    source: 'spacy_backend'
                };
            }
            
        } catch (error) {
            console.warn('❌ spaCy similarity calculation failed:', error.message);
            this.updateStats(Date.now() - startTime, false);
        }
        
        // Fallback
        if (this.fallbackService) {
            const result = await this.fallbackService.calculateSemanticSimilarity(text1, text2);
            result.source = 'fallback';
            return result;
        }
        
        return { similarity: 0, source: 'none' };
    }

    /**
     * Enhanced patient matching with spaCy
     */
    async enhancePatientMatching(extractedInfo, patientDatabase) {
        const matches = [];
        
        for (const patient of patientDatabase) {
            try {
                // Use spaCy for name similarity
                const nameSimilarity = await this.calculateSemanticSimilarity(
                    extractedInfo.name || '',
                    `${patient.firstName || ''} ${patient.lastName || ''}`.trim()
                );
                
                // Create enhanced match object
                const match = {
                    patient: patient,
                    scores: {
                        name: nameSimilarity.similarity,
                        tc: this.calculateTCSimilarity(extractedInfo.tcNo, patient.tcNumber),
                        overall: 0
                    },
                    confidence: nameSimilarity.source === 'spacy_backend' ? 0.95 : 0.75,
                    method: nameSimilarity.source
                };
                
                // Calculate overall score
                match.scores.overall = (match.scores.name * 0.7) + (match.scores.tc * 0.3);
                
                if (match.scores.overall > 0.6) {
                    matches.push(match);
                }
                
            } catch (error) {
                console.warn('Error in patient matching:', error);
            }
        }
        
        // Sort by overall score
        return matches.sort((a, b) => b.scores.overall - a.scores.overall);
    }

    /**
     * Format spaCy result to match expected interface
     */
    formatSpacyResult(spacyResult) {
        return {
            entities: this.formatEntities(spacyResult.entities || []),
            customEntities: this.formatEntities(spacyResult.custom_entities || []),
            classification: spacyResult.classification || { type: 'other', confidence: 0 },
            medicalTerms: spacyResult.medical_terms || [],
            keyPhrases: spacyResult.tokens?.filter(t => t.pos === 'NOUN').map(t => t.text) || [],
            tokens: spacyResult.tokens || [],
            sentences: spacyResult.sentences || [],
            confidence: this.calculateOverallConfidence(spacyResult),
            processingTime: spacyResult.processing_time,
            source: 'spacy_backend'
        };
    }

    /**
     * Format entities to standard structure
     */
    formatEntities(entities) {
        const formatted = {};
        
        entities.forEach(entity => {
            const label = entity.label || 'MISC';
            if (!formatted[label]) {
                formatted[label] = [];
            }
            
            formatted[label].push({
                text: entity.text,
                confidence: entity.confidence || 0.8,
                startChar: entity.start || 0,
                endChar: entity.end || entity.text.length,
                source: 'spacy'
            });
        });
        
        return formatted;
    }

    /**
     * Calculate overall confidence from spaCy result
     */
    calculateOverallConfidence(result) {
        if (!result) return 0;
        
        const entityCount = (result.entities?.length || 0) + (result.custom_entities?.length || 0);
        const medicalTermCount = result.medical_terms?.length || 0;
        const hasClassification = result.classification?.confidence > 0.5;
        
        let confidence = 0.5; // Base confidence
        
        if (entityCount > 0) confidence += 0.2;
        if (entityCount > 3) confidence += 0.1;
        if (medicalTermCount > 0) confidence += 0.15;
        if (hasClassification) confidence += 0.05;
        
        return Math.min(confidence, 1.0);
    }

    /**
     * Calculate TC number similarity
     */
    calculateTCSimilarity(tc1, tc2) {
        if (!tc1 || !tc2) return 0;
        return tc1 === tc2 ? 1.0 : 0;
    }

    /**
     * Make HTTP request to spaCy backend
     */
    async makeRequest(endpoint, method = 'GET', data = null) {
        const url = `${this.baseURL}${endpoint}`;
        const startTime = Date.now();
        
        try {
            const options = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                timeout: this.timeout
            };
            
            if (data && method !== 'GET') {
                options.body = JSON.stringify(data);
            }
            
            const response = await fetch(url, options);
            const responseTime = Date.now() - startTime;
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            
            if (this.debug) {
                console.log(`🐍 spaCy Backend ${method} ${endpoint}:`, {
                    responseTime: responseTime + 'ms',
                    success: result.success
                });
            }
            
            this.stats.requests++;
            if (result.success) {
                this.stats.successes++;
            } else {
                this.stats.failures++;
                throw new Error(result.error || 'Unknown backend error');
            }
            
            return result;
            
        } catch (error) {
            this.stats.requests++;
            this.stats.failures++;
            
            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }
            
            throw error;
        }
    }

    /**
     * Update performance statistics
     */
    updateStats(responseTime, success) {
        this.stats.totalResponseTime += responseTime;
        this.stats.averageResponseTime = this.stats.totalResponseTime / this.stats.requests;
        
        if (success) {
            this.stats.successes++;
        } else {
            this.stats.failures++;
        }
    }

    /**
     * Get connection status
     */
    isReady() {
        return this.isConnected;
    }

    /**
     * Get performance statistics
     */
    getStats() {
        return {
            ...this.stats,
            successRate: this.stats.requests > 0 ? (this.stats.successes / this.stats.requests) * 100 : 0,
            isConnected: this.isConnected,
            baseURL: this.baseURL
        };
    }

    /**
     * Test connection to backend
     */
    async testConnection() {
        try {
            const result = await this.makeRequest('/health', 'GET');
            return {
                connected: true,
                status: result.status,
                initialized: result.initialized,
                timestamp: result.timestamp
            };
        } catch (error) {
            return {
                connected: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
}

// Export for use in other modules
window.SpacyBackendClient = SpacyBackendClient;
