/**
 * Timeline Tab Module - Handles patient timeline functionality
 */

class TimelineTabManager {
    constructor() {
        this.events = [];
        this.currentPatientId = null;
    }

    // Initialize the timeline tab
    async initialize(patientId) {
        this.currentPatientId = patientId;
        await this.loadTimelineData();
        this.attachEventListeners();
    }

    // Load timeline data for the current patient
    async loadTimelineData() {
        const timelineContainer = document.getElementById('timelineEvents');
        if (!timelineContainer) return;

        try {
            // Get patient data
            const patient = window.patientDetailsManager?.currentPatient || {};
            
            // Collect all events with timestamps
            const events = [];
            
            // Add registration event
            if (patient.registrationDate) {
                events.push({
                    type: 'registration',
                    date: new Date(patient.registrationDate),
                    title: 'Hasta Kaydı',
                    description: `${patient.firstName} ${patient.lastName} sisteme kaydedildi.`,
                    icon: 'user-plus'
                });
            }

            // Add notes
            if (Array.isArray(patient.notes)) {
                patient.notes.forEach(note => {
                    if (note.date) {
                        events.push({
                            type: 'note',
                            date: new Date(note.date),
                            title: note.title || 'Not Eklendi',
                            description: note.content,
                            icon: 'clipboard',
                            noteType: note.type
                        });
                    }
                });
            }
            
            // Add appointments
            const appointments = window.patientDetailsManager?.appointments || [];
            appointments.forEach(appointment => {
                if (appointment.date) {
                    events.push({
                        type: 'appointment',
                        date: new Date(appointment.date),
                        title: `Randevu: ${appointment.type || 'Genel'}`,
                        description: appointment.notes || 'Randevu detayı belirtilmemiş.',
                        icon: 'calendar',
                        status: appointment.status || 'scheduled'
                    });
                }
            });
            
            // Add device trials
            const deviceTrials = window.patientDetailsManager?.deviceTrials || [];
            deviceTrials.forEach(trial => {
                if (trial.startDate) {
                    events.push({
                        type: 'device_trial',
                        date: new Date(trial.startDate),
                        title: 'Cihaz Denemesi Başladı',
                        description: `${trial.deviceName || 'Cihaz'} denemesi başladı.`,
                        icon: 'headphones',
                        trialId: trial.id
                    });
                }
                
                if (trial.endDate) {
                    events.push({
                        type: 'device_trial_end',
                        date: new Date(trial.endDate),
                        title: 'Cihaz Denemesi Tamamlandı',
                        description: `${trial.deviceName || 'Cihaz'} denemesi tamamlandı. ${trial.result || ''}`,
                        icon: 'check-circle',
                        trialId: trial.id
                    });
                }
            });
            
            // Add device assignments
            if (Array.isArray(patient.devices)) {
                patient.devices.forEach(device => {
                    if (device.assignmentDate) {
                        events.push({
                            type: 'device_assignment',
                            date: new Date(device.assignmentDate),
                            title: 'Cihaz Atandı',
                            description: `${device.manufacturer} ${device.model} ${device.direction || ''} cihazı atandı.`,
                            icon: 'headphones',
                            deviceId: device.id
                        });
                    }
                });
            }
            
            // Add payments
            const payments = window.patientDetailsManager?.payments || [];
            payments.forEach(payment => {
                if (payment.date) {
                    events.push({
                        type: 'payment',
                        date: new Date(payment.date),
                        title: 'Ödeme Alındı',
                        description: `${payment.amount} TL ödeme ${payment.method || 'nakit'} olarak alındı. ${payment.description || ''}`,
                        icon: 'credit-card',
                        paymentId: payment.id
                    });
                }
            });
            
            // Add documents
            const documents = window.patientDetailsManager?.documents || [];
            documents.forEach(doc => {
                if (doc.date) {
                    events.push({
                        type: 'document',
                        date: new Date(doc.date),
                        title: `Belge Yüklendi: ${doc.title || 'Belge'}`,
                        description: `${doc.type || 'Belge'} yüklendi. ${doc.notes || ''}`,
                        icon: 'file',
                        documentId: doc.id
                    });
                }
            });
            
            // Add SMS history
            if (Array.isArray(patient.smsHistory)) {
                patient.smsHistory.forEach(sms => {
                    if (sms.date) {
                        events.push({
                            type: 'sms',
                            date: new Date(sms.date),
                            title: 'SMS Gönderildi',
                            description: sms.message,
                            icon: 'message-square',
                            smsId: sms.id
                        });
                    }
                });
            }
            
            // Add SGK updates
            if (window.patientDetailsManager?.sgkInfo?.updatedAt) {
                events.push({
                    type: 'sgk_update',
                    date: new Date(window.patientDetailsManager.sgkInfo.updatedAt),
                    title: 'SGK Bilgileri Güncellendi',
                    description: `SGK bilgileri güncellendi. Durum: ${this.getSGKStatusText(window.patientDetailsManager.sgkInfo.status)}`,
                    icon: 'shield',
                });
            }
            
            // Sort events by date (newest first)
            events.sort((a, b) => b.date - a.date);
            
            // Render timeline
            this.renderTimeline(events);
            
        } catch (error) {
            console.error('Error loading timeline data:', error);
            timelineContainer.innerHTML = `
                <div class="text-center text-red-500 py-8">
                    <p>Zaman çizelgesi yüklenirken bir hata oluştu.</p>
                </div>
            `;
        }
    }

