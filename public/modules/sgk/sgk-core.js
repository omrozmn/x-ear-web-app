/**
 * SGK Core Module
 * Main controller for SGK page functionality
 */

window.SGK = window.SGK || {};

window.SGK.Core = class {
    constructor() {
        this.initialized = false;
        this.patientMatcher = null;
        this.ocrProcessor = null;
        this.documentClassifier = null;
        this.uiComponents = null;
        this.patientDatabase = [];
        this.processedDocuments = [];
    }

    /**
     * Initialize SGK module
     */
    async initialize() {
        console.log('🔄 Initializing SGK Core...');
        
        try {
            // Load dependencies
            await this.loadDependencies();
            
            // Initialize components
            this.patientMatcher = new window.SGK.PatientMatcher();
            
            // Load patient database
            await this.loadPatientDatabase();
            
            // Initialize patient matcher
            this.patientMatcher.initialize(this.patientDatabase);
            
            // Setup UI
            this.setupUI();
            
            this.initialized = true;
            console.log('✅ SGK Core initialized successfully');
            
        } catch (error) {
            console.error('❌ SGK Core initialization failed:', error);
            throw error;
        }
    }

    /**
     * Load required dependencies
     */
    async loadDependencies() {
        const dependencies = [
            'sgk-patient-matcher',
            'sgk-ocr-processor', 
            'sgk-document-classifier',
            'sgk-ui-components'
        ];
        
        console.log('📦 Loading SGK dependencies...');
        await window.loadPageModules('sgk', dependencies);
    }

    /**
     * Load patient database from various sources
     */
    async loadPatientDatabase() {
        console.log('👥 Loading patient database...');
        
        // Try multiple sources for patient data
        if (window.samplePatients && Array.isArray(window.samplePatients)) {
            this.patientDatabase = window.samplePatients;
            console.log(`✅ Loaded ${this.patientDatabase.length} patients from samplePatients`);
        } else if (window.patientsData && Array.isArray(window.patientsData)) {
            this.patientDatabase = window.patientsData;
            console.log(`✅ Loaded ${this.patientDatabase.length} patients from patientsData`);
        } else if (window.sampleData && window.sampleData.patients) {
            this.patientDatabase = window.sampleData.patients;
            console.log(`✅ Loaded ${this.patientDatabase.length} patients from sampleData`);
        } else {
            console.warn('⚠️ No patient data found');
            this.patientDatabase = [];
        }
        
        // Make globally available
        window.patientDatabase = this.patientDatabase;
    }

    /**
     * Setup UI components and event handlers
     */
    setupUI() {
        console.log('🎨 Setting up SGK UI...');
        
        // Setup file upload handler
        const fileInput = document.getElementById('bulkOCRUpload');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        }
        
        // Setup other UI components
        this.populatePatientSelects();
        
        console.log('✅ SGK UI setup complete');
    }

    /**
     * Handle file upload
     */
    async handleFileUpload(event) {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;
        
        console.log(`📁 Processing ${files.length} files...`);
        
        // Show progress
        const progressContainer = document.getElementById('uploadProgress');
        if (progressContainer) {
            progressContainer.style.display = 'block';
        }
        
        try {
            // Process files
            const results = [];
            for (let i = 0; i < files.length; i++) {
                const result = await this.processFile(files[i], i);
                results.push(result);
                
                // Update progress
                this.updateProgress(i + 1, files.length);
            }
            
            // Update UI with results
            this.displayResults(results);
            
        } catch (error) {
            console.error('❌ File processing failed:', error);
            this.showError('Dosya işleme hatası: ' + error.message);
        } finally {
            // Hide progress
            if (progressContainer) {
                progressContainer.style.display = 'none';
            }
        }
    }

    /**
     * Process a single file
     */
    async processFile(file, index) {
        console.log(`📄 Processing file ${index + 1}: ${file.name}`);
        
        const fileId = `file_${Date.now()}_${index}`;
        
        try {
            // OCR processing
            const ocrResult = await this.processOCR(file);
            
            // Patient matching
            const patientMatch = await this.patientMatcher.matchPatientByName(ocrResult.text);
            
            // Document classification
            const documentType = this.classifyDocument(ocrResult.text, file.name);
            
            // Create result object
            const result = {
                id: fileId,
                fileName: file.name,
                fileData: ocrResult.imageData,
                ocrText: ocrResult.text,
                ocrConfidence: ocrResult.confidence,
                extractedPatientInfo: patientMatch.extractedInfo,
                documentType: documentType,
                matchedPatient: patientMatch.matched ? patientMatch.patient : null,
                status: patientMatch.matched ? 'auto_matched' : 'manual_review',
                processingDate: new Date().toISOString(),
                patientMatchResult: patientMatch
            };
            
            // Store result
            this.processedDocuments.push(result);
            
            return result;
            
        } catch (error) {
            console.error(`❌ Error processing file ${file.name}:`, error);
            return {
                id: fileId,
                fileName: file.name,
                status: 'error',
                error: error.message
            };
        }
    }

    /**
     * Process OCR for a file
     */
    async processOCR(file) {
        // This would use the OCR processor module
        // For now, return mock data
        return {
            text: 'Mock OCR text for ' + file.name,
            confidence: 0.9,
            imageData: 'data:image/jpeg;base64,mock'
        };
    }

    /**
     * Classify document type
     */
    classifyDocument(text, fileName) {
        // This would use the document classifier module
        // For now, return basic classification
        if (text.includes('reçete') || fileName.includes('recete')) {
            return { type: 'recete', displayName: 'Reçete', confidence: 0.9 };
        }
        return { type: 'unknown', displayName: 'Bilinmeyen', confidence: 0.5 };
    }

    /**
     * Display processing results
     */
    displayResults(results) {
        console.log('📊 Displaying results for', results.length, 'files');
        
        const resultsContainer = document.getElementById('resultsContainer');
        if (!resultsContainer) return;
        
        // Clear previous results
        resultsContainer.innerHTML = '';
        
        // Display each result
        results.forEach(result => {
            const resultElement = this.createResultElement(result);
            resultsContainer.appendChild(resultElement);
        });
    }

    /**
     * Create result element for a processed file
     */
    createResultElement(result) {
        const div = document.createElement('div');
        div.className = 'bg-white rounded-lg shadow p-4 mb-4';
        
        const matchStatus = result.matchedPatient ? 
            `✅ ${result.matchedPatient.name}` : 
            '❌ Eşleşme bulunamadı';
            
        div.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <h3 class="text-lg font-medium">${result.fileName}</h3>
                <span class="px-2 py-1 text-xs rounded ${result.status === 'auto_matched' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                    ${result.status === 'auto_matched' ? 'Otomatik Eşleşti' : 'Manuel İnceleme'}
                </span>
            </div>
            
            <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <span class="font-medium text-gray-700">Tespit Edilen Hasta:</span>
                    <p class="text-gray-900">${result.matchedPatient ? result.matchedPatient.name : (result.extractedPatientInfo?.name || 'Bulunamadı')}</p>
                </div>
                <div>
                    <span class="font-medium text-gray-700">Eşleşme Durumu:</span>
                    <p class="text-gray-900">${matchStatus}</p>
                </div>
                <div>
                    <span class="font-medium text-gray-700">Belge Türü:</span>
                    <p class="text-gray-900">${result.documentType?.displayName || 'Bilinmeyen'}</p>
                </div>
                <div>
                    <span class="font-medium text-gray-700">İşlenme Zamanı:</span>
                    <p class="text-gray-900">${new Date(result.processingDate).toLocaleString('tr-TR')}</p>
                </div>
            </div>
        `;
        
        return div;
    }

    /**
     * Populate patient select dropdowns
     */
    populatePatientSelects() {
        const selects = document.querySelectorAll('select[data-populate="patients"]');
        
        selects.forEach(select => {
            // Clear existing options
            select.innerHTML = '<option value="">Hasta Seçin</option>';
            
            // Add patient options
            this.patientDatabase.forEach(patient => {
                const option = document.createElement('option');
                option.value = patient.id || patient.tcNumber;
                option.textContent = `${patient.name} - ${patient.tcNumber || 'TC Yok'}`;
                select.appendChild(option);
            });
        });
    }

    /**
     * Update progress display
     */
    updateProgress(current, total) {
        const progressBar = document.querySelector('.progress-bar');
        const progressText = document.querySelector('.progress-text');
        
        if (progressBar) {
            const percentage = (current / total) * 100;
            progressBar.style.width = `${percentage}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${current} / ${total} dosya işlendi`;
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        const errorContainer = document.getElementById('errorContainer');
        if (errorContainer) {
            errorContainer.innerHTML = `
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    ${message}
                </div>
            `;
            errorContainer.style.display = 'block';
        }
    }

    /**
     * Get processed documents
     */
    getProcessedDocuments() {
        return this.processedDocuments;
    }

    /**
     * Get patient database
     */
    getPatientDatabase() {
        return this.patientDatabase;
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    try {
        window.SGK.core = new window.SGK.Core();
        await window.SGK.core.initialize();
    } catch (error) {
        console.error('❌ Failed to initialize SGK:', error);
    }
});

console.log('✅ SGK Core module loaded');
