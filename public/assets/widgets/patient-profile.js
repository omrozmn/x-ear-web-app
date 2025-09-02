class PatientProfileWidget {
    constructor(containerId, patientData) {
        this.containerId = containerId;
        this.patientData = patientData;
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        // TC ve yaş bilgilerini uyumlu hale getir ve senkronize et
        const tcNumber = this.patientData.tc || this.patientData.tcNumber || '';
        // Her iki alanı da güncelle
        this.patientData.tc = tcNumber;
        this.patientData.tcNumber = tcNumber;
        
        const age = this.patientData.age || (this.patientData.birthDate ? Utils.calculateAge(this.patientData.birthDate) : '');
        
        // Telefon numarasını kontrol et
        const phone = this.patientData.phone || '';
        
        // Yaş bilgisini de patientData'ya kaydet
        if (age && !this.patientData.age) {
            this.patientData.age = age;
        }
        
        // Konsola bilgileri yazdır (debug için)
        console.log('PatientProfileWidget render:', {
            name: this.patientData.name,
            tc: this.patientData.tc,
            tcNumber: this.patientData.tcNumber,
            phone: this.patientData.phone,
            age: age
        });

        container.innerHTML = `
            <div class="card p-6 mb-6">
                <div class="flex items-start justify-between">
                    <div class="flex items-center space-x-6">
                        <div class="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold" id="patientAvatar">
                            ${this.getInitials(this.patientData.name)}
                        </div>
                        <div>
                            <h1 class="text-3xl font-bold text-gray-900" id="patientFullName">${this.patientData.name}</h1>
                            <div class="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                                <span id="patientTC">TC: ${tcNumber}</span>
                                <span id="patientPhone">Tel: ${phone}</span>
                                <span id="patientAge">Yaş: ${age}</span>
                            </div>
                            <div class="flex items-center space-x-3 mt-3">
                                <span class="status-badge ${this.getStatusClass(this.patientData.status)}" id="patientStatus">${this.patientData.status}</span>
                                <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800" id="patientSegment">${this.patientData.segment}</span>
                                <span class="status-badge ${this.getSGKStatusClass(this.patientData.sgkStatus)}" id="sgkStatus">${this.patientData.sgkStatus}</span>
                            </div>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-sm text-gray-600">Son Ziyaret</p>
                        <p class="text-lg font-semibold" id="lastVisit">${this.patientData.lastVisit}</p>
                        <div class="flex space-x-2 mt-2">
                            <button class="btn-secondary" onclick="editPatient()">
                                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                                </svg>
                                Düzenle
                            </button>
                            <button id="updateLabelButton" onclick="updatePatientLabel()" class="btn-sm btn-secondary">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.997 1.997 0 013 12V7a4 4 0 014-4z"></path>
                                </svg>
                                Etiket Güncelle
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }

    getStatusClass(status) {
        const statusClasses = {
            'Aktif': 'status-active',
            'Pasif': 'status-inactive',
            'Beklemede': 'status-pending'
        };
        return statusClasses[status] || 'status-active';
    }

    getSGKStatusClass(sgkStatus) {
        const sgkClasses = {
            'SGK Onaylı': 'status-active',
            'SGK Beklemede': 'status-pending',
            'SGK Reddedildi': 'status-inactive'
        };
        return sgkClasses[sgkStatus] || 'status-pending';
    }

    updatePatientData(newData) {
        console.log('PatientProfileWidget.updatePatientData called with:', newData);
        console.log('Previous data:', this.patientData);
        
        this.patientData = { ...this.patientData, ...newData };
        
        console.log('Updated data:', this.patientData);
        
        this.render();
        
        console.log('PatientProfileWidget render completed');
    }

    static createDefault(containerId) {
        const defaultData = {
            name: 'Ahmet Yılmaz',
            tcNumber: '12345678901',
            phone: '0532 123 4567',
            birthDate: '1975-01-01',
            status: 'Aktif',
            segment: 'Deneme',
            sgkStatus: 'SGK Onaylı',
            lastVisit: '15 Ocak 2024'
        };
        return new PatientProfileWidget(containerId, defaultData);
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PatientProfileWidget;
}