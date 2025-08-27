// X-Ear CRM Sample Data

// Sample patients data
const samplePatients = [
  {
    id: 'p1',
    name: 'Ahmet Yılmaz',
    tcNumber: '12345678901',
    phone: '0532 123 4567',
    email: 'ahmet.yilmaz@email.com',
    birthDate: '1975-03-15',
    address: 'Kadıköy, İstanbul',
    status: 'active',
    segment: 'trial',
    lastVisit: '2024-01-15',
    createdAt: '2023-12-01T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    notes: 'Sol kulak işitme kaybı, deneme cihazı kullanıyor',
    devices: [
      {
        brand: 'Phonak',
        model: 'Audeo Paradise P90',
        serialNumber: 'PH123456',
        ear: 'left',
        status: 'trial',
        trialStartDate: '2024-01-10',
        trialEndDate: '2024-01-24'
      }
    ],
    appointments: ['a1', 'a2'],
    sgkStatus: 'approved',
    sgkReportDate: '2024-01-05'
  },
  {
    id: 'p2',
    name: 'Fatma Demir',
    tcNumber: '98765432109',
    phone: '0533 987 6543',
    email: 'fatma.demir@email.com',
    birthDate: '1968-07-22',
    address: 'Beşiktaş, İstanbul',
    status: 'active',
    segment: 'purchased',
    lastVisit: '2024-01-12',
    createdAt: '2023-11-15T09:00:00Z',
    updatedAt: '2024-01-12T11:15:00Z',
    notes: 'Bilateral işitme kaybı, cihaz satın aldı',
    devices: [
      {
        brand: 'Oticon',
        model: 'More 1',
        serialNumber: 'OT789012',
        ear: 'both',
        status: 'purchased',
        purchaseDate: '2023-12-20',
        warrantyEndDate: '2025-12-20'
      }
    ],
    appointments: ['a3'],
    sgkStatus: 'approved',
    sgkReportDate: '2023-11-10'
  },
  {
    id: 'p3',
    name: 'Mehmet Kaya',
    tcNumber: '11223344556',
    phone: '0534 111 2233',
    email: 'mehmet.kaya@email.com',
    birthDate: '1982-11-08',
    address: 'Şişli, İstanbul',
    status: 'pending',
    segment: 'lead',
    lastVisit: '2024-01-18',
    createdAt: '2024-01-18T16:00:00Z',
    updatedAt: '2024-01-18T16:00:00Z',
    notes: 'İlk değerlendirme yapıldı, test sonuçları bekleniyor',
    devices: [],
    appointments: ['a4'],
    sgkStatus: 'pending',
    sgkReportDate: null
  },
  {
    id: 'p4',
    name: 'Ayşe Özkan',
    tcNumber: '55667788990',
    phone: '0535 555 6677',
    email: 'ayse.ozkan@email.com',
    birthDate: '1955-04-30',
    address: 'Üsküdar, İstanbul',
    status: 'active',
    segment: 'follow_up',
    lastVisit: '2024-01-10',
    createdAt: '2023-10-01T08:00:00Z',
    updatedAt: '2024-01-10T10:45:00Z',
    notes: 'Yıllık kontrol, pil değişimi gerekli',
    devices: [
      {
        brand: 'Signia',
        model: 'Pure Charge&Go 7X',
        serialNumber: 'SG345678',
        ear: 'right',
        status: 'purchased',
        purchaseDate: '2023-02-15',
        warrantyEndDate: '2025-02-15'
      }
    ],
    appointments: ['a5'],
    sgkStatus: 'approved',
    sgkReportDate: '2023-01-20'
  }
];

