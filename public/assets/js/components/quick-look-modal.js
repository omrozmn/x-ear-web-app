/**
 * QuickLook Modal Component for X-Ear CRM
 * Standalone document preview and editing modal
 * Dependencies: None (self-contained)
 */

class QuickLookModal {
    constructor(options = {}) {
        this.debug = options.debug || false;
        this.container = null;
        this.currentDocument = null;
        this.onSave = options.onSave || (() => {});
        this.onCancel = options.onCancel || (() => {});
        
        // Document type options for manual correction
        this.documentTypes = {
            'cihaz_recete': { name: 'Cihaz Reçete', color: 'blue' },
            'pil_recete': { name: 'Pil Reçete', color: 'green' },
            'odyogram': { name: 'Odyogram', color: 'purple' },
            'uygunluk_belgesi': { name: 'Uygunluk Belgesi', color: 'indigo' },
            'sgk_raporu': { name: 'SGK Raporu', color: 'red' },
            'recete': { name: 'Reçete', color: 'yellow' },
            'kimlik': { name: 'Kimlik Belgesi', color: 'gray' },
            'diger': { name: 'Diğer Belge', color: 'slate' }
        };
        
        // Check if DOM is ready
        this.isDOMReady = document.readyState === 'complete' || document.readyState === 'interactive';
        
        if (this.debug) console.log('📱 QuickLook Modal component initialized');
    }

    /**
     * Wait for DOM to be ready
     */
    waitForDOM() {
        return new Promise((resolve) => {
            // Multiple checks for DOM readiness
            const checkReady = () => {
                const bodyReady = document.body && document.body.parentNode;
                const domReady = document.readyState === 'complete' || document.readyState === 'interactive';
                const documentReady = document.documentElement && document.head;
                
                if (bodyReady && domReady && documentReady) {
                    this.isDOMReady = true;
                    if (this.debug) console.log('✅ DOM is ready for QuickLook modal');
                    resolve();
                    return true;
                }
                return false;
            };
            
            // Immediate check
            if (checkReady()) return;
            
            // If DOM is not ready, wait for it
            if (document.readyState === 'loading') {
                const domLoadHandler = () => {
                    if (checkReady()) {
                        document.removeEventListener('DOMContentLoaded', domLoadHandler);
                        document.removeEventListener('readystatechange', readyStateHandler);
                    }
                };
                
                const readyStateHandler = () => {
                    if (checkReady()) {
                        document.removeEventListener('DOMContentLoaded', domLoadHandler);
                        document.removeEventListener('readystatechange', readyStateHandler);
                    }
                };
                
                document.addEventListener('DOMContentLoaded', domLoadHandler);
                document.addEventListener('readystatechange', readyStateHandler);
            } else {
                // DOM should be ready, but let's poll just in case
                const pollInterval = setInterval(() => {
                    if (checkReady()) {
                        clearInterval(pollInterval);
                    }
                }, 50);
                
                // Timeout after 5 seconds
                setTimeout(() => {
                    clearInterval(pollInterval);
                    if (!this.isDOMReady) {
                        console.warn('⚠️ DOM readiness timeout, attempting to proceed anyway');
                        resolve();
                    }
                }, 5000);
            }
        });
    }

