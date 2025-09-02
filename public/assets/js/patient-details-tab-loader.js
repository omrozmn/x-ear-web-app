/**
 * Patient Details Tab Loader - Dynamic loading system for patient detail tabs
 * This system loads tab content from separate HTML files and their associated JavaScript
 */

class PatientDetailsTabLoader {
    constructor() {
        this.loadedTabs = new Map();
        this.contentCache = new Map();
        this.basePath = 'patient-details-tabs/';
        this.jsBasePath = 'assets/js/patient-details-tabs/';
        this.loadingIndicators = new Map();
    }

    /**
     * Load tab content from external file
     * @param {string} tabId - The tab identifier (e.g., 'general', 'documents')
     * @returns {Promise<string>} The HTML content of the tab
     */
    async loadTabContent(tabId) {
        console.log(`� Loading tab '${tabId}' content`);
        
        try {
            // Use inline content generation instead of external files
            const content = this.generateInlineContent(tabId);
            return content;
            
        } catch (error) {
            console.error(`❌ Error loading tab ${tabId}:`, error);
            return this.getFallbackContent(tabId);
        }
    }

    /**
     * Generate inline content for tabs instead of loading from files
     * @param {string} tabId - The tab identifier
     * @returns {string} Generated HTML content for the tab
     */
    generateInlineContent(tabId) {
        console.log(`🎨 Generating inline content for tab: ${tabId}`);
        
        const tabTemplates = {
            general: `
                <div class="space-y-6">
                    <!-- Quick Action Buttons -->
                    <div class="flex space-x-4 mb-6">
                        <button onclick="addAppointment('${window.currentPatientId || ''}')" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            Yeni Randevu
                        </button>
                        <button onclick="createSale()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                            </svg>
                            Yeni Satış
                        </button>
                    </div>
                    
                    <!-- Single Column Layout for Notes -->
                    <div class="bg-white rounded-lg border border-gray-200 p-6">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-semibold text-gray-900">Hasta Notları</h3>
                            <button onclick="addNote()" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 flex items-center">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                                </svg>
                                Not Ekle
                            </button>
                        </div>
                        <div id="quickNotes" class="space-y-3 max-h-96 overflow-y-auto">
                            <div class="text-center py-8 text-gray-500">
                                Notlar yükleniyor...
                            </div>
                        </div>
                    </div>
                </div>
            `,
            documents: `
                <div class="space-y-6">
                    <!-- Upload Section -->
                    <div class="bg-white rounded-lg border border-gray-200 p-6">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-semibold text-gray-900">Belge Yönetimi</h3>
                            <button onclick="uploadDocument()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center">
                                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                                </svg>
                                Belge Yükle
                            </button>
                        </div>
                        
                        <!-- Quick Actions -->
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <button onclick="uploadSpecificDocument('sgk_report')" class="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <div class="flex items-center">
                                    <svg class="w-8 h-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                    <div>
                                        <h4 class="font-medium text-gray-900">SGK Raporu</h4>
                                        <p class="text-sm text-gray-500">Sağlık kurulu raporu yükle</p>
                                    </div>
                                </div>
                            </button>
                            <button onclick="uploadSpecificDocument('hearing_test')" class="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <div class="flex items-center">
                                    <svg class="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
                                    </svg>
                                    <div>
                                        <h4 class="font-medium text-gray-900">İşitme Testi</h4>
                                        <p class="text-sm text-gray-500">Odyogram sonucu yükle</p>
                                    </div>
                                </div>
                            </button>
                            <button onclick="uploadSpecificDocument('prescription')" class="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <div class="flex items-center">
                                    <svg class="w-8 h-8 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                    </svg>
                                    <div>
                                        <h4 class="font-medium text-gray-900">Reçete</h4>
                                        <p class="text-sm text-gray-500">Doktor reçetesi yükle</p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Documents List -->
                    <div class="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Yüklenen Belgeler</h3>
                        <div id="documents-list">
                            <div class="text-center py-8 text-gray-500">
                                Belgeler yükleniyor...
                            </div>
                        </div>
                    </div>
                    
                    <!-- E-Receipt Integration Notice -->
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div class="flex items-start">
                            <svg class="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <div>
                                <h4 class="text-blue-800 font-medium">E-reçete ve SGK İşlemleri</h4>
                                <p class="text-blue-700 text-sm mt-1">E-reçete sorgulama ve SGK rapor işlemleri için <strong>SGK</strong> sekmesini kullanın.</p>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            timeline: `
                <div class="space-y-6">
                    <div class="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Zaman Çizelgesi</h3>
                        <div id="timelineTabContent">
                            <div class="text-center py-8 text-gray-500">
                                Zaman çizelgesi yükleniyor...
                            </div>
                        </div>
                    </div>
                </div>
            `,
            sales: `
                <div class="space-y-6">
                    <div class="bg-white rounded-lg border border-gray-200 p-6">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-semibold text-gray-900">Satış Bilgileri</h3>
                            <button onclick="createSale()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center">
                                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                                </svg>
                                Yeni Satış
                            </button>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div class="bg-blue-50 p-4 rounded-lg">
                                <h4 class="text-sm font-medium text-blue-800">Toplam Satış</h4>
                                <p class="text-2xl font-bold text-blue-900" id="totalSalesAmount">₺0.00</p>
                            </div>
                            <div class="bg-green-50 p-4 rounded-lg">
                                <h4 class="text-sm font-medium text-green-800">Bu Ay</h4>
                                <p class="text-2xl font-bold text-green-900" id="monthlySalesAmount">₺0.00</p>
                            </div>
                            <div class="bg-purple-50 p-4 rounded-lg">
                                <h4 class="text-sm font-medium text-purple-800">Toplam Adet</h4>
                                <p class="text-2xl font-bold text-purple-900" id="totalSalesCount">0</p>
                            </div>
                        </div>
                        <div id="noSalesMessage" class="text-center py-8 text-gray-500" style="display: none;">
                            Henüz satış kaydı bulunmamaktadır.
                        </div>
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tür</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ürün</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Miktar</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Birim Fiyat</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vergi</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Toplam</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody id="salesTableBody" class="bg-white divide-y divide-gray-200">
                                <tr><td colspan="9" class="text-center py-8 text-gray-500">Satış bilgileri yükleniyor...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            `,
            appointments: `
                <div class="space-y-6">
                    <div class="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Randevular</h3>
                        <div id="appointments-content">
                            <div class="text-center py-8 text-gray-500">
                                Randevular yükleniyor...
                            </div>
                        </div>
                    </div>
                </div>
            `,
            devices: `
                <div class="space-y-6">
                    <div class="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Cihaz Bilgileri</h3>
                        <div id="devices-content">
                            <div class="text-center py-8 text-gray-500">
                                Cihaz bilgileri yükleniyor...
                            </div>
                        </div>
                    </div>
                </div>
            `,
            sgk: `
                <div class="space-y-6">
                    <!-- SGK Information Panel -->
                    <div class="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">SGK Bilgileri</h3>
                        <div id="sgkInfo">
                            <div class="text-center py-8 text-gray-500">
                                SGK bilgileri yükleniyor...
                            </div>
                        </div>
                    </div>

                    <!-- E-reçete and Report Query Panel -->
                    <div class="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">E-reçete ve Rapor Sorgulama</h3>
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <!-- E-reçete Query -->
                            <div class="space-y-4">
                                <h4 class="text-md font-medium text-gray-800">E-reçete Sorgula</h4>
                                <div class="flex space-x-2">
                                    <input type="text" id="eReceiptNo" class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" placeholder="E-reçete numarasını giriniz">
                                    <button onclick="queryEReceipt()" class="btn-primary">Sorgula</button>
                                </div>
                                <div id="eReceiptResult" class="hidden"></div>
                            </div>
                            
                            <!-- Report Query -->
                            <div class="space-y-4">
                                <h4 class="text-md font-medium text-gray-800">Rapor Sorgula</h4>
                                <p class="text-sm text-gray-600 mb-2">TC No ile otomatik rapor sorgulaması</p>
                                <button onclick="queryPatientReport()" class="btn-secondary w-full">Rapor Sorgula</button>
                                <div id="reportResult" class="hidden"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Patient Notes Panel -->
                    <div class="bg-white rounded-lg border border-gray-200 p-6">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-semibold text-gray-900">Hasta Notları</h3>
                            <button onclick="addPatientNote()" class="btn-primary">Not Ekle</button>
                        </div>
                        <div id="patientNotes">
                            <div class="text-center py-8 text-gray-500">
                                Hasta notları yükleniyor...
                            </div>
                        </div>
                    </div>

                    <!-- Device Assignment Panel -->
                    <div class="bg-white rounded-lg border border-gray-200 p-6" id="deviceAssignmentPanel" style="display: none;">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-semibold text-gray-900">Cihaz Atama</h3>
                            <button onclick="assignDevice()" class="btn-primary">Cihaz Ata</button>
                        </div>
                        <div id="assignedDevices">
                            <div class="text-center py-8 text-gray-500">
                                Atanmış cihaz bulunmamaktadır.
                            </div>
                        </div>
                    </div>

                    <!-- Saved E-receipts Panel -->
                    <div class="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Kaydedilmiş E-reçeteler</h3>
                        <div id="savedEReceipts">
                            <div class="text-center py-8 text-gray-500">
                                Kaydedilmiş e-reçete bulunmamaktadır.
                            </div>
                        </div>
                    </div>
                </div>
            `
        };
        
        return tabTemplates[tabId] || `
            <div class="space-y-6">
                <div class="bg-white rounded-lg border border-gray-200 p-6">
                    <div class="text-center py-8 text-gray-500">
                        Bu sekme henüz hazır değil.
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Load tab content for the TabNavigationWidget
     * This is the method called by the tab navigation widget
     * @param {string} tabId - The tab identifier
     * @param {Object} currentPatient - Current patient data (optional)
     * @returns {Promise<string>} The HTML content of the tab
     */
    async loadTab(tabId, currentPatient = null) {
        console.log(`🔄 Loading tab '${tabId}' for TabNavigationWidget`);
        
        try {
            // Generate and return the content
            const content = this.generateInlineContent(tabId);
            
            // Cache the content
            this.contentCache.set(tabId, content);
            
            return content;
            
        } catch (error) {
            console.error(`❌ Error loading tab ${tabId}:`, error);
            return this.getFallbackContent(tabId);
        }
    }

    /**
     * Load and execute tab-specific JavaScript
     * @param {string} tabId - The tab identifier
     */
    async loadTabScript(tabId) {
        // Don't load the same script twice
        if (this.loadedTabs.has(tabId)) {
            console.log(`🔄 Tab script '${tabId}' already loaded`);
            return;
        }

        try {
            console.log(`📜 Loading script for tab '${tabId}'`);
            const response = await fetch(`${this.jsBasePath}${tabId}-tab.js`);
            
            if (!response.ok) {
                console.warn(`⚠️ No specific script found for tab ${tabId}`);
                return;
            }
            
            const scriptContent = await response.text();
            
            // Create and execute script
            const script = document.createElement('script');
            script.textContent = scriptContent;
            script.setAttribute('data-tab', tabId);
            document.head.appendChild(script);
            
            this.loadedTabs.set(tabId, true);
            console.log(`✅ Script for tab '${tabId}' loaded successfully`);
            
        } catch (error) {
            console.warn(`⚠️ Could not load script for tab ${tabId}:`, error);
        }
    }

    /**
     * Inject tab content into a container and initialize it
     * @param {string} tabId - The tab identifier
     * @param {string} containerId - The container element ID
     */
    async injectTab(tabId, containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`❌ Container '${containerId}' not found for tab '${tabId}'`);
            return;
        }

        // Show loading indicator
        this.showLoadingIndicator(container, tabId);

        try {
            // Load content and script in parallel
            const [content] = await Promise.all([
                this.loadTabContent(tabId),
                this.loadTabScript(tabId)
            ]);

            // Inject the content
            container.innerHTML = content;
            
            // Initialize tab-specific functionality
            await this.initializeTab(tabId);
            
            // Hide loading indicator
            this.hideLoadingIndicator(container);
            
            // Trigger tab loaded event
            this.triggerTabLoadedEvent(tabId);
            
            console.log(`🎉 Tab '${tabId}' successfully injected and initialized`);
            
        } catch (error) {
            console.error(`❌ Error injecting tab ${tabId}:`, error);
            container.innerHTML = this.getFallbackContent(tabId);
            this.hideLoadingIndicator(container);
        }
    }