// Sample appointments data
const sampleAppointments = [
  {
    id: 'a1',
    patientId: 'p1',
    date: '2024-01-24',
    time: '09:00',
    type: 'Deneme Sonu Değerlendirme',
    clinician: 'Dr. Elif Yıldız',
    status: 'scheduled',
    branch: 'Kadıköy',
    notes: 'Deneme cihazı geri alınacak, satış görüşmesi yapılacak',
    createdAt: '2024-01-15T14:30:00Z'
  },
  {
    id: 'a2',
    patientId: 'p1',
    date: '2024-01-10',
    time: '14:00',
    type: 'Cihaz Teslimi',
    clinician: 'Odyolog Murat Şen',
    status: 'completed',
    branch: 'Kadıköy',
    notes: 'Deneme cihazı teslim edildi, kullanım eğitimi verildi',
    createdAt: '2024-01-08T10:00:00Z'
  },
  {
    id: 'a3',
    patientId: 'p2',
    date: '2024-01-25',
    time: '11:00',
    type: 'Kontrol Muayenesi',
    clinician: 'Dr. Elif Yıldız',
    status: 'scheduled',
    branch: 'Beşiktaş',
    notes: '3 aylık kontrol muayenesi',
    createdAt: '2024-01-12T11:15:00Z'
  },
  {
    id: 'a4',
    patientId: 'p3',
    date: '2024-01-22',
    time: '15:30',
    type: 'Test Sonuçları',
    clinician: 'Odyolog Murat Şen',
    status: 'scheduled',
    branch: 'Şişli',
    notes: 'Odyometri test sonuçları değerlendirilecek',
    createdAt: '2024-01-18T16:00:00Z'
  },
  {
    id: 'a5',
    patientId: 'p4',
    date: '2024-01-20',
    time: '10:00',
    type: 'Pil Değişimi',
    clinician: 'Teknisyen Ali Vural',
    status: 'no_show',
    branch: 'Üsküdar',
    notes: 'Hasta randevuya gelmedi',
    createdAt: '2024-01-10T10:45:00Z'
  }
];

// Sample inventory data
const sampleInventory = [
  {
    id: 'inv1',
    brand: 'Phonak',
    model: 'Audeo Paradise P90',
    category: 'BTE',
    serialNumbers: ['PH123456', 'PH123457', 'PH123458'],
    inStock: 3,
    reserved: 1,
    available: 2,
    price: 15000,
    sgkPrice: 8500,
    features: ['Bluetooth', 'Şarj Edilebilir', 'Su Geçirmez'],
    lastUpdated: '2024-01-15T10:00:00Z'
  },
  {
    id: 'inv2',
    brand: 'Oticon',
    model: 'More 1',
    category: 'RIC',
    serialNumbers: ['OT789012', 'OT789013'],
    inStock: 2,
    reserved: 0,
    available: 2,
    price: 18000,
    sgkPrice: 9500,
    features: ['Yapay Zeka', 'Bluetooth', 'Tinnitus Desteği'],
    lastUpdated: '2024-01-12T14:30:00Z'
  },
  {
    id: 'inv3',
    brand: 'Signia',
    model: 'Pure Charge&Go 7X',
    category: 'RIC',
    serialNumbers: ['SG345678', 'SG345679', 'SG345680', 'SG345681'],
    inStock: 4,
    reserved: 1,
    available: 3,
    price: 16500,
    sgkPrice: 9000,
    features: ['Şarj Edilebilir', 'Bluetooth', 'Kendi Sesini Duyma'],
    lastUpdated: '2024-01-10T09:15:00Z'
  },
  {
    id: 'inv4',
    brand: 'Widex',
    model: 'Moment 440',
    category: 'BTE',
    serialNumbers: ['WX567890'],
    inStock: 1,
    reserved: 0,
    available: 1,
    price: 14000,
    sgkPrice: 8000,
    features: ['Doğal Ses', 'Bluetooth', 'Uzun Pil Ömrü'],
    lastUpdated: '2024-01-08T16:45:00Z'
  }
];

