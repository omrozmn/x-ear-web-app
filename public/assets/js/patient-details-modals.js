// Patient Details Modal Functions
// This file contains all modal-related JavaScript functions for patient details
// Extracted from patient-details.html to resolve JSX interpretation issues

// TC Number validation function
function validateTcNumber(input) {
    const tcNumber = input.value.trim();
    const errorElement = document.getElementById('tcEditError');
    
    if (tcNumber && !Utils.validateTCKN(tcNumber)) {
        input.classList.add('border-red-500');
        errorElement.classList.remove('hidden');
        return false;
    } else {
        input.classList.remove('border-red-500');
        errorElement.classList.add('hidden');
        return true;
    }
}

// Phone number validation function
function validatePhoneNumber(input) {
    const phone = input.value.trim();
    const errorElement = document.getElementById('phoneEditError');
    
    if (phone && !Utils.validatePhone(phone)) {
        input.classList.add('border-red-500');
        errorElement.classList.remove('hidden');
        return false;
    } else {
        input.classList.remove('border-red-500');
        errorElement.classList.add('hidden');
        return true;
    }
}

// Update patient label function
function updatePatientLabel() {
    console.log('🔄 updatePatientLabel called');
    
    // Get the current patient data
    const patient = window.patientDetailsManager?.currentPatient || {};
    console.log('Current patient:', patient);
    
    // Define available labels and their descriptions
    const labelOptions = [
        { value: 'Potansiyel Müşteri', description: 'İlk iletişim aşamasında' },
        { value: 'İletişim Kuruldu', description: 'Telefon görüşmesi yapıldı' },
        { value: 'Randevu Verildi', description: 'Merkez ziyareti planlandı' },
        { value: 'Merkez Ziyareti', description: 'Merkezde değerlendirme yapıldı' },
        { value: 'İşitme Testi Yapıldı', description: 'Audiometri testi tamamlandı' },
        { value: 'Cihaz Denemesi', description: 'Deneme cihazı verildi' },
        { value: 'Teklif Verildi', description: 'Fiyat teklifi sunuldu' },
        { value: 'Pazarlık', description: 'Fiyat müzakeresi yapılıyor' },
        { value: 'Satın Aldı', description: 'Cihaz satışı tamamlandı' },
        { value: 'Kontrol Hastası', description: 'Düzenli kontrol aşamasında' },
        { value: 'Takip', description: 'Memnuniyet takibi yapılıyor' },
        { value: 'Kaybedildi', description: 'Satış gerçekleşmedi' }
    ];
    
    console.log('Available labels:', labelOptions);
    
    // Check if Utils.showModal exists
    if (!window.Utils || !window.Utils.showModal) {
        console.error('❌ Utils.showModal not available');
        alert('Utils.showModal not available. Please check the page dependencies.');
        return;
    }
    
    console.log('✅ Utils.showModal available');
    
    // Create modal content
    const modalContent = `
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">Mevcut Etiket</label>
                <div class="p-3 bg-gray-50 rounded-md border">
                    <span class="text-gray-900 font-medium">${patient.currentLabel || patient.conversionStep || 'Belirtilmemiş'}</span>
                </div>
            </div>
            <div>
                <label for="newLabel" class="block text-sm font-medium text-gray-700 mb-3">Yeni Etiket Seçin</label>
                <div class="space-y-2 max-h-64 overflow-y-auto">
                    ${labelOptions.map(option => `
                        <label class="flex items-start p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                            <input type="radio" name="newLabel" value="${option.value}" class="mt-1 mr-3" ${(patient.currentLabel || patient.conversionStep) === option.value ? 'checked' : ''} />
                            <div>
                                <div class="font-medium text-gray-900">${option.value}</div>
                                <div class="text-sm text-gray-500">${option.description}</div>
                            </div>
                        </label>
                    `).join('')}
                </div>
            </div>
            <div>
                <label for="labelNotes" class="block text-sm font-medium text-gray-700">Notlar (Opsiyonel)</label>
                <textarea id="labelNotes" rows="2" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" placeholder="Etiket değişikliği ile ilgili notlar..."></textarea>
            </div>
        </div>
    `;
    
    console.log('Generated modal content:', modalContent.substring(0, 200) + '...');
    
    // Show modal
    console.log('📋 Calling Utils.showModal...');
    try {
        Utils.showModal({
            title: 'Hasta Etiketi Güncelle',
            content: modalContent,
            primaryButton: {
                text: 'Güncelle',
                onClick: () => {
                    console.log('🔘 Update button clicked');
                    
                    // Get selected label
                    const selectedLabel = document.querySelector('input[name="newLabel"]:checked');
                    const labelNotes = document.getElementById('labelNotes').value;
                    
                    console.log('Selected label:', selectedLabel?.value);
                    console.log('Label notes:', labelNotes);
                    
                    if (!selectedLabel) {
                        console.log('❌ No label selected');
                        Utils.showToast('Lütfen bir etiket seçin', 'error');
                        return false; // Prevent modal from closing
                    }
                    
                    const newLabel = selectedLabel.value;
                    const previousLabel = patient.currentLabel || patient.conversionStep || 'Belirtilmemiş';
                    
                    console.log('Updating label from', previousLabel, 'to', newLabel);
                    
                    // Update patient data
                    if (window.patientDetailsManager) {
                        window.patientDetailsManager.currentPatient.currentLabel = newLabel;
                        window.patientDetailsManager.currentPatient.conversionStep = newLabel.toLowerCase().replace(/\s+/g, '_');
                        window.patientDetailsManager.currentPatient.labelUpdatedAt = new Date().toISOString();
                        
                        // Add label change to patient notes if notes provided or label changed
                        if (labelNotes || previousLabel !== newLabel) {
                            if (!window.patientDetailsManager.currentPatient.notes) {
                                window.patientDetailsManager.currentPatient.notes = [];
                            }
                            
                            const labelChangeNote = {
                                id: 'note_label_' + Date.now(),
                                title: 'Etiket Güncellendi',
                                content: `Etiket "${previousLabel}" -> "${newLabel}" olarak güncellendi.${labelNotes ? ' Not: ' + labelNotes : ''}`,
                                type: 'other',
                                date: new Date().toISOString(),
                                createdBy: 'Sistem'
                            };
                            
                            window.patientDetailsManager.currentPatient.notes.unshift(labelChangeNote);
                        }
                        
                        console.log('💾 Saving patient data...');
                        
                        // Save changes
                        window.patientDetailsManager.savePatientToStorage();
                        
                        // Update all displays
                        updateAllPatientDisplays(window.patientDetailsManager.currentPatient);
                        
                        // Refresh notes if visible
                        if (typeof loadQuickNotes === 'function') {
                            loadQuickNotes();
                        }
                        
                        // Update timeline
                        if (typeof loadTimeline === 'function') {
                            loadTimeline();
                        }
                        
                        console.log('✅ Label update completed');
                        Utils.showToast(`Hasta etiketi "${newLabel}" olarak güncellendi`, 'success');
                    } else {
                        console.log('❌ patientDetailsManager not found');
                        Utils.showToast('Etiket güncellenemedi', 'error');
                    }
                    return true; // Allow modal to close
                }
            },
            secondaryButton: {
                text: 'İptal',
                onClick: () => {
                    console.log('❌ Update cancelled');
                }
            }
        });
        console.log('✅ Modal displayed successfully');
    } catch (error) {
        console.error('❌ Error showing modal:', error);
        alert('Modal hatası: ' + error.message);
    }
}

