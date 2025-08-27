// X-Ear CRM Application JavaScript

// Global state management
const AppState = {
  currentUser: null,
  currentPage: 'dashboard',
  patients: [],
  appointments: [],
  inventory: [],
  campaigns: [],
  notifications: [],
  clinicians: [],
  branches: [],
  filters: {},
  settings: {},
  kpis: {},
  patientFunnel: []
};

// Initialize app state with sample data
function initializeAppState() {
  if (typeof samplePatients !== 'undefined') {
    AppState.patients = [...samplePatients];
  }
  if (typeof sampleAppointments !== 'undefined') {
    AppState.appointments = [...sampleAppointments];
  }
  if (typeof sampleCampaigns !== 'undefined') {
    AppState.campaigns = [...sampleCampaigns];
  }
  if (typeof sampleInventory !== 'undefined') {
    AppState.inventory = [...sampleInventory];
  }
  if (typeof sampleNotifications !== 'undefined') {
    AppState.notifications = [...sampleNotifications];
  }
  if (typeof sampleClinicians !== 'undefined') {
    AppState.clinicians = [...sampleClinicians];
  }
  if (typeof sampleBranches !== 'undefined') {
    AppState.branches = [...sampleBranches];
  }
  if (typeof dashboardKPIs !== 'undefined') {
    AppState.kpis = {...dashboardKPIs};
  }
  if (typeof patientFunnel !== 'undefined') {
    AppState.patientFunnel = [...patientFunnel];
  }
  
  // Load from localStorage if available
  Storage.loadAppState();
}