// Sample campaigns data
const sampleCampaigns = [
  {
    id: 'c1',
    name: 'Randevu Kaçırma Hatırlatması',
    type: 'no_show_recovery',
    message: 'Merhaba {name}, bugünkü randevunuzu kaçırdınız. Yeni randevu için lütfen 0212 123 4567 numarasını arayın.',
    recipients: 5,
    sentAt: '2024-01-20T16:00:00Z',
    status: 'sent',
    responses: 2,
    appointments: 1
  },
  {
    id: 'c2',
    name: 'Deneme Süreci Takibi',
    type: 'trial_followup',
    message: 'Merhaba {name}, cihaz deneme süreciniz nasıl gidiyor? Sorularınız için bizi arayabilirsiniz.',
    recipients: 8,
    sentAt: '2024-01-18T10:00:00Z',
    status: 'sent',
    responses: 5,
    appointments: 3
  },
  {
    id: 'c3',
    name: 'Yıllık Kontrol Hatırlatması',
    type: 'annual_checkup',
    message: 'Merhaba {name}, yıllık kontrol muayenenizin zamanı geldi. Randevu için lütfen bizi arayın.',
    recipients: 12,
    sentAt: '2024-01-15T14:00:00Z',
    status: 'sent',
    responses: 8,
    appointments: 6
  }
];

// Sample notifications data
const sampleNotifications = [
  {
    id: 'n1',
    type: 'appointment',
    title: 'Yaklaşan Randevu',
    message: 'Ahmet Yılmaz - 24 Ocak 09:00',
    timestamp: '2024-01-23T18:00:00Z',
    read: false,
    priority: 'high'
  },
  {
    id: 'n2',
    type: 'stock',
    title: 'Stok Uyarısı',
    message: 'Phonak Audeo Paradise P90 stoku azaldı (2 adet kaldı)',
    timestamp: '2024-01-22T10:30:00Z',
    read: false,
    priority: 'medium'
  },
  {
    id: 'n3',
    type: 'campaign',
    title: 'Kampanya Sonucu',
    message: 'Deneme Süreci Takibi kampanyasından 3 randevu alındı',
    timestamp: '2024-01-21T16:45:00Z',
    read: true,
    priority: 'low'
  },
  {
    id: 'n4',
    type: 'sgk',
    title: 'SGK Raporu Onaylandı',
    message: 'Mehmet Kaya için SGK raporu onaylandı',
    timestamp: '2024-01-20T14:20:00Z',
    read: true,
    priority: 'medium'
  }
];

// Sample clinicians data
const sampleClinicians = [
  {
    id: 'cl1',
    name: 'Dr. Elif Yıldız',
    title: 'Kulak Burun Boğaz Doktoru',
    branch: 'Kadıköy',
    phone: '0212 123 4567',
    email: 'elif.yildiz@xear.com',
    specialties: ['İşitme Kaybı Tanısı', 'Cihaz Uyumu']
  },
  {
    id: 'cl2',
    name: 'Odyolog Murat Şen',
    title: 'Odyolog',
    branch: 'Beşiktaş',
    phone: '0212 234 5678',
    email: 'murat.sen@xear.com',
    specialties: ['Odyometri', 'Cihaz Programlama']
  },
  {
    id: 'cl3',
    name: 'Teknisyen Ali Vural',
    title: 'Cihaz Teknisyeni',
    branch: 'Şişli',
    phone: '0212 345 6789',
    email: 'ali.vural@xear.com',
    specialties: ['Cihaz Bakımı', 'Teknik Destek']
  }
];

// Sample branches data
const sampleBranches = [
  {
    id: 'b1',
    name: 'Kadıköy Şubesi',
    address: 'Kadıköy Mah. Bahariye Cad. No:123 Kadıköy/İstanbul',
    phone: '0216 123 4567',
    manager: 'Dr. Elif Yıldız',
    openHours: '09:00-18:00',
    services: ['Tanı', 'Cihaz Satışı', 'Bakım']
  },
  {
    id: 'b2',
    name: 'Beşiktaş Şubesi',
    address: 'Beşiktaş Mah. Barbaros Bulvarı No:456 Beşiktaş/İstanbul',
    phone: '0212 234 5678',
    manager: 'Odyolog Murat Şen',
    openHours: '09:00-18:00',
    services: ['Tanı', 'Cihaz Satışı', 'Bakım']
  },
  {
    id: 'b3',
    name: 'Şişli Şubesi',
    address: 'Şişli Mah. Büyükdere Cad. No:789 Şişli/İstanbul',
    phone: '0212 345 6789',
    manager: 'Teknisyen Ali Vural',
    openHours: '09:00-18:00',
    services: ['Bakım', 'Teknik Destek']
  }
];