// Add appointment function
function addAppointment(patientId) {
    // Get the current patient data
    const patient = window.patientDetailsManager?.currentPatient || {};
    
    // Create modal content
    const modalContent = `
        <div class="space-y-4">
            <div>
                <label for="appointmentDate" class="block text-sm font-medium text-gray-700">Randevu Tarihi</label>
                <input type="date" id="appointmentDate" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" value="${new Date().toISOString().split('T')[0]}" />
            </div>
            <div>
                <label for="appointmentTime" class="block text-sm font-medium text-gray-700">Randevu Saati</label>
                <input type="time" id="appointmentTime" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" value="09:00" />
            </div>
            <div>
                <label for="appointmentType" class="block text-sm font-medium text-gray-700">Randevu Tipi</label>
                <select id="appointmentType" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary">
                    <option value="initial">İlk Görüşme</option>
                    <option value="follow-up">Kontrol</option>
                    <option value="device-trial">Cihaz Denemesi</option>
                    <option value="device-fitting">Cihaz Ayarı</option>
                    <option value="other">Diğer</option>
                </select>
            </div>
            <div>
                <label for="appointmentNotes" class="block text-sm font-medium text-gray-700">Randevu Notları</label>
                <textarea id="appointmentNotes" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" placeholder="Randevu ile ilgili notlar..."></textarea>
            </div>
        </div>
    `;
    
    // Show modal
    Utils.showModal({
        title: 'Yeni Randevu Ekle',
        content: modalContent,
        primaryButton: {
            text: 'Kaydet',
            onClick: () => {
                // Get form values
                const appointmentDate = document.getElementById('appointmentDate').value;
                const appointmentTime = document.getElementById('appointmentTime').value;
                const appointmentType = document.getElementById('appointmentType').value;
                const appointmentNotes = document.getElementById('appointmentNotes').value;
                
                if (!appointmentDate || !appointmentTime) {
                    Utils.showToast('Lütfen tarih ve saat alanlarını doldurun', 'error');
                    return;
                }
                
                // Create new appointment
                const newAppointment = {
                    id: 'app_' + Date.now(),
                    patientId: patientId || patient.id,
                    patientName: patient.name || patient.firstName + ' ' + patient.lastName,
                    date: appointmentDate,
                    time: appointmentTime,
                    type: appointmentType,
                    notes: appointmentNotes,
                    status: 'scheduled',
                    createdAt: new Date().toISOString()
                };
                
                // Save appointment to multiple data stores for consistency
                saveAppointmentToAllStores(newAppointment);
                
                // Add appointment to patient
                if (window.patientDetailsManager) {
                    // Initialize appointments array if it doesn't exist
                    if (!window.patientDetailsManager.appointments) {
                        window.patientDetailsManager.appointments = [];
                    }
                    
                    // Add new appointment
                    window.patientDetailsManager.appointments.push(newAppointment);
                    
                    // Update patient label if needed
                    if (patient.currentLabel !== 'Kontrol Hastası') {
                        window.patientDetailsManager.currentPatient.currentLabel = 'Randevu Verildi';
                        window.patientDetailsManager.savePatientToStorage();
                        window.patientDetailsManager.renderPatientProfile();
                        window.patientDetailsManager.renderGeneralTab();
                    }
                    
                    // Refresh appointments display
                    loadAppointments();
                    
                    Utils.showToast('Randevu başarıyla eklendi', 'success');
                } else {
                    Utils.showToast('Randevu eklenemedi', 'error');
                }
            }
        },
        secondaryButton: {
            text: 'İptal',
            onClick: () => {}
        }
    });
}