// Utility functions
const Utils = {
  // Format date to Turkish locale
  formatDate(date, format = 'short') {
    const d = new Date(date);
    if (format === 'short') {
      return d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
    return d.toLocaleDateString('tr-TR', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  // Format currency to Turkish Lira
  formatCurrency(amount) {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  },

  // Generate unique ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  // Debounce function for search
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Show toast notification
  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'} text-white`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  },

  // Validate TC Identity Number
  validateTCNumber(tc) {
    if (!/^[1-9][0-9]{10}$/.test(tc)) return false;
    
    const digits = tc.split('').map(Number);
    const sum1 = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
    const sum2 = digits[1] + digits[3] + digits[5] + digits[7];
    
    return (sum1 * 7 - sum2) % 10 === digits[9] && 
           (digits.slice(0, 10).reduce((a, b) => a + b) % 10) === digits[10];
  }
};

// Local Storage Manager
const Storage = {
  save(key, data) {
    try {
      localStorage.setItem(`xear_${key}`, JSON.stringify(data));
    } catch (e) {
      console.error('Storage save error:', e);
    }
  },

  load(key) {
    try {
      const data = localStorage.getItem(`xear_${key}`);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Storage load error:', e);
      return null;
    }
  },

  remove(key) {
    localStorage.removeItem(`xear_${key}`);
  },
  
  saveAppState: function() {
    this.save('patients', AppState.patients);
    this.save('appointments', AppState.appointments);
    this.save('campaigns', AppState.campaigns);
    this.save('inventory', AppState.inventory);
    this.save('notifications', AppState.notifications);
    this.save('settings', AppState.settings);
  },
  
  loadAppState: function() {
    const savedPatients = this.load('patients');
    const savedAppointments = this.load('appointments');
    const savedCampaigns = this.load('campaigns');
    const savedInventory = this.load('inventory');
    const savedNotifications = this.load('notifications');
    const savedSettings = this.load('settings');
    
    if (savedPatients) AppState.patients = savedPatients;
    if (savedAppointments) AppState.appointments = savedAppointments;
    if (savedCampaigns) AppState.campaigns = savedCampaigns;
    if (savedInventory) AppState.inventory = savedInventory;
    if (savedNotifications) AppState.notifications = savedNotifications;
    if (savedSettings) AppState.settings = savedSettings;
  }
};

// Patient Management
const PatientManager = {
  // Get all patients with optional filtering
  getPatients(filters = {}) {
    let patients = AppState.patients;
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      patients = patients.filter(p => 
        p.name.toLowerCase().includes(search) ||
        p.tcNumber.includes(search) ||
        p.phone.includes(search)
      );
    }
    
    if (filters.status) {
      patients = patients.filter(p => p.status === filters.status);
    }
    
    if (filters.segment) {
      patients = patients.filter(p => p.segment === filters.segment);
    }
    
    return patients;
  },

  // Add new patient
  addPatient(patientData) {
    const patient = {
      id: Utils.generateId(),
      ...patientData,
      status: patientData.status || 'active',
      segment: patientData.segment || 'new',
      devices: patientData.devices || [],
      notes: patientData.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    AppState.patients.push(patient);
    Storage.saveAppState();
    return patient;
  },

  // Update patient
  updatePatient(id, updates) {
    const index = AppState.patients.findIndex(p => p.id === id);
    if (index !== -1) {
      AppState.patients[index] = {
        ...AppState.patients[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      Storage.saveAppState();
      return AppState.patients[index];
    }
    return null;
  },

  // Delete patient
  deletePatient(id) {
    const index = AppState.patients.findIndex(p => p.id === id);
    if (index !== -1) {
      AppState.patients.splice(index, 1);
      Storage.saveAppState();
      return true;
    }
    return false;
  },

  // Get patient by ID
  getPatient(id) {
    return AppState.patients.find(p => p.id === id);
  },
  
  // Validate TC Number
  validateTCNumber(tcNumber) {
    if (!tcNumber || tcNumber.length !== 11) return false;
    if (!/^\d{11}$/.test(tcNumber)) return false;
    
    const digits = tcNumber.split('').map(Number);
    const sum1 = (digits[0] + digits[2] + digits[4] + digits[6] + digits[8]) * 7;
    const sum2 = digits[1] + digits[3] + digits[5] + digits[7] + digits[9];
    const check1 = (sum1 - sum2) % 10;
    const check2 = (digits[0] + digits[1] + digits[2] + digits[3] + digits[4] + digits[5] + digits[6] + digits[7] + digits[8] + digits[9]) % 10;
    
    return check1 === digits[9] && check2 === digits[10];
  },
  
  // Check if TC Number is unique
  isUniqueTCNumber(tcNumber, excludeId = null) {
    return !AppState.patients.some(p => p.tcNumber === tcNumber && p.id !== excludeId);
  },
  
  // Add device to patient
  addDevice(patientId, device) {
    const patient = this.getPatient(patientId);
    if (patient) {
      device.id = Utils.generateId();
      device.addedAt = new Date().toISOString();
      patient.devices.push(device);
      this.updatePatient(patientId, { devices: patient.devices });
      return device;
    }
    return null;
  },
  
  // Update device
  updateDevice(patientId, deviceId, updates) {
    const patient = this.getPatient(patientId);
    if (patient) {
      const deviceIndex = patient.devices.findIndex(d => d.id === deviceId);
      if (deviceIndex !== -1) {
        patient.devices[deviceIndex] = { ...patient.devices[deviceIndex], ...updates };
        this.updatePatient(patientId, { devices: patient.devices });
        return patient.devices[deviceIndex];
      }
    }
    return null;
  }
};

// Appointment Management
const AppointmentManager = {
  // Get appointments with filtering
  getAppointments(filters = {}) {
    let appointments = AppState.appointments;
    
    if (filters.date) {
      appointments = appointments.filter(a => 
        a.date.startsWith(filters.date)
      );
    }
    
    if (filters.status) {
      appointments = appointments.filter(a => a.status === filters.status);
    }
    
    if (filters.clinician) {
      appointments = appointments.filter(a => a.clinician === filters.clinician);
    }
    
    return appointments;
  },

  // Add appointment
  addAppointment(appointmentData) {
    const appointment = {
      id: Utils.generateId(),
      ...appointmentData,
      status: appointmentData.status || 'scheduled',
      createdAt: new Date().toISOString()
    };
    
    AppState.appointments.push(appointment);
    Storage.saveAppState();
    return appointment;
  },

  // Update appointment
  updateAppointment(id, updates) {
    const index = AppState.appointments.findIndex(a => a.id === id);
    if (index !== -1) {
      AppState.appointments[index] = {
        ...AppState.appointments[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      Storage.saveAppState();
      return AppState.appointments[index];
    }
    return null;
  },

  // Update appointment status
  updateAppointmentStatus(id, status, notes = '') {
    return this.updateAppointment(id, { status, notes });
  },

  // Delete appointment
  deleteAppointment(id) {
    const index = AppState.appointments.findIndex(a => a.id === id);
    if (index !== -1) {
      const deletedAppointment = AppState.appointments.splice(index, 1)[0];
      Storage.saveAppState();
      return deletedAppointment;
    }
    return null;
  },
  
  // Get appointment by ID
  getAppointment(id) {
    return AppState.appointments.find(a => a.id === id);
  },
  
  // Get appointments by patient ID
  getAppointmentsByPatient(patientId) {
    return AppState.appointments.filter(a => a.patientId === patientId);
  },
  
  // Get upcoming appointments
  getUpcomingAppointments(limit = 10) {
    const now = new Date();
    return AppState.appointments
      .filter(a => new Date(a.date + ' ' + a.time) > now && a.status === 'scheduled')
      .sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time))
      .slice(0, limit);
  },
  
  // Get appointments by date range
  getAppointmentsByDateRange(startDate, endDate) {
    return AppState.appointments.filter(a => {
      const appointmentDate = new Date(a.date);
      return appointmentDate >= startDate && appointmentDate <= endDate;
    });
  },
  
  // Check for no-shows
  checkForNoShows() {
    const now = new Date();
    const noShows = AppState.appointments.filter(a => {
      const appointmentDateTime = new Date(a.date + ' ' + a.time);
      const timeDiff = now - appointmentDateTime;
      return a.status === 'scheduled' && timeDiff > 30 * 60 * 1000; // 30 minutes past
    });
    
    noShows.forEach(appointment => {
      this.updateAppointmentStatus(appointment.id, 'no_show');
    });
    
    return noShows;
  }
};

// SMS Campaign Manager
const CampaignManager = {
  // Get all campaigns
  getCampaigns() {
    return AppState.campaigns;
  },
  
  // Add campaign
  addCampaign(campaignData) {
    const campaign = {
      id: Utils.generateId(),
      ...campaignData,
      status: campaignData.status || 'draft',
      responses: campaignData.responses || { delivered: 0, opened: 0, clicked: 0, replied: 0 },
      createdAt: new Date().toISOString()
    };
    
    AppState.campaigns.push(campaign);
    Storage.saveAppState();
    return campaign;
  },
  
  // Update campaign
  updateCampaign(id, updates) {
    const index = AppState.campaigns.findIndex(c => c.id === id);
    if (index !== -1) {
      AppState.campaigns[index] = {
        ...AppState.campaigns[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      Storage.saveAppState();
      return AppState.campaigns[index];
    }
    return null;
  },
  
  // Delete campaign
  deleteCampaign(id) {
    const index = AppState.campaigns.findIndex(c => c.id === id);
    if (index !== -1) {
      AppState.campaigns.splice(index, 1);
      Storage.saveAppState();
      return true;
    }
    return false;
  },
  
  // Launch campaign
  launchCampaign(id) {
    const campaign = this.updateCampaign(id, { status: 'active', sentAt: new Date().toISOString() });
    if (campaign) {
      this.sendSMS(campaign.recipients, campaign.message);
    }
    return campaign;
  },

  // Send SMS campaign
  sendCampaign(campaignData) {
    const campaign = {
      id: Utils.generateId(),
      ...campaignData,
      status: 'sent',
      sentAt: new Date().toISOString(),
      recipients: campaignData.recipients.length
    };
    
    AppState.campaigns.push(campaign);
    Storage.saveAppState();
    
    // Simulate SMS sending
    Utils.showToast(`SMS kampanyası ${campaign.recipients} kişiye gönderildi`, 'success');
    return campaign;
  },
  
  // Send SMS
  sendSMS(recipients, message) {
    // Simulate SMS sending
    console.log('Sending SMS to:', recipients);
    console.log('Message:', message);
    
    // In a real app, this would integrate with an SMS service
    return {
      success: true,
      sentCount: recipients.length,
      message: 'SMS gönderildi'
    };
  },
  
  // Get recipient groups
  getRecipientGroups() {
    const groups = {
      all: AppState.patients,
      active: AppState.patients.filter(p => p.status === 'active'),
      trial: AppState.patients.filter(p => p.segment === 'trial'),
      purchased: AppState.patients.filter(p => p.segment === 'purchased'),
      inactive: AppState.patients.filter(p => p.status === 'inactive')
    };
    return groups;
  },

  // Get campaign templates
  getTemplates() {
    return [
      {
        id: 'no_show',
        name: 'Randevu Kaçırma',
        message: 'Merhaba {name}, bugünkü randevunuzu kaçırdınız. Yeni randevu için lütfen bizi arayın.'
      },
      {
        id: 'trial_followup',
        name: 'Deneme Takibi',
        message: 'Merhaba {name}, cihaz deneme süreciniz nasıl gidiyor? Sorularınız için bizi arayabilirsiniz.'
      },
      {
        id: 'battery_reminder',
        name: 'Pil Hatırlatması',
        message: 'Merhaba {name}, cihazınızın pil değişim zamanı yaklaştı. Randevu için bizi arayın.'
      }
    ];
  }
};

// UI Components
const UI = {
  // Show modal
  showModal(content, title = '') {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content p-6">
        ${title ? `<h3 class="text-lg font-semibold mb-4">${title}</h3>` : ''}
        <div class="modal-body">${content}</div>
        <div class="flex justify-end mt-6 space-x-3">
          <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">İptal</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    return modal;
  },

  // Show confirmation dialog
  showConfirm(message, onConfirm) {
    const modal = this.showModal(`
      <p class="mb-4">${message}</p>
      <div class="flex justify-end space-x-3">
        <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">İptal</button>
        <button class="btn-primary" onclick="(${onConfirm})(); this.closest('.modal-overlay').remove()">Onayla</button>
      </div>
    `, 'Onay');
    return modal;
  },

  // Render patient card
  renderPatientCard(patient) {
    return `
      <div class="card p-4 hover:shadow-md transition-shadow cursor-pointer" onclick="window.location.href='patient-details.html?id=${patient.id}'">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-gray-900">${patient.name}</h3>
          <span class="status-badge status-${patient.status}">${patient.status}</span>
        </div>
        <div class="text-sm text-gray-600 space-y-1">
          <p><strong>TC:</strong> ${patient.tcNumber}</p>
          <p><strong>Telefon:</strong> ${patient.phone}</p>
          <p><strong>Son Ziyaret:</strong> ${Utils.formatDate(patient.lastVisit)}</p>
        </div>
      </div>
    `;
  },

  // Render appointment card
  renderAppointmentCard(appointment) {
    const patient = PatientManager.getPatient(appointment.patientId);
    return `
      <div class="card p-4 border-l-4 border-blue-500">
        <div class="flex items-center justify-between mb-2">
          <h4 class="font-semibold">${patient ? patient.name : 'Bilinmeyen Hasta'}</h4>
          <span class="status-badge status-${appointment.status}">${appointment.status}</span>
        </div>
        <div class="text-sm text-gray-600">
          <p><strong>Saat:</strong> ${appointment.time}</p>
          <p><strong>Klinisyen:</strong> ${appointment.clinician}</p>
          <p><strong>Tür:</strong> ${appointment.type}</p>
        </div>
      </div>
    `;
  }
};

// Inventory Manager
const InventoryManager = {
  getAll() {
    return AppState.inventory;
  },
  
  add(item) {
    item.id = Utils.generateId();
    item.createdAt = new Date().toISOString();
    item.lastUpdated = new Date().toISOString();
    item.available = item.inStock - (item.reserved || 0);
    AppState.inventory.push(item);
    Storage.saveAppState();
    return item;
  },
  
  update(id, updates) {
    const index = AppState.inventory.findIndex(i => i.id === id);
    if (index !== -1) {
      AppState.inventory[index] = {
        ...AppState.inventory[index],
        ...updates,
        lastUpdated: new Date().toISOString()
      };
      AppState.inventory[index].available = AppState.inventory[index].inStock - (AppState.inventory[index].reserved || 0);
      Storage.saveAppState();
      return AppState.inventory[index];
    }
    return null;
  },
  
  delete(id) {
    const index = AppState.inventory.findIndex(i => i.id === id);
    if (index !== -1) {
      AppState.inventory.splice(index, 1);
      Storage.saveAppState();
      return true;
    }
    return false;
  },
  
  updateStock(id, quantity, reason) {
    const item = AppState.inventory.find(i => i.id === id);
    if (item) {
      item.inStock = Math.max(0, item.inStock + quantity);
      item.available = item.inStock - (item.reserved || 0);
      item.lastUpdated = new Date().toISOString();
      Storage.saveAppState();
      return item;
    }
    return null;
  },
  
  reserveItem(id, quantity) {
    const item = AppState.inventory.find(i => i.id === id);
    if (item && item.available >= quantity) {
      item.reserved = (item.reserved || 0) + quantity;
      item.available = item.inStock - item.reserved;
      Storage.saveAppState();
      return true;
    }
    return false;
  },
  
  assignToPatient(itemId, patientId, serialNumber, ear) {
    const item = AppState.inventory.find(i => i.id === itemId);
    const patient = PatientManager.getPatient(patientId);
    
    if (item && patient && item.available > 0) {
      const device = {
        brand: item.brand,
        model: item.model,
        serialNumber: serialNumber,
        ear: ear,
        status: 'trial',
        trialStartDate: new Date().toISOString().split('T')[0],
        trialEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
      
      PatientManager.addDevice(patientId, device);
      this.reserveItem(itemId, 1);
      return device;
    }
    return null;
  }
};

// Notification Manager
const NotificationManager = {
  add(notification) {
    notification.id = Utils.generateId();
    notification.timestamp = new Date().toISOString();
    notification.read = false;
    AppState.notifications.unshift(notification);
    Storage.saveAppState();
    return notification;
  },
  
  markAsRead(id) {
    const notification = AppState.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      Storage.saveAppState();
    }
  },
  
  getUnread() {
    return AppState.notifications.filter(n => !n.read);
  }
};

// Initialize application
function initApp() {
  // Initialize app state with sample data
  initializeAppState();
  
  // Set current page based on URL
  const path = window.location.pathname;
  AppState.currentPage = path.split('/').pop().replace('.html', '') || 'dashboard';
  
  // Initialize page-specific functionality
  if (typeof initPage === 'function') {
    initPage();
  }
  
  // Setup global event listeners
  setupGlobalEvents();
}

// Setup global event listeners
function setupGlobalEvents() {
  // Search functionality
  const searchInputs = document.querySelectorAll('[data-search]');
  searchInputs.forEach(input => {
    input.addEventListener('input', Utils.debounce((e) => {
      const searchTerm = e.target.value;
      const searchType = e.target.dataset.search;
      handleSearch(searchType, searchTerm);
    }, 300));
  });
  
  // Mobile menu toggle
  const menuToggle = document.querySelector('[data-menu-toggle]');
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      const sidebar = document.querySelector('.sidebar-nav');
      sidebar.classList.toggle('open');
    });
  }
}

// Handle search functionality
function handleSearch(type, term) {
  AppState.filters[type] = term;
  
  // Trigger page refresh with new filters
  if (typeof refreshPageData === 'function') {
    refreshPageData();
  }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Export for global access
window.AppState = AppState;
window.Utils = Utils;
window.PatientManager = PatientManager;
window.AppointmentManager = AppointmentManager;
window.CampaignManager = CampaignManager;
window.InventoryManager = InventoryManager;
window.NotificationManager = NotificationManager;
window.UI = UI;
window.Storage = Storage;
window.initializeAppState = initializeAppState;