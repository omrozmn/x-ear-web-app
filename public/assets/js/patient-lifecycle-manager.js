// Patient Lifecycle Management System
// Handles patient creation, labeling, and workflow progression

class PatientLifecycleManager {
    constructor() {
        this.acquisitionTypes = this.loadAcquisitionTypes();
        this.patientLabels = this.loadPatientLabels();
        this.sgkValidityPeriods = {
            device: 5 * 365, // 5 years in days
            battery: 1 * 365  // 1 year in days
        };
    }

    // Load acquisition types from settings
    loadAcquisitionTypes() {
        const defaultTypes = [
            { id: 'tabela', label: 'Tabela', color: '#10B981' },
            { id: 'sosyal_medya', label: 'Sosyal Medya', color: '#3B82F6' },
            { id: 'tanitim', label: 'Tanıtım', color: '#8B5CF6' },
            { id: 'referans', label: 'Referans', color: '#F59E0B' },
            { id: 'web_site', label: 'Web Site', color: '#EF4444' },
            { id: 'diger', label: 'Diğer', color: '#6B7280' }
        ];
        
        return JSON.parse(localStorage.getItem('acquisitionTypes') || JSON.stringify(defaultTypes));
    }

    // Load patient labels/statuses
    loadPatientLabels() {
        const defaultLabels = [
            { id: 'potansiyel', label: 'Potansiyel Hasta', color: '#3B82F6', order: 1 },
            { id: 'aranacak', label: 'Aranacak', color: '#F59E0B', order: 2 },
            { id: 'randevu_verildi', label: 'Randevu Verildi', color: '#8B5CF6', order: 3 },
            { id: 'geldi', label: 'Geldi', color: '#10B981', order: 4 },
            { id: 'deneme_yapildi', label: 'Deneme Yapıldı', color: '#06B6D4', order: 5 },
            { id: 'satin_aldi', label: 'Satın Aldı', color: '#10B981', order: 6 },
            { id: 'kontrol_hastasi', label: 'Kontrol Hastası', color: '#059669', order: 7 },
            { id: 'iptal', label: 'İptal', color: '#EF4444', order: 8 }
        ];
        
        return JSON.parse(localStorage.getItem('patientLabels') || JSON.stringify(defaultLabels));
    }

    // Create new patient with acquisition type and initial label
    createPatient(patientData) {
        const patientId = this.generatePatientId();
        const currentDate = new Date().toISOString();
        
        const patient = {
            id: patientId,
            ...patientData,
            acquisitionType: patientData.acquisitionType || 'diger',
            currentLabel: this.determineInitialLabel(patientData.acquisitionType),
            createdAt: currentDate,
            updatedAt: currentDate,
            timeline: [{
                type: 'creation',
                title: 'Hasta Kaydı Oluşturuldu',
                description: `Hasta ${this.getAcquisitionTypeLabel(patientData.acquisitionType)} üzerinden eklendi`,
                date: currentDate,
                timestamp: Date.now()
            }],
            notes: [],
            appointments: [],
            devices: [],
            sgkInfo: {},
            contactHistory: []
        };

        // Save patient to localStorage
        this.savePatient(patient);
        
        // Add to patients list
        this.addToPatientsList(patient);
        
        return patient;
    }

    // Determine initial label based on acquisition type
    determineInitialLabel(acquisitionType) {
        switch(acquisitionType) {
            case 'tabela':
                return 'potansiyel'; // Tabela patients start as potential
            case 'sosyal_medya':
            case 'tanitim':
            case 'web_site':
                return 'aranacak'; // Digital leads need to be called
            default:
                return 'potansiyel';
        }
    }