// Helper function to save appointment to all data stores
function saveAppointmentToAllStores(appointment) {
    try {
        // 1. Save to localStorage appointments
        let storedAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        storedAppointments.push(appointment);
        localStorage.setItem('appointments', JSON.stringify(storedAppointments));
        
        // 2. Save to global sample data if available
        if (window.sampleData && window.sampleData.appointments) {
            window.sampleData.appointments.push(appointment);
        }
        
        // 3. Add to any global appointments array if it exists
        if (typeof window.appointments !== 'undefined') {
            window.appointments.push(appointment);
        }
        
        console.log('Appointment saved to all stores:', appointment);
    } catch (error) {
        console.error('Error saving appointment to stores:', error);
    }
}

// Send SMS function
function sendSMS() {
    // Get the current patient data
    const patient = window.patientDetailsManager?.currentPatient || {};
    
    // Check if patient has a phone number
    if (!patient.phone) {
        Utils.showToast('Hastanın telefon numarası bulunamadı', 'error');
        return;
    }
    
    // Create modal content
    const modalContent = `
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700">Alıcı</label>
                <div class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 py-2 px-3">
                    ${patient.firstName} ${patient.lastName} (${formatPhoneNumber(patient.phone)})
                </div>
            </div>
            <div>
                <label for="smsTemplate" class="block text-sm font-medium text-gray-700">Şablon</label>
                <select id="smsTemplate" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary">
                    <option value="">Şablon seçin...</option>
                    <option value="appointment_reminder">Randevu Hatırlatma</option>
                    <option value="appointment_confirmation">Randevu Onayı</option>
                    <option value="birthday">Doğum Günü Kutlama</option>
                    <option value="follow_up">Kontrol Hatırlatma</option>
                    <option value="custom">Özel Mesaj</option>
                </select>
            </div>
            <div>
                <label for="smsMessage" class="block text-sm font-medium text-gray-700">Mesaj</label>
                <textarea id="smsMessage" rows="4" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" placeholder="Mesaj metni..."></textarea>
                <p class="mt-1 text-sm text-gray-500">Karakter sayısı: <span id="charCount">0</span>/160</p>
            </div>
        </div>
    `;
    
    // Show modal
    Utils.showModal({
        title: 'SMS Gönder',
        content: modalContent,
        primaryButton: {
            text: 'Gönder',
            onClick: () => {
                // Get form values
                const message = document.getElementById('smsMessage').value;
                
                if (!message) {
                    Utils.showToast('Lütfen bir mesaj girin', 'error');
                    return;
                }
                
                // In a real application, we would send the SMS through an API here
                // For this demo, we'll simulate a successful send
                
                // Create new SMS record
                const newSMS = {
                    id: 'sms_' + Date.now(),
                    patientId: patient.id,
                    patientName: `${patient.firstName} ${patient.lastName}`,
                    phoneNumber: patient.phone,
                    message: message,
                    sentAt: new Date().toISOString(),
                    status: 'sent'
                };
                
                // Add SMS to patient
                if (window.patientDetailsManager) {
                    // Initialize SMS array if it doesn't exist
                    if (!window.patientDetailsManager.smsHistory) {
                        window.patientDetailsManager.smsHistory = [];
                    }
                    
                    // Add new SMS
                    window.patientDetailsManager.smsHistory.push(newSMS);
                    window.patientDetailsManager.savePatientToStorage();
                    
                    // Update timeline
                    if (typeof loadTimeline === 'function') {
                        loadTimeline();
                    }
                    
                    Utils.showToast('SMS başarıyla gönderildi', 'success');
                } else {
                    Utils.showToast('SMS gönderilemedi', 'error');
                }
            }
        },
        secondaryButton: {
            text: 'İptal',
            onClick: () => {}
        }
    });
    
    // Add event listeners
    setTimeout(() => {
        const smsTemplate = document.getElementById('smsTemplate');
        const smsMessage = document.getElementById('smsMessage');
        const charCount = document.getElementById('charCount');
        
        if (smsTemplate && smsMessage && charCount) {
            // Template selection
            smsTemplate.addEventListener('change', function() {
                const template = this.value;
                let messageText = '';
                
                switch (template) {
                    case 'appointment_reminder':
                        messageText = `Sayın ${patient.firstName} ${patient.lastName}, yarınki randevunuzu hatırlatırız. Randevu saatiniz: 14:00. İşitme Merkezi`;
                        break;
                    case 'appointment_confirmation':
                        messageText = `Sayın ${patient.firstName} ${patient.lastName}, randevunuz onaylanmıştır. Tarih: ${new Date().toLocaleDateString('tr-TR')}, Saat: 14:00. İşitme Merkezi`;
                        break;
                    case 'birthday':
                        messageText = `Sayın ${patient.firstName} ${patient.lastName}, doğum gününüzü kutlar, sağlıklı ve mutlu bir yıl dileriz. İşitme Merkezi`;
                        break;
                    case 'follow_up':
                        messageText = `Sayın ${patient.firstName} ${patient.lastName}, kontrol zamanınız gelmiştir. Lütfen randevu almak için bizi arayınız. İşitme Merkezi`;
                        break;
                    default:
                        messageText = '';
                }
                
                smsMessage.value = messageText;
                charCount.textContent = messageText.length;
            });
            
            // Character count
            smsMessage.addEventListener('input', function() {
                charCount.textContent = this.value.length;
                if (this.value.length > 160) {
                    charCount.classList.add('text-red-500');
                } else {
                    charCount.classList.remove('text-red-500');
                }
            });
        }
    }, 100);
}

// Format phone number helper function
function formatPhoneNumber(phone) {
    if (!phone) return '';
    // Simple formatting for Turkish phone numbers
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11 && cleaned.startsWith('0')) {
        return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 9)} ${cleaned.slice(9)}`;
    }
    return phone;
}

// Make functions globally available
window.validateTcNumber = validateTcNumber;
window.validatePhoneNumber = validatePhoneNumber;
window.updatePatientLabel = updatePatientLabel;
window.addAppointment = addAppointment;
window.saveAppointmentToAllStores = saveAppointmentToAllStores;
window.sendSMS = sendSMS;
window.formatPhoneNumber = formatPhoneNumber;

console.log('Patient details modal functions loaded successfully');