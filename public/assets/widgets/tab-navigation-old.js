class TabNavigationWidget {
    constructor(containerId, tabs, options = {}) {
        this.containerId = containerId;
        this.tabs = tabs;
        this.activeTab = tabs[0]?.id || null;
        this.useDynamicLoading = options.useDynamicLoading || false;
        this.currentPatient = options.currentPatient || null;
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="card">
                <div class="border-b border-gray-200">
                    <nav class="flex space-x-8 px-6" id="tabNavigation">
                        ${this.tabs.map(tab => `
                            <button class="tab-nav-item ${tab.id === this.activeTab ? 'active' : ''}" 
                                    data-tab="${tab.id}" 
                                    onclick="window.tabNavigation.switchTab('${tab.id}')">
                                ${tab.label}
                            </button>
                        `).join('')}
                    </nav>
                </div>
                <div class="p-6">
                    ${this.useDynamicLoading ? 
                        '<div id="tab-content"></div>' : 
                        this.tabs.map(tab => `
                            <div id="${tab.id}" class="tab-content ${tab.id === this.activeTab ? '' : 'hidden'}">
                                ${tab.content || ''}
                            </div>
                        `).join('')
                    }
                </div>
            </div>
        `;

        // Store reference for global access
        window.tabNavigation = this;
        
        // Load initial tab if using dynamic loading
        if (this.useDynamicLoading && this.activeTab) {
            this.loadTabContent(this.activeTab);
        }
    }

    async switchTab(tabId) {
        if (this.useDynamicLoading) {
            // Update tab button states
            this.updateTabButtons(tabId);
            
            // Load tab content dynamically
            await this.loadTabContent(tabId);
        } else {
            // Legacy static content switching
            this.switchStaticTab(tabId);
        }
        
        this.activeTab = tabId;
        
        // Trigger custom event for tab change
        document.dispatchEvent(new CustomEvent('tabChanged', { detail: { tabId } }));
    }
    
    updateTabButtons(activeTabId) {
        // Update button states
        this.tabs.forEach(tab => {
            const button = document.querySelector(`[data-tab="${tab.id}"]`);
            if (button) {
                if (tab.id === activeTabId) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            }
        });
    }

    async loadTabContent(tabId) {
        if (window.tabLoader) {
            try {
                await window.tabLoader.loadTab(tabId, this.currentPatient);
            } catch (error) {
                console.error(`Failed to load tab ${tabId}:`, error);
                // Fallback to static content if available
                this.switchStaticTab(tabId);
            }
        } else {
            console.warn('TabLoader not available, falling back to static content');
            this.switchStaticTab(tabId);
        }
    }

    switchStaticTab(tabId) {
        // Hide all tab contents
        this.tabs.forEach(tab => {
            const content = document.getElementById(tab.id);
            const button = document.querySelector(`[data-tab="${tab.id}"]`);
            
            if (content) content.classList.add('hidden');
            if (button) button.classList.remove('active');
        });

        // Show selected tab content
        const selectedContent = document.getElementById(tabId);
        const selectedButton = document.querySelector(`[data-tab="${tabId}"]`);
        
        if (selectedContent) selectedContent.classList.remove('hidden');
        if (selectedButton) selectedButton.classList.add('active');
    }

    setCurrentPatient(patient) {
        this.currentPatient = patient;
        // Refresh current tab with new patient data
        if (this.useDynamicLoading && window.tabLoader) {
            window.tabLoader.refreshCurrentTab(patient);
        }
    }

    addTab(tab) {
        this.tabs.push(tab);
        this.render();
    }

    removeTab(tabId) {
        this.tabs = this.tabs.filter(tab => tab.id !== tabId);
        if (this.activeTab === tabId && this.tabs.length > 0) {
            this.activeTab = this.tabs[0].id;
        }
        this.render();
    }

    static createPatientDetailsTabs(containerId) {
        const tabs = [
            {
                id: 'general',
                label: 'Genel',
                content: null, // Will be loaded dynamically
                loadFromFile: true
            },
            {
                id: 'documents',
                label: 'Belgeler',
                content: null, // Will be loaded dynamically
                loadFromFile: true
            },
            {
                id: 'timeline',
                label: 'Zaman Çizelgesi',
                content: null, // Will be loaded dynamically
                loadFromFile: true
            },
            {
                id: 'sales',
                label: 'Satışlar',
                content: null, // Will be loaded dynamically
                loadFromFile: true
            },
            {
                id: 'appointments',
                label: 'Randevular',
                content: null, // Will be loaded dynamically
                loadFromFile: true
            },
            {
                id: 'devices',
                label: 'Cihazlar',
                content: null, // Will be loaded dynamically
                loadFromFile: true
            },
            {
                id: 'sgk',
                label: 'SGK',
                content: null, // Will be loaded dynamically
                loadFromFile: true
            }
        ];

        return new TabNavigationWidget(containerId, tabs);
    }
}

// Legacy content removed - now using dynamic loading system

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TabNavigationWidget;
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold mb-2">SGK Başvuru Belgeleri</h3>
                        <p class="text-sm text-gray-600 mb-4">SGK ödeme işlemi için gerekli belgeleri yükleyiniz. Yüklenen belgeler otomatik olarak PDF formatına dönüştürülecektir.</p>
                    </div>

                    <!-- E-reçete and Rapor Sorgulama Section -->
                    <div class="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <!-- Left Side: E-reçete Sorgulama -->
                            <div class="border-r lg:border-r-2 lg:border-gray-300 lg:pr-6">
                                <h4 class="text-md font-semibold mb-3 text-blue-800">E-reçete Sorgulama</h4>
                                <div class="flex gap-3 items-end mb-3">
                                    <div class="flex-1">
                                        <label for="eReceiptNo" class="block text-sm font-medium text-gray-700 mb-2">E-reçete No</label>
                                        <input 
                                            type="text" 
                                            id="eReceiptNo" 
                                            name="eReceiptNo"
                                            placeholder="E-reçete numarasını giriniz"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                    </div>
                                    <div>
                                        <button 
                                            onclick="queryEReceipt()" 
                                            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                            </svg>
                                            Sorgula
                                        </button>
                                    </div>
                                </div>
                                <div id="eReceiptResult" class="hidden">
                                    <!-- E-receipt query results will be shown here -->
                                </div>
                            </div>
                            
                            <!-- Right Side: Rapor Sorgulama -->
                            <div class="lg:pl-6">
                                <h4 class="text-md font-semibold mb-3 text-green-800">Rapor Sorgulama</h4>
                                <div class="mb-3">
                                    <p class="text-sm text-gray-600 mb-3">Hastanın SGK rapor durumunu sorgulayın</p>
                                    <button 
                                        onclick="queryPatientReports()" 
                                        class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                        </svg>
                                        Rapor Sorgula
                                    </button>
                                </div>
                                <div id="reportQueryResult" class="hidden">
                                    <!-- Report query results will be shown here -->
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Saved E-reçeteler Section -->
                    <div id="savedEReceiptsSection" class="mb-6 hidden">
                        <h4 class="text-lg font-semibold mb-3 text-indigo-800">Kaydedilmiş E-reçeteler</h4>
                        <div id="savedEReceiptsList" class="space-y-3">
                            <!-- Saved e-receipts will be shown here -->
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Reçete -->
                        <div class="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
                            <div class="text-center">
                                <div class="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                    <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                    </svg>
                                </div>
                                <h4 class="text-lg font-medium text-gray-900 mb-2">Reçete</h4>
                                <p class="text-sm text-gray-500 mb-4">Doktor reçetesini yükleyin</p>
                                <input type="file" id="receiptUpload" accept="image/*" class="hidden" onchange="handleDocumentUpload(this, 'recete')">
                                <button onclick="document.getElementById('receiptUpload').click()" class="btn-primary mb-2">
                                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                                    </svg>
                                    Reçete Yükle
                                </button>
                                <div id="receiptStatus" class="text-sm"></div>
                            </div>
                        </div>

                        <!-- Odyogram -->
                        <div class="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-green-400 transition-colors">
                            <div class="text-center">
                                <div class="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
                                    </svg>
                                </div>
                                <h4 class="text-lg font-medium text-gray-900 mb-2">Odyogram</h4>
                                <p class="text-sm text-gray-500 mb-4">Işitme testi sonuçlarını yükleyin</p>
                                <input type="file" id="audiogramUpload" accept="image/*" class="hidden" onchange="handleDocumentUpload(this, 'odyogram')">
                                <button onclick="document.getElementById('audiogramUpload').click()" class="btn-success mb-2">
                                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                                    </svg>
                                    Odyogram Yükle
                                </button>
                                <div id="audiogramStatus" class="text-sm"></div>
                            </div>
                        </div>

                        <!-- Uygunluk Belgesi -->
                        <div class="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-purple-400 transition-colors">
                            <div class="text-center">
                                <div class="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                                    <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                                    </svg>
                                </div>
                                <h4 class="text-lg font-medium text-gray-900 mb-2">Uygunluk Belgesi</h4>
                                <p class="text-sm text-gray-500 mb-4">Cihaz uygunluk belgesini yükleyin</p>
                                <input type="file" id="eligibilityUpload" accept="image/*" class="hidden" onchange="handleDocumentUpload(this, 'uygunluk')">
                                <button onclick="document.getElementById('eligibilityUpload').click()" class="btn-purple mb-2">
                                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                                    </svg>
                                    Uygunluk Belgesi Yükle
                                </button>
                                <div id="eligibilityStatus" class="text-sm"></div>
                            </div>
                        </div>

                        <!-- Pil Reçetesi -->
                        <div class="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-orange-400 transition-colors">
                            <div class="text-center">
                                <div class="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                                    <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                    </svg>
                                </div>
                                <h4 class="text-lg font-medium text-gray-900 mb-2">Pil Reçetesi</h4>
                                <p class="text-sm text-gray-500 mb-4">Pil reçetesini yükleyin</p>
                                <input type="file" id="batteryReceiptUpload" accept="image/*" class="hidden" onchange="handleDocumentUpload(this, 'pilRecetesi')">
                                <button onclick="document.getElementById('batteryReceiptUpload').click()" class="btn-orange mb-2">
                                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                                    </svg>
                                    Pil Reçetesi Yükle
                                </button>
                                <div id="batteryReceiptStatus" class="text-sm"></div>
                            </div>
                        </div>

                        <!-- Diğer Belge -->
                        <div class="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
                            <div class="text-center">
                                <div class="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <svg class="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                    </svg>
                                </div>
                                <h4 class="text-lg font-medium text-gray-900 mb-2">Belge Yükleme & Sınıflandırma</h4>
                                <p class="text-sm text-gray-500 mb-4">Birden fazla belge yükleyip türlerini seçin</p>
                                <input type="file" id="bulkDocUpload" accept="image/*,.pdf" multiple class="hidden" onchange="handleBulkDocumentUpload(this)">
                                <button onclick="document.getElementById('bulkDocUpload').click()" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md mb-2">
                                    <svg class="w-4 h-4 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                                    </svg>
                                    Belgeleri Seç (Çoklu)
                                </button>
                                <div id="bulkUploadStatus" class="text-sm mb-4"></div>
                                
                                <!-- Uploaded Files Classification Area -->
                                <div id="uploadedFilesClassification" class="mt-4 space-y-4 hidden">
                                    <h5 class="font-medium text-gray-900 mb-3">Yüklenen Belgeleri Sınıflandırın:</h5>
                                    <div id="filesClassificationList" class="space-y-3"></div>
                                    <button onclick="processClassifiedDocuments()" id="processDocsBtn" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mt-4 hidden">
                                        <svg class="w-4 h-4 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                                        </svg>
                                        Belgeleri İşle ve Kaydet
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Documents Summary -->
                    <div class="mt-8 bg-gray-50 p-6 rounded-lg">
                        <div class="flex justify-between items-center mb-4">
                            <h4 class="text-lg font-medium text-gray-900">Yüklenen Belgeler</h4>
                            <button onclick="convertDocumentsToPDF()" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm">
                                <svg class="w-4 h-4 mr-1 inline" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/>
                                </svg>
                                PDF'e Dönüştür
                            </button>
                        </div>
                        <div id="documentsListSummary" class="space-y-3">
                            <p class="text-gray-500 text-center py-4">Henüz belge yüklenmedi</p>
                        </div>
                        
                        <div class="mt-6 flex space-x-4">
                            <button onclick="sendToSGK()" id="sendToSGKBtn" class="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                                </svg>
                                SGK'ya Gönder
                            </button>
                            <button onclick="downloadAllDocuments()" id="downloadAllBtn" class="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/>
                                </svg>
                                Tümünü İndir
                            </button>
                            <button onclick="processAllWithOCR()" class="btn-orange">
                                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
                                </svg>
                                Tüm Belgeleri OCR ile İşle
                            </button>
                        </div>
                    </div>
                `
            },
            {
                id: 'timeline',
                label: 'Zaman Çizelgesi',
                content: `
                    <div id="timelineTabContent">
                        <!-- Timeline content will be populated by JavaScript -->
                    </div>
                `
            },
            {
                id: 'sales',
                label: 'Satışlar',
                content: `
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold">Satış Geçmişi</h3>
                        <button class="btn-primary" onclick="createSale()">
                            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/>
                            </svg>
                            Yeni Satış
                        </button>
                    </div>
                    
                    <div class="bg-white rounded-lg shadow">
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tür</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ürün</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adet</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Birim Fiyat</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KDV</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Toplam</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody id="salesTableBody" class="bg-white divide-y divide-gray-200">
                                    <!-- Sales will be populated by JavaScript -->
                                </tbody>
                            </table>
                        </div>
                        
                        <div id="noSalesMessage" class="p-8 text-center text-gray-500" style="display: none;">
                            <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                            </svg>
                            <p class="text-lg font-medium">Henüz satış kaydı bulunmuyor</p>
                            <p class="mt-1">İlk satışınızı oluşturmak için yukarıdaki "Yeni Satış" butonunu kullanabilirsiniz.</p>
                        </div>
                    </div>
                    
                    <!-- Sales Summary -->
                    <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="bg-blue-50 p-4 rounded-lg">
                            <h4 class="text-sm font-medium text-blue-900">Toplam Satış</h4>
                            <p class="text-2xl font-bold text-blue-600" id="totalSalesAmount">₺0.00</p>
                        </div>
                        <div class="bg-green-50 p-4 rounded-lg">
                            <h4 class="text-sm font-medium text-green-900">Bu Ay</h4>
                            <p class="text-2xl font-bold text-green-600" id="monthlySalesAmount">₺0.00</p>
                        </div>
                        <div class="bg-purple-50 p-4 rounded-lg">
                            <h4 class="text-sm font-medium text-purple-900">Satış Adedi</h4>
                            <p class="text-2xl font-bold text-purple-600" id="totalSalesCount">0</p>
                        </div>
                    </div>
                `
            }
        ];

        return new TabNavigationWidget(containerId, tabs);
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TabNavigationWidget;
}