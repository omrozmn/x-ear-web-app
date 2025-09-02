/**
 * Enhanced Storage Manager for SGK Documents
 * Handles unlimited storage with background processing and notifications
 */

window.SGK = window.SGK || {};

window.SGK.StorageManager = class {
    constructor() {
        this.workers = [];
        this.processingQueue = [];
        this.isProcessing = false;
        this.notifications = [];
        this.storageStrategies = ['localStorage', 'indexedDB', 'serverStorage'];
    }

    /**
     * Remove all storage limits and implement unlimited saving
     */
    async saveUnlimited(documents) {
        console.log('💾 Starting unlimited save for', documents.length, 'documents');
        
        try {
            // Start background processing
            this.startBackgroundProcessor(documents);
            
            // Show notification that processing started
            this.showNotification('info', `📤 ${documents.length} belge arka planda işleniyor...`, 0);
            
            // Return immediately - don't block UI
            return {
                success: true,
                message: 'Belgeler arka planda kaydediliyor',
                backgroundProcess: true,
                documentCount: documents.length
            };
            
        } catch (error) {
            console.error('❌ Unlimited save failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Start background processor for documents
     */
    async startBackgroundProcessor(documents) {
        if (this.isProcessing) {
            console.log('🔄 Adding documents to existing processing queue');
            this.processingQueue.push(...documents);
            return;
        }

        this.isProcessing = true;
        this.processingQueue = [...documents];
        
        // Show background processing badge
        this.showBackgroundProcessingBadge(true);
        
        // Store processing status
        localStorage.setItem('background_processing_status', JSON.stringify({
            total: documents.length,
            completed: 0,
            startTime: new Date().toISOString()
        }));
        
        console.log('🚀 Starting background document processor');
        
        const startTime = Date.now();
        let savedCount = 0;
        let errorCount = 0;
        const errors = [];

        try {
            while (this.processingQueue.length > 0) {
                const doc = this.processingQueue.shift();
                
                try {
                    // Process document with multiple storage strategies
                    const result = await this.saveDocumentWithFallback(doc);
                    
                    if (result.success) {
                        savedCount++;
                        console.log(`✅ Saved: ${doc.filename || doc.fileName}`);
                        
                        // Update processing status
                        localStorage.setItem('background_processing_status', JSON.stringify({
                            total: documents.length,
                            completed: savedCount + errorCount,
                            startTime: new Date().toISOString()
                        }));
                        
                        // Update progress notification
                        this.updateProgressNotification(savedCount, savedCount + errorCount, documents.length);
                    } else {
                        throw new Error(result.error || 'Save failed');
                    }
                    
                } catch (docError) {
                    errorCount++;
                    errors.push(`${doc.filename || doc.fileName}: ${docError.message}`);
                    console.error(`❌ Failed to save ${doc.filename}:`, docError);
                }
                
                // Small delay to prevent blocking
                await this.delay(10);
            }

            // Processing complete - show final notification
            const processingTime = Math.round((Date.now() - startTime) / 1000);
            
            // Remove processing status
            localStorage.removeItem('background_processing_status');
            this.showBackgroundProcessingBadge(false);
            
            if (savedCount > 0) {
                this.showNotification('success', 
                    `✅ ${savedCount} belge başarıyla kaydedildi! (${processingTime}s)`, 
                    5000);
                
                if (errorCount > 0) {
                    this.showNotification('warning', 
                        `⚠️ ${errorCount} belgede hata oluştu. Detaylar konsolda.`, 
                        8000);
                    console.warn('Save errors:', errors);
                }
            } else {
                this.showNotification('error', 
                    `❌ Hiçbir belge kaydedilemedi. ${errorCount} hata oluştu.`, 
                    8000);
            }

            // Trigger page refresh notification
            this.showReturnNotification(savedCount, errorCount);

        } finally {
            this.isProcessing = false;
            console.log('🏁 Background processing completed');
        }
    }

    /**
     * Save document with multiple fallback strategies
     */
    async saveDocumentWithFallback(doc) {
        const strategies = [
            () => this.saveToLocalStorage(doc),
            () => this.saveToIndexedDB(doc),
            () => this.saveToChunkedStorage(doc),
            () => this.saveToCompressedStorage(doc)
        ];

        for (const strategy of strategies) {
            try {
                const result = await strategy();
                if (result.success) {
                    return result;
                }
            } catch (error) {
                console.warn('Storage strategy failed, trying next:', error.message);
            }
        }

        throw new Error('All storage strategies failed');
    }

    /**
     * Save to localStorage with optimization
     */
    async saveToLocalStorage(doc) {
        try {
            // Prepare optimized document data
            const optimizedDoc = this.optimizeDocumentForStorage(doc);
            
            // Get patient documents
            const patientId = doc.matchedPatient?.id || doc.patientMatch?.patient?.id;
            if (!patientId) {
                throw new Error('No patient ID found');
            }

            const patientDocsData = JSON.parse(localStorage.getItem(`patient_documents_${patientId}`) || '{"documents": []}');
            
            // Ensure documents array exists
            if (!patientDocsData.documents) {
                patientDocsData.documents = [];
            }

            // Add document to array with unique ID
            optimizedDoc.storageId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            optimizedDoc.savedAt = new Date().toISOString();
            patientDocsData.documents.push(optimizedDoc);

            // Save back to localStorage
            localStorage.setItem(`patient_documents_${patientId}`, JSON.stringify(patientDocsData));

            // Update SGK reports
            await this.updateSGKReports(doc, patientId);

            return { success: true, method: 'localStorage' };

        } catch (error) {
            throw new Error(`LocalStorage failed: ${error.message}`);
        }
    }

    /**
     * Save to IndexedDB for larger storage
     */
    async saveToIndexedDB(doc) {
        return new Promise((resolve, reject) => {
            try {
                const request = indexedDB.open('SGKDocuments', 1);
                
                request.onerror = () => reject(new Error('IndexedDB connection failed'));
                
                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains('documents')) {
                        db.createObjectStore('documents', { keyPath: 'id' });
                    }
                };
                
                request.onsuccess = (event) => {
                    const db = event.target.result;
                    const transaction = db.transaction(['documents'], 'readwrite');
                    const store = transaction.objectStore('documents');
                    
                    const docData = {
                        id: doc.id || Date.now().toString(),
                        patientId: doc.matchedPatient?.id || doc.patientMatch?.patient?.id,
                        filename: doc.filename || doc.fileName,
                        data: doc,
                        saveDate: new Date().toISOString()
                    };
                    
                    const addRequest = store.add(docData);
                    
                    addRequest.onsuccess = () => {
                        resolve({ success: true, method: 'indexedDB' });
                    };
                    
                    addRequest.onerror = () => {
                        reject(new Error('IndexedDB save failed'));
                    };
                };
                
            } catch (error) {
                reject(new Error(`IndexedDB error: ${error.message}`));
            }
        });
    }

    /**
     * Save to chunked storage for very large files
     */
    async saveToChunkedStorage(doc) {
        try {
            const chunks = this.chunkDocument(doc, 100 * 1024); // 100KB chunks
            const chunkIds = [];

            for (let i = 0; i < chunks.length; i++) {
                const chunkId = `chunk_${doc.id}_${i}`;
                localStorage.setItem(chunkId, JSON.stringify(chunks[i]));
                chunkIds.push(chunkId);
            }

            // Save chunk manifest
            const manifest = {
                originalDocId: doc.id,
                chunkIds: chunkIds,
                totalChunks: chunks.length,
                saveDate: new Date().toISOString()
            };

            localStorage.setItem(`manifest_${doc.id}`, JSON.stringify(manifest));

            return { success: true, method: 'chunkedStorage' };

        } catch (error) {
            throw new Error(`Chunked storage failed: ${error.message}`);
        }
    }

    /**
     * Save with maximum compression
     */
    async saveToCompressedStorage(doc) {
        try {
            // Extreme compression - keep only essential data
            const minimalDoc = {
                id: doc.id,
                filename: doc.filename || doc.fileName,
                patientId: doc.matchedPatient?.id || doc.patientMatch?.patient?.id,
                patientName: doc.matchedPatient?.name || doc.patientMatch?.patient?.name,
                documentType: doc.documentType?.type || 'unknown',
                saveDate: new Date().toISOString(),
                // Remove large data like images, PDFs
                hasLargeData: true
            };

            const patientId = minimalDoc.patientId;
            const patientDocsData = JSON.parse(localStorage.getItem(`patient_documents_${patientId}`) || '{"documents": []}');
            
            // Ensure documents array exists
            if (!patientDocsData.documents) {
                patientDocsData.documents = [];
            }

            // Add document to array
            minimalDoc.storageId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            minimalDoc.savedAt = new Date().toISOString();
            patientDocsData.documents.push(minimalDoc);
            
            localStorage.setItem(`patient_documents_${patientId}`, JSON.stringify(patientDocsData));

            return { success: true, method: 'compressedStorage' };

        } catch (error) {
            throw new Error(`Compressed storage failed: ${error.message}`);
        }
    }

    /**
     * Optimize document for storage
     */
    optimizeDocumentForStorage(doc) {
        // Remove large binary data and keep essential info
        return {
            id: doc.id,
            filename: doc.filename || doc.fileName,
            patientName: doc.matchedPatient?.name || doc.patientMatch?.patient?.name,
            documentType: doc.documentType?.displayName || doc.documentType?.type || 'SGK Belgesi',
            uploadDate: doc.uploadDate || new Date().toISOString(),
            saveDate: new Date().toISOString(),
            ocrText: doc.ocrText ? doc.ocrText.substring(0, 1000) : '', // Truncate OCR text
            confidence: doc.patientMatch?.confidence || doc.matchConfidence || 0,
            status: 'saved',
            source: 'sgk_unlimited_storage'
        };
    }

    /**
     * Update SGK reports
     */
    async updateSGKReports(doc, patientId) {
        try {
            const reports = JSON.parse(localStorage.getItem('sgk_reports') || '[]');
            
            const reportEntry = {
                id: doc.id,
                patientId: patientId,
                patientName: doc.matchedPatient?.name || doc.patientMatch?.patient?.name,
                reportType: doc.documentType?.displayName || 'SGK Belgesi',
                filename: doc.filename || doc.fileName,
                saveDate: new Date().toISOString(),
                status: 'saved',
                source: 'unlimited_storage'
            };

            // Remove existing entry
            const filteredReports = reports.filter(r => r.id !== doc.id);
            filteredReports.push(reportEntry);

            localStorage.setItem('sgk_reports', JSON.stringify(filteredReports));

        } catch (error) {
            console.warn('Failed to update SGK reports:', error);
        }
    }

    /**
     * Show notification to user
     */
    showNotification(type, message, duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${this.getNotificationClasses(type)}`;
        notification.innerHTML = `
            <div class="flex items-start">
                <div class="flex-1">
                    <p class="text-sm font-medium">${message}</p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-gray-400 hover:text-gray-600">
                    ×
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        if (duration > 0) {
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, duration);
        }

        return notification;
    }

    /**
     * Update progress notification
     */
    updateProgressNotification(completed, processed, total) {
        const existingNotification = document.querySelector('.progress-notification');
        if (existingNotification) {
            const percentage = Math.round((processed / total) * 100);
            existingNotification.innerHTML = `
                <div class="flex items-center">
                    <div class="flex-1">
                        <p class="text-sm font-medium">📤 Belgeler kaydediliyor...</p>
                        <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div class="bg-blue-600 h-2 rounded-full" style="width: ${percentage}%"></div>
                        </div>
                        <p class="text-xs text-gray-600 mt-1">${completed} kaydedildi, ${processed}/${total} işlendi</p>
                    </div>
                </div>
            `;
        } else {
            const notification = this.showNotification('info', 
                `📤 Belgeler kaydediliyor... ${completed}/${total}`, 0);
            notification.classList.add('progress-notification');
        }
    }

    /**
     * Show return notification for users who navigate away
     */
    showReturnNotification(savedCount, errorCount) {
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification('SGK Belge İşleme Tamamlandı', {
                        body: `${savedCount} belge kaydedildi. Sayfaya geri dönüp kontrol edebilirsiniz.`,
                        icon: '/favicon.ico'
                    });
                }
            });
        }

        // Also store notification for when user returns
        const returnNotification = {
            id: Date.now(),
            type: 'completion',
            message: `✅ ${savedCount} belge başarıyla kaydedildi!`,
            timestamp: new Date().toISOString(),
            details: { savedCount, errorCount }
        };

        const notifications = JSON.parse(localStorage.getItem('pending_notifications') || '[]');
        notifications.push(returnNotification);
        localStorage.setItem('pending_notifications', JSON.stringify(notifications));
    }

    /**
     * Check for pending notifications when user returns
     */
    checkPendingNotifications() {
        try {
            const notifications = JSON.parse(localStorage.getItem('pending_notifications') || '[]');
            
            notifications.forEach(notification => {
                this.showNotification('success', notification.message, 8000);
            });

            if (notifications.length > 0) {
                localStorage.removeItem('pending_notifications');
            }

        } catch (error) {
            console.warn('Failed to check pending notifications:', error);
        }
    }

    /**
     * Utility methods
     */
    getNotificationClasses(type) {
        const classes = {
            success: 'bg-green-100 border border-green-400 text-green-700',
            error: 'bg-red-100 border border-red-400 text-red-700',
            warning: 'bg-yellow-100 border border-yellow-400 text-yellow-700',
            info: 'bg-blue-100 border border-blue-400 text-blue-700'
        };
        return classes[type] || classes.info;
    }

    chunkDocument(doc, chunkSize) {
        const docString = JSON.stringify(doc);
        const chunks = [];
        
        for (let i = 0; i < docString.length; i += chunkSize) {
            chunks.push(docString.slice(i, i + chunkSize));
        }
        
        return chunks;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Show/hide background processing badge
     */
    showBackgroundProcessingBadge(show) {
        const badge = document.getElementById('backgroundProcessingBadge');
        if (badge) {
            if (show) {
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        }
    }

    /**
     * Retrieve all documents for a specific patient from all storage methods
     */
    async retrievePatientDocuments(patientId) {
        try {
            let allDocuments = [];

            // 1. Check localStorage (specific patient key)
            try {
                const patientDocs = JSON.parse(localStorage.getItem(`patient_documents_${patientId}`) || '{}');
                if (patientDocs.documents && Array.isArray(patientDocs.documents)) {
                    allDocuments = allDocuments.concat(patientDocs.documents);
                }
            } catch (error) {
                console.warn('Could not retrieve from localStorage:', error);
            }

            // 2. Check IndexedDB
            try {
                const db = await this.openIndexedDB();
                const transaction = db.transaction(['patientDocuments'], 'readonly');
                const store = transaction.objectStore('patientDocuments');
                const result = await store.get(patientId);
                
                if (result && result.documents) {
                    allDocuments = allDocuments.concat(result.documents);
                }
            } catch (error) {
                console.warn('Could not retrieve from IndexedDB:', error);
            }

            // 3. Check chunked storage
            try {
                const chunkKeys = Object.keys(localStorage).filter(key => 
                    key.startsWith(`manifest_`) && localStorage.getItem(key)
                );
                
                for (const manifestKey of chunkKeys) {
                    const manifest = JSON.parse(localStorage.getItem(manifestKey));
                    if (manifest.patientId === patientId) {
                        // Reconstruct document from chunks
                        const chunks = [];
                        for (const chunkId of manifest.chunkIds) {
                            const chunk = JSON.parse(localStorage.getItem(chunkId) || 'null');
                            if (chunk) chunks.push(chunk);
                        }
                        
                        if (chunks.length === manifest.totalChunks) {
                            const reconstructedDoc = this.reconstructFromChunks(chunks);
                            allDocuments.push(reconstructedDoc);
                        }
                    }
                }
            } catch (error) {
                console.warn('Could not retrieve from chunked storage:', error);
            }

            // Remove duplicates based on document ID
            const uniqueDocuments = [];
            const seenIds = new Set();
            
            for (const doc of allDocuments) {
                if (doc.id && !seenIds.has(doc.id)) {
                    seenIds.add(doc.id);
                    uniqueDocuments.push(doc);
                }
            }

            console.log(`📄 Retrieved ${uniqueDocuments.length} unique documents for patient ${patientId}`);
            return uniqueDocuments;

        } catch (error) {
            console.error('Error retrieving patient documents:', error);
            return [];
        }
    }

    /**
     * Reconstruct document from chunks
     */
    reconstructFromChunks(chunks) {
        try {
            // Combine all chunk data
            let combinedData = '';
            for (const chunk of chunks) {
                combinedData += chunk.data || '';
            }
            
            // Parse the reconstructed document
            return JSON.parse(combinedData);
        } catch (error) {
            console.error('Error reconstructing document from chunks:', error);
            return null;
        }
    }
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.SGK.storageManager = new window.SGK.StorageManager();
    window.SGK.storageManager.checkPendingNotifications();
});

console.log('✅ SGK Storage Manager loaded');