    /**
     * Show QuickLook modal for document review
     */
    async show(docData, options = {}) {
        try {
            if (this.debug) console.log('📱 QuickLook.show() called, waiting for DOM...');
            
            // Wait for DOM to be ready with timeout
            await Promise.race([
                this.waitForDOM(),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('DOM wait timeout')), 10000)
                )
            ]);
            
            // Final check for document.body
            if (!document.body) {
                // Try to create body if it doesn't exist (shouldn't happen but defensive)
                if (document.documentElement && !document.body) {
                    console.warn('⚠️ Creating missing document.body');
                    document.documentElement.appendChild(document.createElement('body'));
                }
                
                if (!document.body) {
                    throw new Error('Document body not available after DOM wait');
                }
            }
            
            this.currentDocument = docData;
            
            if (this.debug) console.log('📱 Creating QuickLook modal...');
            
            // Create modal overlay
            this.container = this.createQuickLookModal(docData, options);
            
            if (this.debug) console.log('📱 Appending modal to document.body...');
            
            // Add to DOM
            document.body.appendChild(this.container);
            
            // Trigger opening animation
            setTimeout(() => {
                if (this.container) {
                    this.container.classList.add('open');
                }
            }, 10);
            
            // Setup event listeners
            this.setupEventListeners();
            
            if (this.debug) console.log('📱 QuickLook opened for:', document.fileName);
            
        } catch (error) {
            console.error('❌ Error showing QuickLook modal:', error);
            console.error('❌ Error details:', {
                hasDocumentBody: !!document.body,
                documentReadyState: document.readyState,
                hasDocumentElement: !!document.documentElement,
                errorMessage: error.message,
                errorStack: error.stack
            });
            this.showErrorToast('Belge önizleme hatası: ' + error.message);
            throw error;
        }
    }

    /**
     * Hide QuickLook modal
     */
    hide() {
        if (!this.container) return;
        
        this.container.classList.remove('open');
        
        // Remove from DOM after animation
        setTimeout(() => {
            if (this.container && this.container.parentNode) {
                this.container.parentNode.removeChild(this.container);
            }
            this.container = null;
            this.currentDocument = null;
        }, 300);
        
        if (this.debug) console.log('📱 QuickLook closed');
    }

    /**
     * Show error toast (fallback if Utils not available)
     */
    showErrorToast(message) {
        if (typeof Utils !== 'undefined' && Utils.showToast) {
            Utils.showToast(message, 'error');
        } else {
            console.error(message);
            alert(message);
        }
    }

    /**
     * Show success toast (fallback if Utils not available)
     */
    showSuccessToast(message) {
        if (typeof Utils !== 'undefined' && Utils.showToast) {
            Utils.showToast(message, 'success');
        } else {
            console.log(message);
            alert(message);
        }
    }

    /**
     * Create QuickLook modal HTML
     */
    createQuickLookModal(doc, options) {
        const modal = document.createElement('div');
        modal.className = 'quick-look-overlay';
        
        // Get document type info
        const docType = doc.documentType || { type: 'diger', name: 'Bilinmeyen', confidence: 0 };
        const typeInfo = this.documentTypes[docType.type] || this.documentTypes['diger'];
        
        // Get patient info
        const patientInfo = doc.extractedPatientInfo || { name: '', tcNo: '', confidence: 0 };
        const matchedPatient = doc.matchedPatient;
        
        modal.innerHTML = `
            <div class="quick-look-modal">
                <div class="quick-look-header">
                    <div class="flex items-center justify-between">
                        <h2 class="text-xl font-semibold text-gray-900">
                            📱 Hızlı Önizleme
                        </h2>
                        <button class="quick-look-close" data-action="close">
                            <svg class="w-6 h-6 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    <p class="text-sm text-gray-600 mt-1">Belgeyi gözden geçirin ve gerekirse düzeltin</p>
                </div>

                <div class="quick-look-content">
                    <!-- Document Preview (Left column) -->
                    <div class="quick-look-preview">
                        <h3 class="font-medium text-gray-900 mb-3">📄 Belge Önizleme</h3>
                        <div class="document-preview-container">
                            ${doc.compressedPDF ? `
                                <iframe src="${doc.compressedPDF}" 
                                        class="document-preview-pdf" 
                                        title="PDF Preview">
                                </iframe>
                                <div class="pdf-info mt-2">
                                    <span class="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                                        📄 PDF (~${Math.round((doc.compressedPDF.length * 0.75) / 1024)}KB)
                                    </span>
                                </div>
                            ` : doc.fileData ? `
                                <img src="${doc.fileData}" alt="Document preview" class="document-preview-image">
                                <div class="image-info mt-2">
                                    <span class="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                        🖼️ Görsel (~${Math.round((doc.fileData.length * 0.75) / 1024)}KB)
                                    </span>
                                </div>
                            ` : `
                                <div class="document-preview-placeholder">
                                    <div class="text-gray-400 text-center p-8">
                                        <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                        </svg>
                                        <p>Belge önizlemesi mevcut değil</p>
                                    </div>
                                </div>
                            `}
                            <div class="zoom-hint">Yakınlaştırmak için tıklayın</div>
                            <div class="click-to-zoom">Tıkla: Zoom</div>
                            <div class="magnifier-lens" style="display: none;"></div>
                        </div>
                        <div class="document-info mt-3">
                            <p class="text-xs text-gray-500">
                                <strong>Dosya:</strong> ${doc.fileName || 'Bilinmeyen'}
                            </p>
                            ${doc.ocrConfidence ? `
                                <p class="text-xs text-gray-500">
                                    <strong>OCR Güven:</strong> %${Math.round(doc.ocrConfidence * 100)}
                                </p>
                            ` : ''}
                        </div>
                    </div>

                    <!-- Right Sidebar -->
                    <div class="quick-look-right-sidebar">
                        <!-- Document Classification Card -->
                        <div class="quick-look-classification">
                            <h3 class="font-medium text-gray-900 mb-3">🏷️ Belge Türü</h3>
                            <div class="classification-result mb-4">
                                <div class="current-classification">
                                    <span class="classification-badge bg-${typeInfo.color}-100 text-${typeInfo.color}-800">
                                        ${docType.name || 'Bilinmeyen'}
                                    </span>
                                    ${docType.confidence ? `
                                        <span class="confidence-score text-xs text-gray-500 ml-2">
                                            %${Math.round(docType.confidence * 100)} güven
                                        </span>
                                    ` : ''}
                                </div>
                            </div>
                            
                            <div class="classification-manual">
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Manuel Düzeltme:
                                </label>
                                <select class="classification-select" data-field="documentType">
                                    ${Object.entries(this.documentTypes).map(([type, info]) => `
                                        <option value="${type}" ${docType.type === type ? 'selected' : ''}>
                                            ${info.name}
                                        </option>
                                    `).join('')}
                                </select>
                            </div>
                        </div>

                        <!-- Patient Information Card -->
                        <div class="quick-look-patient">
                            <h3 class="font-medium text-gray-900 mb-3">👤 Hasta Bilgileri</h3>
                            
                            <div class="patient-extraction mb-4">
                                <div class="extracted-info">
                                    <label class="block text-sm font-medium text-gray-700 mb-1">
                                        Çıkarılan Ad Soyad:
                                    </label>
                                    <input type="text" 
                                           class="patient-name-input" 
                                           data-field="patientName"
                                           value="${patientInfo.name || ''}" 
                                           placeholder="Hasta adı bulunamadı">
                                    
                                    <label class="block text-sm font-medium text-gray-700 mb-1 mt-3">
                                        TC Kimlik No:
                                    </label>
                                    <input type="text" 
                                           class="patient-tc-input" 
                                           data-field="patientTc"
                                           value="${patientInfo.tcNo || ''}" 
                                           placeholder="TC No bulunamadı"
                                           maxlength="11">
                                </div>
                            </div>

                            <div class="patient-matching">
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Hasta Eşleştirme:
                                </label>
                                ${matchedPatient ? `
                                    <div class="matched-patient bg-green-50 border border-green-200 rounded-lg p-3">
                                        <div class="flex items-center">
                                            <div class="flex-shrink-0">
                                                <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                                                </svg>
                                            </div>
                                            <div class="ml-3">
                                                <p class="text-sm font-medium text-green-800">
                                                    ${matchedPatient.name}
                                                </p>
                                                <p class="text-xs text-green-600">
                                                    TC: ${matchedPatient.tcNo || 'Yok'} • ID: ${matchedPatient.id}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ` : `
                                    <div class="no-match bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                        <div class="flex items-center">
                                            <div class="flex-shrink-0">
                                                <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                                                </svg>
                                            </div>
                                            <div class="ml-3">
                                                <p class="text-sm font-medium text-yellow-800">
                                                    Eşleşen hasta bulunamadı
                                                </p>
                                                <p class="text-xs text-yellow-600">
                                                    Manuel hasta seçimi gerekli
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                `}
                                
                                <!-- Manual patient selection -->
                                <div class="manual-patient-selection mt-3">
                                    <label class="block text-sm font-medium text-gray-700 mb-1">
                                        Manuel Hasta Seçimi:
                                    </label>
                                    <select class="patient-select" data-field="selectedPatient">
                                        <option value="">Hasta seçin...</option>
                                        <!-- Will be populated by JavaScript -->
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- OCR Results (Full width at bottom) -->
                    ${doc.ocrText ? `
                        <div class="quick-look-ocr">
                            <h3 class="font-medium text-gray-900 mb-3">📝 OCR Metni</h3>
                            <div class="ocr-text-container">
                                <textarea class="ocr-text-display" readonly>${doc.ocrText}</textarea>
                            </div>
                        </div>
                    ` : ''}
                </div>

                <div class="quick-look-actions">
                    <button class="btn-cancel" data-action="cancel">
                        İptal
                    </button>
                    <button class="btn-save" data-action="save">
                        💾 Kaydet ve Devam Et
                    </button>
                </div>
            </div>
        `;

        return modal;
    }

    /**
     * Setup event listeners for QuickLook modal
     */
    setupEventListeners() {
        if (!this.container) return;

        // Close button
        const closeBtn = this.container.querySelector('[data-action="close"]');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hide());
        }

        // Action buttons
        const cancelBtn = this.container.querySelector('[data-action="cancel"]');
        const saveBtn = this.container.querySelector('[data-action="save"]');

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.onCancel();
                this.hide();
            });
        }

        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const updatedDocument = this.gatherFormData();
                this.onSave(updatedDocument);
                this.hide();
            });
        }

        // Escape key to close
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.hide();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);

        // Click outside to close
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) {
                this.hide();
            }
        });

        // Populate patient dropdown
        this.populatePatientDropdown();
        
        // Setup magnifier functionality
        this.setupMagnifier();
    }

    /**
     * Setup magnifier functionality for document preview
     */
    setupMagnifier() {
        if (!this.container) return;

        const previewContainer = this.container.querySelector('.document-preview-container');
        const previewImage = this.container.querySelector('.document-preview-image');
        const previewPDF = this.container.querySelector('.document-preview-pdf');
        const magnifierLens = this.container.querySelector('.magnifier-lens');

        if (!previewContainer) return;

        // Image magnifier
        if (previewImage) {
            this.setupImageMagnifier(previewContainer, previewImage, magnifierLens);
        }

        // PDF zoom functionality
        if (previewPDF) {
            this.setupPDFZoom(previewContainer, previewPDF);
        }
    }

    /**
     * Setup image magnifier with lens effect
     */
    setupImageMagnifier(container, image, lens) {
        let isZoomed = false;

        // Click to toggle zoom
        image.addEventListener('click', (e) => {
            e.preventDefault();
            isZoomed = !isZoomed;
            
            if (isZoomed) {
                image.classList.add('zoomed');
                container.style.overflow = 'visible';
            } else {
                image.classList.remove('zoomed');
                container.style.overflow = 'hidden';
            }
        });

        // Mouse movement for lens effect
        if (lens) {
            container.addEventListener('mouseenter', () => {
                lens.style.display = 'block';
                lens.classList.add('active');
            });

            container.addEventListener('mouseleave', () => {
                lens.style.display = 'none';
                lens.classList.remove('active');
            });

            container.addEventListener('mousemove', (e) => {
                const rect = container.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Position lens at cursor
                lens.style.left = (x - 75) + 'px'; // 75 = lens radius
                lens.style.top = (y - 75) + 'px';
            });
        }

        if (this.debug) console.log('🔍 Image magnifier setup complete');
    }

    /**
     * Setup PDF zoom functionality
     */
    setupPDFZoom(container, pdf) {
        let isZoomed = false;

        pdf.addEventListener('click', (e) => {
            e.preventDefault();
            isZoomed = !isZoomed;
            
            if (isZoomed) {
                pdf.classList.add('zoomed');
                container.style.overflow = 'visible';
            } else {
                pdf.classList.remove('zoomed');
                container.style.overflow = 'hidden';
            }
        });

        // Double-click for extra zoom
        pdf.addEventListener('dblclick', (e) => {
            e.preventDefault();
            pdf.style.transform = isZoomed ? 'scale(2.5)' : 'scale(1.5)';
        });

        if (this.debug) console.log('🔍 PDF zoom setup complete');
    }

    /**
     * Populate patient dropdown from global patient database
     */
    populatePatientDropdown() {
        const patientSelect = this.container.querySelector('.patient-select');
        if (!patientSelect) return;

        // Clear existing options (except first)
        while (patientSelect.children.length > 1) {
            patientSelect.removeChild(patientSelect.lastChild);
        }

        // Get patient database from global scope
        const patientDatabase = window.patientDatabase || [];
        
        patientDatabase.forEach(patient => {
            const option = document.createElement('option');
            option.value = patient.id;
            option.textContent = `${patient.name} - ${patient.tcNo || patient.tcNumber || 'TC Yok'}`;
            
            // Select if it's the currently matched patient
            if (this.currentDocument.matchedPatient && patient.id === this.currentDocument.matchedPatient.id) {
                option.selected = true;
            }
            
            patientSelect.appendChild(option);
        });

        if (this.debug) console.log(`📱 Populated patient dropdown with ${patientDatabase.length} patients`);
    }

    /**
     * Gather form data from QuickLook modal
     */
    gatherFormData() {
        if (!this.container || !this.currentDocument) return this.currentDocument;

        const updatedDoc = { ...this.currentDocument };

        // Document type
        const docTypeSelect = this.container.querySelector('[data-field="documentType"]');
        if (docTypeSelect) {
            const selectedType = docTypeSelect.value;
            const typeInfo = this.documentTypes[selectedType];
            updatedDoc.documentType = {
                type: selectedType,
                name: typeInfo.name,
                confidence: 1.0, // Manual selection gets full confidence
                manual: true
            };
        }

        // Patient information
        const patientNameInput = this.container.querySelector('[data-field="patientName"]');
        const patientTcInput = this.container.querySelector('[data-field="patientTc"]');
        
        if (patientNameInput || patientTcInput) {
            updatedDoc.extractedPatientInfo = {
                ...updatedDoc.extractedPatientInfo,
                name: patientNameInput ? patientNameInput.value : '',
                tcNo: patientTcInput ? patientTcInput.value : '',
                manual: true
            };
        }

        // Patient matching
        const patientSelect = this.container.querySelector('[data-field="selectedPatient"]');
        if (patientSelect && patientSelect.value) {
            const patientDatabase = window.patientDatabase || [];
            const selectedPatient = patientDatabase.find(p => p.id === patientSelect.value);
            if (selectedPatient) {
                updatedDoc.matchedPatient = selectedPatient;
                updatedDoc.status = 'manual_matched';
            }
        }

        if (this.debug) console.log('📱 Gathered form data:', updatedDoc);
        return updatedDoc;
    }

    /**
     * Static method to create and show QuickLook
     */
    static async show(docData, options = {}) {
        const quickLook = new QuickLookModal(options);
        await quickLook.show(docData, options);
        return quickLook;
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.QuickLookModal = QuickLookModal;
    
    // Also provide backward compatibility with old QuickLook name
    if (typeof window.QuickLook === 'undefined') {
        window.QuickLook = QuickLookModal;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuickLookModal;
}
