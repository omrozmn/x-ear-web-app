// Patient Management System
console.log('Loading patients.js...');

// Check if PatientManager already exists to avoid duplicate declaration
if (typeof window.PatientManager === 'undefined') {
class PatientManager {
    constructor() {
        this.patients = [];
        this.filteredPatients = [];
        this.selectedPatients = new Set();
        this.currentFilters = {
            search: '',
            status: '',
            segment: '',
            branch: '',
            hearingTest: '',
            trial: '',
            priceGiven: ''
        };
        
        // Pagination state
        this.currentPage = 1;
        this.patientsPerPage = 20;
        this.paginationOptions = [20, 50, 100];
        
        this.loadPatients();
        this.setupEventListeners();
        this.renderPatients();
        this.renderStats();
        this.renderSavedViews();
    }

    loadPatients() {
        // Load patients from sample data
        if (window.sampleData && window.sampleData.patients) {
            this.patients = [...window.sampleData.patients];
            this.filteredPatients = [...this.patients];
        }
    }

    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilters.search = e.target.value;
                this.applyFilters();
            });
        }

        // TC Kimlik No doğrulama
        const tcNumberInput = document.getElementById('tcNumber');
        if (tcNumberInput) {
            tcNumberInput.addEventListener('blur', (e) => {
                const tcNumber = e.target.value.trim();
                const tcNumberError = document.getElementById('tcNumberError');
                
                if (tcNumber && !Utils.validateTCKN(tcNumber)) {
                    tcNumberInput.classList.add('border-red-500');
                    tcNumberError.classList.remove('hidden');
                } else {
                    tcNumberInput.classList.remove('border-red-500');
                    tcNumberError.classList.add('hidden');
                }
            });
        }
        
        // Telefon numarası doğrulama
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('blur', (e) => {
                const phone = e.target.value.trim();
                const phoneError = document.getElementById('phoneError');
                
                if (phone && !Utils.validatePhone(phone)) {
                    phoneInput.classList.add('border-red-500');
                    phoneError.classList.remove('hidden');
                } else {
                    phoneInput.classList.remove('border-red-500');
                    phoneError.classList.add('hidden');
                }
            });
        }

        // Filter dropdowns
        const filters = ['statusFilter', 'segmentFilter', 'branchFilter', 'hearingTestFilter', 'trialFilter', 'priceGivenFilter'];
        filters.forEach(filterId => {
            const filterElement = document.getElementById(filterId);
            if (filterElement) {
                filterElement.addEventListener('change', (e) => {
                    const filterKey = filterId.replace('Filter', '');
                    this.currentFilters[filterKey] = e.target.value;
                    this.applyFilters();
                });
            }
        });
    }

    applyFilters() {
        this.filteredPatients = this.patients.filter(patient => {
            // Search filter
            if (this.currentFilters.search) {
                const searchTerm = this.currentFilters.search.toLowerCase();
                const searchableText = `${patient.name} ${patient.phone} ${patient.email || ''}`.toLowerCase();
                if (!searchableText.includes(searchTerm)) {
                    return false;
                }
            }

            // Status filter
            if (this.currentFilters.status && patient.status !== this.currentFilters.status) {
                return false;
            }

            // Segment filter
            if (this.currentFilters.segment && patient.segment !== this.currentFilters.segment) {
                return false;
            }

            // Branch filter (simplified - using address for now)
            if (this.currentFilters.branch) {
                const patientBranch = this.getBranchFromAddress(patient.address);
                if (patientBranch !== this.currentFilters.branch) {
                    return false;
                }
            }

            return true;
        });

        // Reset to first page when filters change
        this.currentPage = 1;
        this.renderPatients();
        this.renderStats();
    }

    getBranchFromAddress(address) {
        if (address.includes('Kadıköy')) return 'kadikoy';
        if (address.includes('Bakırköy')) return 'bakirkoy';
        return 'merkez';
    }

    // Pagination helper methods
    getTotalPages() {
        return Math.ceil(this.filteredPatients.length / this.patientsPerPage);
    }

    getPaginatedPatients() {
        const startIndex = (this.currentPage - 1) * this.patientsPerPage;
        const endIndex = startIndex + this.patientsPerPage;
        return this.filteredPatients.slice(startIndex, endIndex);
    }

    changePage(page) {
        const totalPages = this.getTotalPages();
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderPatients();
        }
    }

    changePageSize(newSize) {
        this.patientsPerPage = newSize;
        this.currentPage = 1; // Reset to first page
        this.renderPatients();
    }

    renderPatients() {
        const container = document.getElementById('patientsTableContainer');
        if (!container) return;

        const paginatedPatients = this.getPaginatedPatients();
        const totalPages = this.getTotalPages();
        const startIndex = (this.currentPage - 1) * this.patientsPerPage + 1;
        const endIndex = Math.min(startIndex + paginatedPatients.length - 1, this.filteredPatients.length);

        const tableHTML = `
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <input type="checkbox" id="selectAllCheckbox" class="rounded border-gray-300 text-primary focus:ring-primary">
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hasta</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İletişim</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Segment</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Son Ziyaret</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cihaz</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${paginatedPatients.map(patient => this.renderPatientRow(patient)).join('')}
                    </tbody>
                </table>
            </div>
            <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <div class="text-sm text-gray-700">
                        ${this.filteredPatients.length > 0 ? `${startIndex}-${endIndex}` : '0'} / ${this.filteredPatients.length} hasta gösteriliyor
                    </div>
                    <div class="flex items-center space-x-2">
                        <span class="text-sm text-gray-700">Sayfa başına:</span>
                        <select id="pageSizeSelect" class="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent">
                            ${this.paginationOptions.map(option => 
                                `<option value="${option}" ${option === this.patientsPerPage ? 'selected' : ''}>${option}</option>`
                            ).join('')}
                        </select>
                    </div>
                </div>
                <div class="flex items-center space-x-2">
                    <button id="prevPageBtn" class="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" 
                            ${this.currentPage <= 1 ? 'disabled' : ''}>
                        Önceki
                    </button>
                    <div class="flex items-center space-x-1">
                        ${this.renderPaginationNumbers()}
                    </div>
                    <button id="nextPageBtn" class="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" 
                            ${this.currentPage >= totalPages ? 'disabled' : ''}>
                        Sonraki
                    </button>
                </div>
            </div>
        `;

        container.innerHTML = tableHTML;

        // Setup event listeners
        this.setupPaginationEventListeners();

        // Setup select all checkbox
        const selectAllCheckbox = document.getElementById('selectAllCheckbox');
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', (e) => {
                this.toggleSelectAll(e.target.checked);
            });
        }
    }

    renderPaginationNumbers() {
        const totalPages = this.getTotalPages();
        const currentPage = this.currentPage;
        let pages = [];

        if (totalPages <= 7) {
            // Show all pages if 7 or fewer
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Show first page, last page, current page and surrounding pages
            if (currentPage <= 4) {
                pages = [1, 2, 3, 4, 5, '...', totalPages];
            } else if (currentPage >= totalPages - 3) {
                pages = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
            } else {
                pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
            }
        }

        return pages.map(page => {
            if (page === '...') {
                return '<span class="px-3 py-2 text-sm text-gray-500">...</span>';
            } else if (page === currentPage) {
                return `<button class="px-3 py-2 text-sm bg-primary text-white rounded-lg">${page}</button>`;
            } else {
                return `<button class="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50" onclick="patientManager.changePage(${page})">${page}</button>`;
            }
        }).join('');
    }

    setupPaginationEventListeners() {
        // Page size selector
        const pageSizeSelect = document.getElementById('pageSizeSelect');
        if (pageSizeSelect) {
            pageSizeSelect.addEventListener('change', (e) => {
                this.changePageSize(parseInt(e.target.value));
            });
        }

        // Previous page button
        const prevPageBtn = document.getElementById('prevPageBtn');
        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', () => {
                this.changePage(this.currentPage - 1);
            });
        }

        // Next page button
        const nextPageBtn = document.getElementById('nextPageBtn');
        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', () => {
                this.changePage(this.currentPage + 1);
            });
        }
    }

    renderPatientRow(patient) {
        const statusColors = {
            active: 'bg-green-100 text-green-800',
            inactive: 'bg-red-100 text-red-800',
            pending: 'bg-yellow-100 text-yellow-800'
        };

        const segmentColors = {
            lead: 'bg-blue-100 text-blue-800',
            trial: 'bg-purple-100 text-purple-800',
            purchased: 'bg-green-100 text-green-800',
            follow_up: 'bg-gray-100 text-gray-800'
        };

        const segmentLabels = {
            lead: 'Potansiyel',
            trial: 'Deneme',
            purchased: 'Satın Aldı',
            follow_up: 'Takip'
        };

        const deviceInfo = patient.devices.length > 0 
            ? `${patient.devices[0].brand} ${patient.devices[0].model}`
            : 'Cihaz yok';

        const lastVisit = patient.lastVisit 
            ? new Date(patient.lastVisit).toLocaleDateString('tr-TR')
            : 'Hiç gelmedi';

        return `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                    <input type="checkbox" class="patient-checkbox rounded border-gray-300 text-primary focus:ring-primary" data-patient-id="${patient.id}">
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                            <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span class="text-sm font-medium text-gray-700">${patient.name.charAt(0)}</span>
                            </div>
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">
                                <a href="javascript:void(0)" onclick="viewPatient('${patient.id}')" class="text-primary hover:text-blue-900 cursor-pointer">${patient.name}</a>
                            </div>
                            <div class="text-sm text-gray-500">TC: ${patient.tcNumber}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${patient.phone}</div>
                    <div class="text-sm text-gray-500">${patient.email || 'E-posta yok'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[patient.status] || 'bg-gray-100 text-gray-800'}">
                        ${patient.status === 'active' ? 'Aktif' : patient.status === 'inactive' ? 'Pasif' : 'Bekleyen'}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${segmentColors[patient.segment] || 'bg-gray-100 text-gray-800'}">
                        ${segmentLabels[patient.segment] || patient.segment}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${lastVisit}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${deviceInfo}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onclick="viewPatient('${patient.id}')" class="text-primary hover:text-blue-900 mr-3">Görüntüle</button>
                    <button onclick="editPatient('${patient.id}')" class="text-gray-600 hover:text-gray-900">Düzenle</button>
                </td>
            </tr>
        `;
    }

    renderStats() {
        const container = document.getElementById('statsContainer');
        if (!container) return;

        const stats = this.calculateStats();
        
        const statsHTML = `
            <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                        </div>
                    </div>
                    <div class="ml-5 w-0 flex-1">
                        <dl>
                            <dt class="text-sm font-medium text-gray-500 truncate">Toplam Hasta</dt>
                            <dd class="text-lg font-medium text-gray-900">${stats.total}</dd>
                        </dl>
                    </div>
                </div>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                    </div>
                    <div class="ml-5 w-0 flex-1">
                        <dl>
                            <dt class="text-sm font-medium text-gray-500 truncate">Aktif Hastalar</dt>
                            <dd class="text-lg font-medium text-gray-900">${stats.active}</dd>
                        </dl>
                    </div>
                </div>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                        </div>
                    </div>
                    <div class="ml-5 w-0 flex-1">
                        <dl>
                            <dt class="text-sm font-medium text-gray-500 truncate">Deneme Sürecinde</dt>
                            <dd class="text-lg font-medium text-gray-900">${stats.trial}</dd>
                        </dl>
                    </div>
                </div>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                    </div>
                    <div class="ml-5 w-0 flex-1">
                        <dl>
                            <dt class="text-sm font-medium text-gray-500 truncate">Bekleyen</dt>
                            <dd class="text-lg font-medium text-gray-900">${stats.pending}</dd>
                        </dl>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = statsHTML;
    }

    calculateStats() {
        return {
            total: this.filteredPatients.length,
            active: this.filteredPatients.filter(p => p.status === 'active').length,
            trial: this.filteredPatients.filter(p => p.segment === 'trial').length,
            pending: this.filteredPatients.filter(p => p.status === 'pending').length
        };
    }

    renderSavedViews() {
        const container = document.getElementById('savedViews');
        if (!container) return;

        // Load saved views from localStorage
        const savedViews = this.loadSavedViews();
        
        // Add default views
        const defaultViews = [
            { id: 'trial_no_purchase', name: 'Deneme + Fiyat Verildi + Satın Almadı', filters: { segment: 'trial', priceGiven: 'yes', status: 'active' } },
            { id: 'no_show', name: 'Randevuya Gelmeyenler', filters: { status: 'inactive' } },
            { id: 'high_priority', name: 'Yüksek Öncelik', filters: { segment: 'trial' } },
            { id: 'new_leads', name: 'Yeni Potansiyeller', filters: { segment: 'lead' } }
        ];
        
        const allViews = [...defaultViews, ...savedViews];
        
        if (allViews.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-sm">Henüz kayıtlı görünüm yok</p>';
            return;
        }

        const viewsHTML = allViews.map(view => `
            <button class="px-3 py-1 text-sm ${view.id.startsWith('trial_') || view.id === 'high_priority' ? 'bg-red-100 text-red-800 hover:bg-red-200' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'} rounded-full transition-colors" 
                    onclick="window.patientManager.applySavedView('${view.id}')">
                ${view.name}
                ${!defaultViews.find(dv => dv.id === view.id) ? `
                    <button class="ml-2 text-current hover:opacity-75" onclick="event.stopPropagation(); window.patientManager.deleteSavedView('${view.id}')">
                        ×
                    </button>
                ` : ''}
            </button>
        `).join('');

        container.innerHTML = viewsHTML;
    }

    toggleSelectAll(checked) {
        const checkboxes = document.querySelectorAll('.patient-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = checked;
            const patientId = checkbox.dataset.patientId;
            if (checked) {
                this.selectedPatients.add(patientId);
            } else {
                this.selectedPatients.delete(patientId);
            }
        });
        this.updateSelectedCount();
    }

    selectAll() {
        this.toggleSelectAll(true);
    }

    updateSelectedCount() {
        const countElement = document.getElementById('selectedCount');
        if (countElement) {
            countElement.textContent = `${this.selectedPatients.size} hasta seçildi`;
        }

        // Enable/disable bulk action buttons
        const bulkButtons = document.querySelectorAll('[onclick^="bulk"], [onclick^="export"]');
        bulkButtons.forEach(button => {
            button.disabled = this.selectedPatients.size === 0;
            if (this.selectedPatients.size === 0) {
                button.classList.add('opacity-50');
            } else {
                button.classList.remove('opacity-50');
            }
        });
    }

    handleNewPatient(form) {
        const formData = new FormData(form);
        const tcNumber = formData.get('tcNumber') || '';
        
        // TC Kimlik No doğrulama
        if (tcNumber && !Utils.validateTCKN(tcNumber)) {
            this.showNotification('Geçersiz TC Kimlik Numarası! Lütfen kontrol ediniz.', 'error');
            return false;
        }
        
        // Telefon numarası doğrulama
        const phone = formData.get('phone') || '';
        if (phone && !Utils.validatePhone(phone)) {
            this.showNotification('Geçersiz telefon numarası! Lütfen kontrol ediniz.', 'error');
            return false;
        }
        
        const newPatient = {
            id: 'p' + (this.patients.length + 1),
            name: `${formData.get('firstName')} ${formData.get('lastName')}`,
            tcNumber: tcNumber,
            phone: formData.get('phone'),
            email: formData.get('email') || '',
            birthDate: formData.get('birthDate') || '',
            address: formData.get('address') || '',
            status: 'pending',
            segment: 'lead',
            acquisitionType: formData.get('acquisitionType') || 'tabela',
            acquisitionDate: new Date().toISOString().split('T')[0],
            currentLabel: this.getInitialLabel(formData.get('acquisitionType')),
            lastVisit: new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            notes: formData.get('notes') || '',
            callNotes: [],
            devices: [],
            appointments: [],
            sgkStatus: 'not_applied',
            sgkReportDate: null,
            sgkDeviceRight: null,
            sgkBatteryRight: null,
            sgkValidityDate: null
        };

        // Save patient to localStorage for persistence
        this.savePatientToStorage(newPatient);
        
        this.patients.push(newPatient);
        this.applyFilters();
        
        // Hide modal
        document.getElementById('newPatientModal').classList.add('hidden');
        form.reset();

        // Show success message and redirect to patient details
        this.showNotification('Yeni hasta başarıyla eklendi!', 'success');
        
        // Open patient details page
        setTimeout(() => {
            window.location.href = `patient-details.html?id=${newPatient.id}`;
        }, 1000);
    }

    getInitialLabel(acquisitionType) {
        const labelMap = {
            'tabela': 'Tabela Hastası',
            'sosyal_medya': 'Sosyal Medya',
            'tanitim': 'Tanıtım',
            'referans': 'Referans',
            'diger': 'Diğer'
        };
        return labelMap[acquisitionType] || 'Yeni Hasta';
    }

    savePatientToStorage(patient) {
        try {
            const existingPatients = JSON.parse(localStorage.getItem('patients') || '[]');
            existingPatients.push(patient);
            localStorage.setItem('patients', JSON.stringify(existingPatients));
        } catch (error) {
            console.error('Error saving patient to storage:', error);
        }
    }

    updatePatientLabel(patientId, newLabel) {
        const patient = this.patients.find(p => p.id === patientId);
        if (patient) {
            patient.currentLabel = newLabel;
            patient.updatedAt = new Date().toISOString();
            this.savePatientToStorage(patient);
            this.renderPatients();
        }
    }

    addCallNote(patientId, note) {
        const patient = this.patients.find(p => p.id === patientId);
        if (patient) {
            const callNote = {
                id: Utils.generateId(),
                content: note,
                timestamp: new Date().toISOString(),
                author: 'Current User' // This should be replaced with actual user info
            };
            patient.callNotes.push(callNote);
            patient.updatedAt = new Date().toISOString();
            this.savePatientToStorage(patient);
        }
    }

    bulkAddTag() {
        if (this.selectedPatients.size === 0) return;
        this.showNotification(`${this.selectedPatients.size} hastaya etiket ekleme özelliği yakında!`, 'info');
    }

    bulkSendSMS() {
        if (this.selectedPatients.size === 0) return;
        this.showNotification(`${this.selectedPatients.size} hastaya SMS gönderme özelliği yakında!`, 'info');
    }

    exportSelected() {
        if (this.selectedPatients.size === 0) {
            this.showNotification('Lütfen dışa aktarmak için hasta seçin', 'warning');
            return;
        }

        const selectedPatientsData = this.patients.filter(p => this.selectedPatients.has(p.id));
        this.exportToCSV(selectedPatientsData, 'secili_hastalar');
    }

    exportAllPatients() {
        this.exportToCSV(this.filteredPatients, 'tum_hastalar');
    }

    exportToCSV(patients, filename) {
        const headers = ['Ad Soyad', 'TC Kimlik', 'Telefon', 'E-posta', 'Doğum Tarihi', 'Adres', 'Durum', 'Segment', 'Son Ziyaret', 'SGK Durumu'];
        
        const csvContent = [
            headers.join(','),
            ...patients.map(patient => [
                `"${patient.name}"`,
                `"${patient.tcNumber || ''}"`,
                `"${patient.phone}"`,
                `"${patient.email || ''}"`,
                `"${patient.birthDate || ''}"`,
                `"${patient.address || ''}"`,
                `"${patient.status}"`,
                `"${patient.segment}"`,
                `"${patient.lastVisit || ''}"`,
                `"${patient.sgkStatus || ''}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showNotification(`${patients.length} hasta CSV dosyasına aktarıldı`, 'success');
    }

    saveCurrentView() {
        const viewName = prompt('Görünüm adını girin:');
        if (!viewName) return;

        const savedViews = this.loadSavedViews();
        const newView = {
            id: 'custom_' + Date.now(),
            name: viewName,
            filters: { ...this.currentFilters },
            createdAt: new Date().toISOString()
        };

        savedViews.push(newView);
        this.saveSavedViews(savedViews);
        this.renderSavedViews();
        this.showNotification('Görünüm kaydedildi', 'success');
    }

    applySavedView(viewId) {
        const defaultViews = {
            'trial_no_purchase': { segment: 'trial', status: 'active' },
            'no_show': { status: 'inactive' },
            'high_priority': { segment: 'trial' },
            'new_leads': { segment: 'lead' }
        };

        let filters = defaultViews[viewId];
        
        if (!filters) {
            const savedViews = this.loadSavedViews();
            const savedView = savedViews.find(v => v.id === viewId);
            if (savedView) {
                filters = savedView.filters;
            }
        }

        if (filters) {
            // Reset all filters first
            this.currentFilters = {
                search: '',
                status: '',
                segment: '',
                branch: '',
                hearingTest: '',
                trial: '',
                priceGiven: ''
            };

            // Apply saved filters
            Object.assign(this.currentFilters, filters);

            // Update UI elements
            Object.keys(filters).forEach(key => {
                const element = document.getElementById(key + 'Filter') || document.getElementById('searchInput');
                if (element) {
                    element.value = filters[key] || '';
                }
            });

            this.applyFilters();
            this.showNotification('Görünüm uygulandı', 'success');
        }
    }

    deleteSavedView(viewId) {
        if (confirm('Bu görünümü silmek istediğinizden emin misiniz?')) {
            const savedViews = this.loadSavedViews();
            const filteredViews = savedViews.filter(v => v.id !== viewId);
            this.saveSavedViews(filteredViews);
            this.renderSavedViews();
            this.showNotification('Görünüm silindi', 'success');
        }
    }

    loadSavedViews() {
        try {
            const saved = localStorage.getItem('xear_saved_patient_views');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.warn('Failed to load saved views:', e);
            return [];
        }
    }

    saveSavedViews(views) {
        try {
            localStorage.setItem('xear_saved_patient_views', JSON.stringify(views));
        } catch (e) {
            console.warn('Failed to save views:', e);
        }
    }

    showNotification(message, type = 'info') {
        // Simple notification system
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Global functions for onclick handlers
function viewPatient(patientId) {
    window.location.href = `patient-details.html?id=${patientId}`;
}

function editPatient(patientId) {
    console.log('Edit patient:', patientId);
    // Implementation for edit functionality
}

// Export for global access
window.PatientManager = PatientManager;
console.log('PatientManager exported to window:', typeof window.PatientManager);
} // Close the if statement for PatientManager check