    /**
     * Initialize tab-specific functionality after content is loaded
     * @param {string} tabId - The tab identifier
     */
    async initializeTab(tabId) {
        console.log(`🔧 Initializing tab '${tabId}'`);
        
        // Tab-specific initialization
        switch (tabId) {
            case 'general':
                // Load notes only (personal info is shown in patient profile header)
                if (typeof loadQuickNotes === 'function') {
                    loadQuickNotes();
                }
                break;
                
            case 'documents':
                // Initialize document management
                if (typeof loadDocumentsTabData === 'function') {
                    loadDocumentsTabData();
                }
                // Test PDF functionality
                if (typeof testPDFLibrary === 'function') {
                    testPDFLibrary();
                }
                break;
                
            case 'sales':
                // Load sales data
                if (typeof loadSalesData === 'function') {
                    loadSalesData();
                }
                break;
                
            case 'timeline':
                // Load timeline data
                if (typeof loadTimeline === 'function') {
                    loadTimeline();
                }
                break;
                
            case 'appointments':
                // Load appointments
                if (typeof loadAppointments === 'function') {
                    loadAppointments();
                }
                break;
                
            case 'devices':
                // Load devices
                if (typeof loadDevices === 'function') {
                    loadDevices();
                }
                break;
                
            case 'sgk':
                try {
                    // Load SGK information
                    if (typeof loadSGKInfo === 'function') {
                        loadSGKInfo();
                    }
                    if (typeof renderSGKInfo === 'function') {
                        renderSGKInfo();
                    }
                    // Load patient notes
                    if (typeof loadPatientNotes === 'function') {
                        loadPatientNotes();
                    }
                    // Load saved e-receipts
                    if (typeof loadSavedEReceipts === 'function') {
                        loadSavedEReceipts();
                    }
                    // Load assigned devices
                    if (typeof loadAssignedDevices === 'function') {
                        loadAssignedDevices();
                    }
                    // Check if patient qualifies for device assignment
                    if (typeof checkDeviceAssignmentEligibility === 'function') {
                        checkDeviceAssignmentEligibility();
                    }
                } catch (error) {
                    console.error('Error initializing SGK tab:', error);
                    // Continue with partial initialization
                }
                break;
        }
        
        // Dispatch custom initialization event
        document.dispatchEvent(new CustomEvent('tabInitialized', { 
            detail: { tabId } 
        }));
    }

