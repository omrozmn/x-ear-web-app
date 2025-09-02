/**
 * OCR Integration Module
 * Ensures OCR engine learns from patient management operations
 */

class OCRIntegration {
    constructor() {
        this.initialized = false;
        this.init();
    }

    async init() {
        if (this.initialized) return;

        // Wait for OCR engine to be available
        await this.waitForOCREngine();
        
        // Setup hooks for patient operations
        this.setupPatientHooks();
        
        this.initialized = true;
        console.log('🔗 OCR Integration initialized');
    }

    async waitForOCREngine() {
        return new Promise((resolve) => {
            const checkEngine = () => {
                if (window.ocrEngine || window.OCREngine) {
                    if (!window.ocrEngine && window.OCREngine) {
                        window.ocrEngine = new window.OCREngine();
                    }
                    resolve();
                } else {
                    setTimeout(checkEngine, 100);
                }
            };
            checkEngine();
        });
    }

    setupPatientHooks() {
        // Hook into patient save operations
        this.hookPatientSave();
        
        // Hook into patient edit operations
        this.hookPatientEdit();
        
        // Hook into patient import operations
        this.hookPatientImport();
    }

    hookPatientSave() {
        // Override common patient save functions
        const originalFunctions = [];

        // Hook into Utils.showModal success callbacks for patient operations
        if (window.Utils && window.Utils.showModal) {
            const originalShowModal = window.Utils.showModal;
            window.Utils.showModal = (config) => {
                if (config.primaryButton && config.primaryButton.onClick) {
                    const originalOnClick = config.primaryButton.onClick;
                    config.primaryButton.onClick = (...args) => {
                        const result = originalOnClick(...args);
                        
                        // Check if this might be a patient save operation
                        if (config.title && (
                            config.title.includes('Hasta') || 
                            config.title.includes('Patient') ||
                            config.title.includes('Düzenle') ||
                            config.title.includes('Edit')
                        )) {
                            setTimeout(() => this.checkForNewPatientData(), 500);
                        }
                        
                        return result;
                    };
                }
                return originalShowModal(config);
            };
        }

        // Hook into localStorage setItem for patient data
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = (key, value) => {
            const result = originalSetItem.call(localStorage, key, value);
            
            if (key === 'patients' || key.includes('patient')) {
                setTimeout(() => this.onPatientDataUpdated(key, value), 100);
            }
            
            return result;
        };
    }

    hookPatientEdit() {
        // Monitor window.patientDetailsManager changes
        if (window.patientDetailsManager) {
            const manager = window.patientDetailsManager;
            
            // Hook into savePatientToStorage if it exists
            if (manager.savePatientToStorage) {
                const originalSave = manager.savePatientToStorage;
                manager.savePatientToStorage = function(...args) {
                    const result = originalSave.apply(this, args);
                    
                    // Notify OCR of patient update
                    if (this.currentPatient && window.ocrEngine) {
                        window.ocrEngine.onPatientSaved(this.currentPatient);
                    }
                    
                    return result;
                };
            }
        }
    }

    hookPatientImport() {
        // Hook into any bulk import operations
        document.addEventListener('patientsImported', (event) => {
            if (event.detail && event.detail.patients) {
                event.detail.patients.forEach(patient => {
                    if (window.ocrEngine) {
                        window.ocrEngine.onPatientSaved(patient);
                    }
                });
            }
        });
    }

    onPatientDataUpdated(key, value) {
        try {
            if (key === 'patients') {
                const patients = JSON.parse(value);
                if (Array.isArray(patients) && window.ocrEngine) {
                    // Only process new patients (last few)
                    const recentPatients = patients.slice(-5); // Last 5 patients
                    recentPatients.forEach(patient => {
                        window.ocrEngine.onPatientSaved(patient);
                    });
                }
            }
        } catch (error) {
            console.warn('Could not process patient data update:', error);
        }
    }

    checkForNewPatientData() {
        // Check various sources for recently updated patient data
        const sources = [
            () => window.patientDetailsManager?.currentPatient,
            () => {
                const stored = localStorage.getItem('patients');
                if (stored) {
                    const patients = JSON.parse(stored);
                    return patients[patients.length - 1]; // Most recent
                }
                return null;
            }
        ];

        sources.forEach(getPatient => {
            try {
                const patient = getPatient();
                if (patient && window.ocrEngine) {
                    window.ocrEngine.onPatientSaved(patient);
                }
            } catch (error) {
                // Silent error, continue with other sources
            }
        });
    }

    // Method to manually trigger learning from current patient database
    async learnFromExistingPatients() {
        if (window.ocrEngine) {
            console.log('🎓 Manually triggering OCR learning from existing patients...');
            window.ocrEngine.loadNamesFromPatientDatabase();
        }
    }

    // Method to get learning statistics
    getLearningStats() {
        if (window.ocrEngine && window.ocrEngine.dynamicNames) {
            return {
                maleNames: window.ocrEngine.dynamicNames.male.size,
                femaleNames: window.ocrEngine.dynamicNames.female.size,
                surnames: window.ocrEngine.dynamicNames.surnames.size,
                total: window.ocrEngine.dynamicNames.male.size + 
                       window.ocrEngine.dynamicNames.female.size + 
                       window.ocrEngine.dynamicNames.surnames.size
            };
        }
        return { maleNames: 0, femaleNames: 0, surnames: 0, total: 0 };
    }
}

// Create global instance
window.ocrIntegration = new OCRIntegration();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OCRIntegration;
}