    // Render timeline events
    renderTimeline(events) {
        const timelineContainer = document.getElementById('timelineEvents');
        if (!timelineContainer) return;

        if (events.length === 0) {
            timelineContainer.innerHTML = `
                <div class="text-center text-gray-500 py-8">
                    <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <p class="text-lg font-medium">Henüz zaman çizelgesi verisi bulunmuyor</p>
                    <p class="mt-1">Hasta işlemleri gerçekleştikçe burada görünecektir.</p>
                </div>
            `;
            return;
        }

        const timelineHtml = events.map(event => `
            <div class="timeline-item flex items-start space-x-4 p-4 border-l-4 ${this.getColorClass(event.type)} bg-white rounded-lg shadow-sm">
                <div class="timeline-icon flex-shrink-0 w-10 h-10 ${this.getColorClass(event.type)} rounded-full flex items-center justify-center text-white">
                    <i class="${this.getIconClass(event.icon)} text-sm"></i>
                </div>
                <div class="timeline-content flex-grow">
                    <div class="flex items-center justify-between mb-1">
                        <h4 class="text-sm font-semibold text-gray-900">${event.title}</h4>
                        <span class="text-xs text-gray-500">${this.formatDate(event.date)}</span>
                    </div>
                    <p class="text-sm text-gray-700 mb-2">${event.description}</p>
                    <div class="flex items-center space-x-2">
                        <span class="text-xs bg-gray-100 px-2 py-1 rounded-full">${this.getEventTypeLabel(event.type)}</span>
                        <span class="text-xs text-gray-400">${this.formatTime(event.date)}</span>
                    </div>
                </div>
            </div>
        `).join('');

        timelineContainer.innerHTML = timelineHtml;
    }

    // Helper functions
    formatDate(date) {
        return date.toLocaleDateString('tr-TR', { 
            day: '2-digit', 
            month: 'long', 
            year: 'numeric' 
        });
    }

    formatTime(date) {
        return date.toLocaleTimeString('tr-TR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    getSGKStatusText(status) {
        switch (status) {
            case 'active': return 'Aktif';
            case 'pending': return 'Beklemede';
            case 'expired': return 'Süresi Dolmuş';
            case 'not_eligible': return 'Uygun Değil';
            default: return 'Belirtilmemiş';
        }
    }

    getIconClass(iconName) {
        const iconMap = {
            'user-plus': 'fas fa-user-plus',
            'clipboard': 'fas fa-clipboard',
            'calendar': 'fas fa-calendar-alt',
            'headphones': 'fas fa-headphones',
            'check-circle': 'fas fa-check-circle',
            'credit-card': 'fas fa-credit-card',
            'file': 'fas fa-file-alt',
            'message-square': 'fas fa-comment-alt',
            'shield': 'fas fa-shield-alt'
        };
        
        return iconMap[iconName] || 'fas fa-circle';
    }

    getColorClass(eventType) {
        const colorMap = {
            'registration': 'border-blue-500 bg-blue-500',
            'note': 'border-yellow-500 bg-yellow-500',
            'appointment': 'border-green-500 bg-green-500',
            'device_trial': 'border-purple-500 bg-purple-500',
            'device_trial_end': 'border-purple-700 bg-purple-700',
            'device_assignment': 'border-indigo-500 bg-indigo-500',
            'payment': 'border-green-600 bg-green-600',
            'document': 'border-gray-500 bg-gray-500',
            'sms': 'border-blue-400 bg-blue-400',
            'sgk_update': 'border-red-500 bg-red-500'
        };
        
        return colorMap[eventType] || 'border-gray-400 bg-gray-400';
    }

    getEventTypeLabel(eventType) {
        const labelMap = {
            'registration': 'Kayıt',
            'note': 'Not',
            'appointment': 'Randevu',
            'device_trial': 'Cihaz Denemesi',
            'device_trial_end': 'Deneme Sonu',
            'device_assignment': 'Cihaz Atama',
            'payment': 'Ödeme',
            'document': 'Belge',
            'sms': 'SMS',
            'sgk_update': 'SGK Güncelleme'
        };
        
        return labelMap[eventType] || 'Diğer';
    }

    // Add new timeline event
    addEvent(eventData) {
        // Implementation for adding new timeline events
        // This would be called when new actions are performed
    }

    // Attach event listeners
    attachEventListeners() {
        // Add event listeners for timeline interactions
        const addEventBtn = document.querySelector('[onclick="patientTimelineManager.addEvent()"]');
        if (addEventBtn) {
            addEventBtn.onclick = () => this.showAddEventModal();
        }
    }

    // Show add event modal
    showAddEventModal() {
        // Implementation for showing add event modal
        alert('Yeni olay ekleme özelliği yakında eklenecek');
    }
}

// Make it globally available
window.TimelineTabManager = TimelineTabManager;