// KPI data for dashboard
const dashboardKPIs = {
  totalPatients: 156,
  activeTrials: 23,
  monthlyRevenue: 485000,
  appointmentsToday: 8,
  noShowRate: 12,
  conversionRate: 68,
  avgSaleValue: 16500,
  stockAlerts: 3,
  pendingSGK: 7,
  campaignResponses: 15
};

// Patient funnel data
const patientFunnel = [
  { stage: 'Leads', count: 45, percentage: 100 },
  { stage: 'İlk Değerlendirme', count: 38, percentage: 84 },
  { stage: 'Test Tamamlandı', count: 32, percentage: 71 },
  { stage: 'Deneme Başladı', count: 28, percentage: 62 },
  { stage: 'Satış Tamamlandı', count: 19, percentage: 42 }
];

// Recent activities for timeline
const recentActivities = [
  {
    id: 'act1',
    type: 'appointment',
    title: 'Randevu Tamamlandı',
    description: 'Ahmet Yılmaz - Deneme cihazı teslimi',
    timestamp: '2024-01-20T14:30:00Z',
    user: 'Dr. Elif Yıldız'
  },
  {
    id: 'act2',
    type: 'sale',
    title: 'Satış Gerçekleşti',
    description: 'Fatma Demir - Oticon More 1 (18.000 TL)',
    timestamp: '2024-01-20T11:15:00Z',
    user: 'Odyolog Murat Şen'
  },
  {
    id: 'act3',
    type: 'campaign',
    title: 'SMS Kampanyası Gönderildi',
    description: 'Randevu kaçırma hatırlatması - 5 kişi',
    timestamp: '2024-01-20T10:00:00Z',
    user: 'Sistem'
  },
  {
    id: 'act4',
    type: 'patient',
    title: 'Yeni Hasta Kaydı',
    description: 'Mehmet Kaya - İlk değerlendirme',
    timestamp: '2024-01-19T16:00:00Z',
    user: 'Dr. Elif Yıldız'
  }
];

// Initialize sample data if localStorage is empty
function initializeSampleData() {
  if (!window.Storage.load('patients')) {
    window.Storage.save('patients', samplePatients);
  }
  if (!window.Storage.load('appointments')) {
    window.Storage.save('appointments', sampleAppointments);
  }
  if (!window.Storage.load('inventory')) {
    window.Storage.save('inventory', sampleInventory);
  }
  if (!window.Storage.load('campaigns')) {
    window.Storage.save('campaigns', sampleCampaigns);
  }
  if (!window.Storage.load('notifications')) {
    window.Storage.save('notifications', sampleNotifications);
  }
  if (!window.Storage.load('clinicians')) {
    window.Storage.save('clinicians', sampleClinicians);
  }
  if (!window.Storage.load('branches')) {
    window.Storage.save('branches', sampleBranches);
  }
  if (!window.Storage.load('dashboardKPIs')) {
    window.Storage.save('dashboardKPIs', dashboardKPIs);
  }
  if (!window.Storage.load('patientFunnel')) {
    window.Storage.save('patientFunnel', patientFunnel);
  }
  if (!window.Storage.load('recentActivities')) {
    window.Storage.save('recentActivities', recentActivities);
  }
}

// Export data for global access
window.sampleData = {
  patients: samplePatients,
  appointments: sampleAppointments,
  inventory: sampleInventory,
  campaigns: sampleCampaigns,
  notifications: sampleNotifications,
  clinicians: sampleClinicians,
  branches: sampleBranches,
  dashboardKPIs,
  patientFunnel,
  recentActivities
};

window.initializeSampleData = initializeSampleData;

// Auto-initialize if this script is loaded
// Initialize data when the script loads
if (typeof window !== 'undefined') {
  // Wait for app.js to load first
  if (window.Storage) {
    initializeSampleData();
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      if (window.Storage) {
        initializeSampleData();
      }
    });
  }
}