    /**
     * Show loading indicator in container
     * @param {HTMLElement} container - The container element
     * @param {string} tabId - The tab identifier
     */
    showLoadingIndicator(container, tabId) {
        const loadingHtml = `
            <div class="flex items-center justify-center py-12" data-loading="${tabId}">
                <div class="flex items-center space-x-3">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span class="text-gray-600">Yükleniyor...</span>
                </div>
            </div>
        `;
        container.innerHTML = loadingHtml;
        this.loadingIndicators.set(tabId, container);
    }

    /**
     * Hide loading indicator
     * @param {HTMLElement} container - The container element
     */
    hideLoadingIndicator(container) {
        const loadingElement = container.querySelector('[data-loading]');
        if (loadingElement) {
            loadingElement.remove();
        }
    }

    /**
     * Trigger custom event when tab is loaded
     * @param {string} tabId - The tab identifier
     */
    triggerTabLoadedEvent(tabId) {
        document.dispatchEvent(new CustomEvent('tabLoaded', { 
            detail: { tabId, timestamp: Date.now() } 
        }));
    }

    /**
     * Get fallback content when tab loading fails
     * @param {string} tabId - The tab identifier
     * @returns {string} Fallback HTML content
     */
    getFallbackContent(tabId) {
        const tabNames = {
            general: 'Genel Bilgiler',
            documents: 'Belgeler',
            timeline: 'Zaman Çizelgesi',
            sales: 'Satışlar',
            appointments: 'Randevular',
            devices: 'Cihazlar',
            sgk: 'SGK Bilgileri'
        };
        
        const tabName = tabNames[tabId] || 'Bilinmeyen Tab';
        
        return `
            <div class="flex items-center justify-center py-12">
                <div class="text-center">
                    <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                    </svg>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">İçerik Yüklenemedi</h3>
                    <p class="text-gray-600 mb-4">${tabName} sekmesi yüklenirken bir hata oluştu.</p>
                    <button onclick="location.reload()" class="btn-primary">
                        Sayfayı Yenile
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Preload tab content for better performance
     * @param {string[]} tabIds - Array of tab IDs to preload
     */
    async preloadTabs(tabIds) {
        console.log('🚀 Preloading tabs:', tabIds);
        
        const promises = tabIds.map(async (tabId) => {
            try {
                await this.loadTabContent(tabId);
                console.log(`✅ Preloaded tab: ${tabId}`);
            } catch (error) {
                console.warn(`⚠️ Failed to preload tab: ${tabId}`, error);
            }
        });
        
        await Promise.allSettled(promises);
        console.log('🎉 Tab preloading completed');
    }

    /**
     * Clear cache for a specific tab or all tabs
     * @param {string} [tabId] - Optional tab ID to clear, if not provided clears all
     */
    clearCache(tabId = null) {
        if (tabId) {
            this.contentCache.delete(tabId);
            this.loadedTabs.delete(tabId);
            console.log(`🗑️ Cache cleared for tab: ${tabId}`);
        } else {
            this.contentCache.clear();
            this.loadedTabs.clear();
            console.log('🗑️ All tab cache cleared');
        }
    }

    /**
     * Get cache statistics
     * @returns {Object} Cache statistics
     */
    getCacheStats() {
        return {
            contentCacheSize: this.contentCache.size,
            loadedTabsCount: this.loadedTabs.size,
            cachedTabs: Array.from(this.contentCache.keys()),
            loadedTabs: Array.from(this.loadedTabs.keys())
        };
    }
}

// Create global instance
window.patientDetailsTabLoader = new PatientDetailsTabLoader();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PatientDetailsTabLoader;
}

console.log('🎯 Patient Details Tab Loader initialized');