    // Update patient label/status
    updatePatientLabel(patientId, newLabel, notes = '') {
        const patient = this.getPatient(patientId);
        if (!patient) return false;

        const oldLabel = patient.currentLabel;
        patient.currentLabel = newLabel;
        patient.updatedAt = new Date().toISOString();

        // Add to timeline
        patient.timeline.push({
            type: 'label_change',
            title: 'Durum Değişikliği',
            description: `${this.getPatientLabelText(oldLabel)} → ${this.getPatientLabelText(newLabel)}${notes ? ': ' + notes : ''}`,
            date: new Date().toISOString(),
            timestamp: Date.now()
        });

        // Handle special label transitions
        this.handleLabelTransition(patient, oldLabel, newLabel, notes);

        this.savePatient(patient);
        return true;
    }

    // Handle special actions when labels change
    handleLabelTransition(patient, oldLabel, newLabel, notes) {
        switch(newLabel) {
            case 'randevu_verildi':
                // Could automatically create an appointment
                this.suggestAppointmentCreation(patient);
                break;
            case 'kontrol_hastasi':
                // Validate required information for control patients
                this.validateControlPatientInfo(patient);
                break;
            case 'satin_aldi':
                // Initialize device management
                this.initializeDeviceManagement(patient);
                break;
        }
    }

    // Add note to patient
    addPatientNote(patientId, noteText, callType = 'general') {
        const patient = this.getPatient(patientId);
        if (!patient) return false;

        const note = {
            id: Date.now().toString(),
            text: noteText,
            type: callType,
            date: new Date().toISOString(),
            author: 'current_user' // Could be dynamic
        };

        patient.notes.push(note);
        
        // Add to timeline
        patient.timeline.push({
            type: 'note',
            title: 'Not Eklendi',
            description: noteText,
            date: new Date().toISOString(),
            timestamp: Date.now()
        });

        patient.updatedAt = new Date().toISOString();
        this.savePatient(patient);
        
        return note;
    }

    // Add device to patient
    addDeviceToPatient(patientId, deviceData) {
        const patient = this.getPatient(patientId);
        if (!patient) return { success: false, error: 'Hasta bulunamadı' };

        // Validate required patient information
        const validation = this.validatePatientForDevice(patient);
        if (!validation.valid) {
            return { success: false, error: validation.missingFields.join(', ') + ' bilgileri eksik' };
        }

        // Validate SGK information
        const sgkValidation = this.validateSGKInfo(patient);
        if (!sgkValidation.valid) {
            return { success: false, error: 'SGK bilgileri eksik veya geçersiz' };
        }

        const device = {
            id: Date.now().toString(),
            ...deviceData,
            addedDate: new Date().toISOString(),
            sgkInfo: {
                deviceValidUntil: this.calculateSGKValidity(patient.sgkInfo.lastDeviceDate),
                batteryValidUntil: this.calculateSGKValidity(patient.sgkInfo.lastBatteryDate, 'battery')
            }
        };

        patient.devices.push(device);
        
        // Add to timeline
        patient.timeline.push({
            type: 'device',
            title: 'Cihaz Eklendi',
            description: `${device.name} (${device.direction}) - ₺${device.price}`,
            date: new Date().toISOString(),
            timestamp: Date.now()
        });

        // Update patient label to control patient if not already
        if (patient.currentLabel !== 'kontrol_hastasi') {
            this.updatePatientLabel(patientId, 'kontrol_hastasi', 'Cihaz eklendi');
        }

        patient.updatedAt = new Date().toISOString();
        this.savePatient(patient);
        
        return { success: true, device: device };
    }

    // Validate patient has required info for device assignment
    validatePatientForDevice(patient) {
        const required = ['address', 'tcNo', 'phone'];
        const missing = required.filter(field => !patient[field] || patient[field].trim() === '');
        
        return {
            valid: missing.length === 0,
            missingFields: missing.map(field => {
                switch(field) {
                    case 'address': return 'Adres';
                    case 'tcNo': return 'TC Kimlik No';
                    case 'phone': return 'Telefon';
                    default: return field;
                }
            })
        };
    }

