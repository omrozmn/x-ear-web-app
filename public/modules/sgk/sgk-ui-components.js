/**
 * SGK UI Components Module
 * Handles UI rendering and interactions for SGK page
 */

window.SGK = window.SGK || {};

window.SGK.UIComponents = class {
    constructor() {
        this.components = {};
    }

    initialize() {
        this.setupFileUpload();
        this.setupPatientSearch();
        this.setupResultsTable();
        console.log('✅ SGK UI Components initialized');
    }

    setupFileUpload() {
        // File upload UI setup
        const uploadArea = document.getElementById('uploadArea');
        if (uploadArea) {
            this.setupDragAndDrop(uploadArea);
        }
    }

    setupDragAndDrop(element) {
        element.addEventListener('dragover', (e) => {
            e.preventDefault();
            element.classList.add('drag-over');
        });

        element.addEventListener('dragleave', () => {
            element.classList.remove('drag-over');
        });

        element.addEventListener('drop', (e) => {
            e.preventDefault();
            element.classList.remove('drag-over');
            
            const files = Array.from(e.dataTransfer.files);
            if (files.length > 0) {
                this.handleFilesDrop(files);
            }
        });
    }

    handleFilesDrop(files) {
        const fileInput = document.getElementById('bulkOCRUpload');
        if (fileInput) {
            // Create a new FileList and trigger change event
            const dt = new DataTransfer();
            files.forEach(file => dt.items.add(file));
            fileInput.files = dt.files;
            fileInput.dispatchEvent(new Event('change'));
        }
    }

    setupPatientSearch() {
        const searchInput = document.getElementById('patientSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterPatients(e.target.value);
            });
        }
    }

    filterPatients(searchTerm) {
        // Filter patient list based on search term
        const patientElements = document.querySelectorAll('.patient-item');
        const term = searchTerm.toLowerCase();
        
        patientElements.forEach(element => {
            const patientName = element.textContent.toLowerCase();
            if (patientName.includes(term)) {
                element.style.display = 'block';
            } else {
                element.style.display = 'none';
            }
        });
    }

    setupResultsTable() {
        // Results table setup
        const resultsContainer = document.getElementById('resultsContainer');
        if (resultsContainer) {
            this.components.resultsTable = new SGKResultsTable(resultsContainer);
        }
    }

    showProgress(current, total, message = '') {
        const progressContainer = document.getElementById('uploadProgress');
        if (!progressContainer) return;

        const percentage = (current / total) * 100;
        
        progressContainer.innerHTML = `
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-blue-900">İşleme Durumu</span>
                    <span class="text-sm text-blue-700">${current}/${total}</span>
                </div>
                <div class="w-full bg-blue-200 rounded-full h-2">
                    <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" style="width: ${percentage}%"></div>
                </div>
                ${message ? `<p class="text-sm text-blue-700 mt-2">${message}</p>` : ''}
            </div>
        `;
        
        progressContainer.style.display = 'block';
    }

    hideProgress() {
        const progressContainer = document.getElementById('uploadProgress');
        if (progressContainer) {
            progressContainer.style.display = 'none';
        }
    }

    showError(message) {
        const errorContainer = document.getElementById('errorContainer');
        if (errorContainer) {
            errorContainer.innerHTML = `
                <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                            </svg>
                        </div>
                        <div class="ml-3">
                            <h3 class="text-sm font-medium text-red-800">Hata</h3>
                            <div class="mt-2 text-sm text-red-700">
                                <p>${message}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            errorContainer.style.display = 'block';
        }
    }

    clearError() {
        const errorContainer = document.getElementById('errorContainer');
        if (errorContainer) {
            errorContainer.style.display = 'none';
            errorContainer.innerHTML = '';
        }
    }
};

// SGK Results Table Component
class SGKResultsTable {
    constructor(container) {
        this.container = container;
        this.results = [];
    }

    render(results) {
        this.results = results;
        this.container.innerHTML = '';
        
        if (results.length === 0) {
            this.container.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    Henüz işlenmiş belge bulunmuyor.
                </div>
            `;
            return;
        }

        results.forEach(result => {
            const resultElement = this.createResultCard(result);
            this.container.appendChild(resultElement);
        });
    }

    createResultCard(result) {
        const div = document.createElement('div');
        div.className = 'bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4';
        
        const statusClass = result.status === 'auto_matched' ? 
            'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
            
        const statusText = result.status === 'auto_matched' ? 
            'Otomatik Eşleşti' : 'Manuel İnceleme';

        div.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <h3 class="text-lg font-semibold text-gray-900">${result.fileName}</h3>
                <span class="px-3 py-1 text-xs font-medium rounded-full ${statusClass}">
                    ${statusText}
                </span>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Tespit Edilen Hasta</label>
                    <p class="text-sm text-gray-900">${result.matchedPatient ? result.matchedPatient.name : 'Bulunamadı'}</p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Belge Türü</label>
                    <p class="text-sm text-gray-900">${result.documentType?.displayName || 'Bilinmeyen'}</p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">İşlenme Zamanı</label>
                    <p class="text-sm text-gray-900">${new Date(result.processingDate).toLocaleString('tr-TR')}</p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Güven Skoru</label>
                    <p class="text-sm text-gray-900">${result.patientMatchResult?.confidence ? Math.round(result.patientMatchResult.confidence * 100) + '%' : 'N/A'}</p>
                </div>
            </div>
            
            <div class="flex justify-end space-x-2">
                <button onclick="SGK.ui.viewDocument('${result.id}')" class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                    Görüntüle
                </button>
                <button onclick="SGK.ui.editResult('${result.id}')" class="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                    Düzenle
                </button>
            </div>
        `;
        
        return div;
    }

    viewDocument(resultId) {
        const result = this.results.find(r => r.id === resultId);
        if (result) {
            // Open document viewer
            console.log('Opening document viewer for:', result.fileName);
        }
    }

    editResult(resultId) {
        const result = this.results.find(r => r.id === resultId);
        if (result) {
            // Open result editor
            console.log('Opening result editor for:', result.fileName);
        }
    }
}

console.log('✅ SGK UI Components module loaded');