    // Validate SGK information
    validateSGKInfo(patient) {
        if (!patient.sgkInfo) return { valid: false };
        
        const required = ['lastDeviceDate', 'lastBatteryDate'];
        const hasRequired = required.every(field => patient.sgkInfo[field]);
        
        if (!hasRequired) return { valid: false };

        // Check if rights are still valid
        const deviceValid = this.isSGKValidityActive(patient.sgkInfo.lastDeviceDate);
        const batteryValid = this.isSGKValidityActive(patient.sgkInfo.lastBatteryDate, 'battery');

        return {
            valid: deviceValid && batteryValid,
            deviceExpired: !deviceValid,
            batteryExpired: !batteryValid
        };
    }

    // Calculate SGK validity date
    calculateSGKValidity(lastDate, type = 'device') {
        if (!lastDate) return null;
        
        const validityPeriod = this.sgkValidityPeriods[type];
        const date = new Date(lastDate);
        date.setDate(date.getDate() + validityPeriod);
        
        return date.toISOString();
    }

    // Check if SGK validity is still active
    isSGKValidityActive(lastDate, type = 'device') {
        if (!lastDate) return false;
        
        const validUntil = this.calculateSGKValidity(lastDate, type);
        return new Date(validUntil) > new Date();
    }

    // Update SGK information
    updateSGKInfo(patientId, sgkData) {
        const patient = this.getPatient(patientId);
        if (!patient) return false;

        patient.sgkInfo = {
            ...patient.sgkInfo,
            ...sgkData,
            updatedAt: new Date().toISOString()
        };

        // Add to timeline
        patient.timeline.push({
            type: 'sgk',
            title: 'SGK Bilgileri Güncellendi',
            description: 'SGK cihaz ve pil hakları güncellendi',
            date: new Date().toISOString(),
            timestamp: Date.now()
        });

        patient.updatedAt = new Date().toISOString();
        this.savePatient(patient);
        
        return true;
    }

    // Get patient by ID
    getPatient(patientId) {
        return JSON.parse(localStorage.getItem(`patient_${patientId}`) || 'null');
    }

    // Save patient to localStorage
    savePatient(patient) {
        localStorage.setItem(`patient_${patient.id}`, JSON.stringify(patient));
        
        // Update patients list
        this.updatePatientInList(patient);
    }

    // Generate unique patient ID
    generatePatientId() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `P${timestamp}${random}`;
    }

    // Get acquisition type label
    getAcquisitionTypeLabel(typeId) {
        const type = this.acquisitionTypes.find(t => t.id === typeId);
        return type ? type.label : 'Bilinmeyen';
    }

    // Get patient label text
    getPatientLabelText(labelId) {
        const label = this.patientLabels.find(l => l.id === labelId);
        return label ? label.label : 'Bilinmeyen';
    }

    // Add patient to main patients list
    addToPatientsList(patient) {
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        patients.push({
            id: patient.id,
            name: patient.name,
            surname: patient.surname,
            phone: patient.phone,
            email: patient.email,
            acquisitionType: patient.acquisitionType,
            currentLabel: patient.currentLabel,
            createdAt: patient.createdAt,
            updatedAt: patient.updatedAt
        });
        localStorage.setItem('patients', JSON.stringify(patients));
    }

    // Update patient in main list
    updatePatientInList(patient) {
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        const index = patients.findIndex(p => p.id === patient.id);
        
        if (index !== -1) {
            patients[index] = {
                id: patient.id,
                name: patient.name,
                surname: patient.surname,
                phone: patient.phone,
                email: patient.email,
                acquisitionType: patient.acquisitionType,
                currentLabel: patient.currentLabel,
                createdAt: patient.createdAt,
                updatedAt: patient.updatedAt
            };
            localStorage.setItem('patients', JSON.stringify(patients));
        }
    }

    // Placeholder methods for future implementation
    suggestAppointmentCreation(patient) {
        console.log('Suggest appointment creation for patient:', patient.id);
    }

    validateControlPatientInfo(patient) {
        console.log('Validate control patient info for:', patient.id);
    }

    initializeDeviceManagement(patient) {
        console.log('Initialize device management for:', patient.id);
    }
}

// Initialize the lifecycle manager
window.patientLifecycleManager = new PatientLifecycleManager();
