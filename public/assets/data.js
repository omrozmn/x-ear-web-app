// X-Ear CRM Sample Data

// Simple Storage utility for localStorage
window.Storage = {
  save(key, data) {
    try {
      localStorage.setItem(`xear_${key}`, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  },
  
  load(key) {
    try {
      const data = localStorage.getItem(`xear_${key}`);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn('Failed to load from localStorage:', e);
      return null;
    }
  }
};

// Sample patients data
const samplePatients = [
  {
    id: 'p1',
    name: 'Elif Özkan',
    tcNumber: '12345678901',
    phone: '0532 123 4567',
    email: 'elif.ozkan@email.com',
    birthDate: '1985-03-15',
    address: 'Kadıköy, İstanbul',
    status: 'active',
    segment: 'trial',
    lastVisit: '2024-01-25',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-25T14:30:00Z',
    notes: [
      {
        id: 'n1',
        text: 'Bilateral işitme kaybı, deneme cihazı kullanıyor',
        date: '2024-01-20T10:00:00Z',
        author: 'Dr. Ahmet Yılmaz'
      },
      {
        id: 'n2',
        text: 'Hasta cihaza iyi adapte oldu, deneme süresini uzattık',
        date: '2024-01-25T14:30:00Z',
        author: 'Dr. Ahmet Yılmaz'
      }
    ],
    devices: [
      {
        brand: 'Phonak',
        model: 'Audeo Paradise P90',
        serialNumber: 'PH123456',
        ear: 'both',
        status: 'trial',
        trialStartDate: '2024-01-20',
        trialEndDate: '2024-02-03'
      }
    ],
    appointments: [],
    sgkStatus: 'approved',
    sgkReportDate: '2024-01-15',
    ereceiptHistory: [
      {
        id: '1706097600000',
        number: 'ER20240124001',
        doctorName: 'Dr. Mehmet Özkan',
        date: '2024-01-24T10:30:00Z',
        materials: [
          {
            code: 'M001',
            name: 'İşitme Cihazı (Dijital)',
            applicationDate: '2024-01-24',
            deliveryDate: '2024-01-26',
            deliveryNotes: 'Hasta memnun, adaptasyon başarılı',
            deliveredBy: 'Teknisyen Ali Vural'
          },
          {
            code: 'M002',
            name: 'İşitme Cihazı Pili (Çinko-Hava)',
            applicationDate: '2024-01-24'
          }
        ],
        saved: true
      },
      {
        id: '1706184000000',
        number: 'ER20240125002',
        doctorName: 'Dr. Elif Yıldız',
        date: '2024-01-25T14:15:00Z',
        materials: [
          {
            code: 'M003',
            name: 'Kulak Kalıbı (Silikon)',
            applicationDate: '2024-01-25',
            deliveryDate: '2024-01-27',
            deliveryNotes: 'Özel ölçü alındı',
            deliveredBy: 'Odyolog Murat Şen'
          }
        ],
        saved: true
      }
    ],
    lastReportQuery: {
      date: '2024-01-23T14:20:00Z',
      tcNumber: '12345678901',
      results: [
        { type: 'device', name: 'İşitme Cihazı Raporu', validUntil: '2025-12-31', status: 'active' },
        { type: 'battery', name: 'Pil Raporu', validUntil: '2024-06-30', status: 'expired' },
        { type: 'maintenance', name: 'Bakım Raporu', validUntil: '2024-12-15', status: 'active' }
      ]
    }
  },
  {
    id: 'p2',
    name: 'Murat Demir',
    tcNumber: '98765432109',
    phone: '0533 987 6543',
    email: 'murat.demir@email.com',
    birthDate: '1978-07-22',
    address: 'Beşiktaş, İstanbul',
    status: 'active',
    segment: 'purchased',
    lastVisit: '2024-01-22',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-22T11:15:00Z',
    notes: 'Sol kulak işitme kaybı, cihaz satın aldı',
    devices: [
      {
        brand: 'Oticon',
        model: 'More 1',
        serialNumber: 'OT789012',
        ear: 'left',
        status: 'purchased',
        purchaseDate: '2024-01-15',
        warrantyEndDate: '2026-01-15'
      }
    ],
    appointments: [],
    sgkStatus: 'approved',
    sgkReportDate: '2024-01-05'
  },
  {
    id: 'p3',
    name: 'Zeynep Kaya',
    tcNumber: '11223344556',
    phone: '0534 111 2233',
    email: 'zeynep.kaya@email.com',
    birthDate: '1992-11-08',
    address: 'Şişli, İstanbul',
    status: 'pending',
    segment: 'lead',
    lastVisit: '2024-01-28',
    createdAt: '2024-01-28T16:00:00Z',
    updatedAt: '2024-01-28T16:00:00Z',
    notes: 'İlk değerlendirme yapıldı, test sonuçları bekleniyor',
    devices: [],
    appointments: [],
    sgkStatus: 'pending',
    sgkReportDate: null
  },
  {
    id: 'p101',
    name: 'Ahmet Çelik',
    tcNumber: '22334455667',
    phone: '0535 223 3445',
    email: 'ahmet.celik@email.com',
    birthDate: '1970-05-12',
    address: 'Üsküdar, İstanbul',
    status: 'active',
    segment: 'follow_up',
    lastVisit: '2024-01-24',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-24T10:45:00Z',
    notes: 'Düzenli kontrol hastası, çok memnun',
    devices: [
      {
        brand: 'Signia',
        model: 'Pure Charge&Go 7X',
        serialNumber: 'SG345678',
        ear: 'both',
        status: 'purchased',
        purchaseDate: '2023-08-20',
        warrantyEndDate: '2025-08-20'
      }
    ],
    appointments: [],
    sgkStatus: 'approved',
    sgkReportDate: '2024-01-10'
  },
  {
    id: 'p102',
    name: 'Fatma Yıldız',
    tcNumber: '33445566778',
    phone: '0536 334 4556',
    email: 'fatma.yildiz@email.com',
    birthDate: '1965-09-18',
    address: 'Beyoğlu, İstanbul',
    status: 'active',
    segment: 'trial',
    lastVisit: '2024-01-26',
    createdAt: '2024-01-20T11:00:00Z',
    updatedAt: '2024-01-26T15:20:00Z',
    notes: 'Emekli öğretmen, deneme süreci devam ediyor',
    devices: [
      {
        brand: 'Widex',
        model: 'Moment 440',
        serialNumber: 'WX567890',
        ear: 'right',
        status: 'trial',
        trialStartDate: '2024-01-20',
        trialEndDate: '2024-02-03'
      }
    ],
    appointments: [],
    sgkStatus: 'approved',
    sgkReportDate: '2024-01-15'
  },
  {
    id: 'p103',
    name: 'Mehmet Arslan',
    tcNumber: '44556677889',
    phone: '0537 445 5667',
    email: 'mehmet.arslan@email.com',
    birthDate: '1988-12-03',
    address: 'Bakırköy, İstanbul',
    status: 'inactive',
    segment: 'lead',
    lastVisit: '2024-01-10',
    createdAt: '2024-01-05T14:00:00Z',
    updatedAt: '2024-01-10T16:30:00Z',
    notes: 'İlk değerlendirme yapıldı, takip randevusuna gelmedi',
    devices: [],
    appointments: [],
    sgkStatus: 'rejected',
    sgkReportDate: '2024-01-08'
  },
  {
    id: 'p104',
    name: 'Ayşe Korkmaz',
    tcNumber: '55667788990',
    phone: '0538 556 6778',
    email: 'ayse.korkmaz@email.com',
    birthDate: '1955-06-25',
    address: 'Fatih, İstanbul',
    status: 'active',
    segment: 'purchased',
    lastVisit: '2024-01-27',
    createdAt: '2023-12-15T09:30:00Z',
    updatedAt: '2024-01-27T13:45:00Z',
    notes: 'Bilateral cihaz kullanıcısı, çok memnun',
    devices: [
      {
        brand: 'Phonak',
        model: 'Audeo Paradise P90',
        serialNumber: 'PH123459',
        ear: 'both',
        status: 'purchased',
        purchaseDate: '2024-01-10',
        warrantyEndDate: '2026-01-10'
      }
    ],
    appointments: [],
    sgkStatus: 'approved',
    sgkReportDate: '2023-12-10'
  },
  {
    id: 'p105',
    name: 'Hasan Özdemir',
    tcNumber: '66778899001',
    phone: '0539 667 7889',
    email: 'hasan.ozdemir@email.com',
    birthDate: '1982-02-14',
    address: 'Maltepe, İstanbul',
    status: 'pending',
    segment: 'trial',
    lastVisit: '2024-01-29',
    createdAt: '2024-01-25T10:15:00Z',
    updatedAt: '2024-01-29T10:15:00Z',
    notes: 'Yeni hasta, deneme cihazı teslim edildi',
    devices: [
      {
        brand: 'Oticon',
        model: 'More 1',
        serialNumber: 'OT789014',
        ear: 'left',
        status: 'trial',
        trialStartDate: '2024-01-25',
        trialEndDate: '2024-02-08'
      }
    ],
    appointments: [],
    sgkStatus: 'approved',
    sgkReportDate: '2024-01-22'
  },
  {
    id: 'p106',
    name: 'Gülsüm Şahin',
    tcNumber: '77889900112',
    phone: '0540 778 8990',
    email: 'gulsum.sahin@email.com',
    birthDate: '1975-08-07',
    address: 'Pendik, İstanbul',
    status: 'active',
    segment: 'follow_up',
    lastVisit: '2024-01-23',
    createdAt: '2023-11-20T12:00:00Z',
    updatedAt: '2024-01-23T14:20:00Z',
    notes: 'Tek taraflı işitme kaybı, düzenli kontroller',
    devices: [
      {
        brand: 'Signia',
        model: 'Pure Charge&Go 7X',
        serialNumber: 'SG345682',
        ear: 'right',
        status: 'purchased',
        purchaseDate: '2023-12-05',
        warrantyEndDate: '2025-12-05'
      }
    ],
    appointments: [],
    sgkStatus: 'approved',
    sgkReportDate: '2023-11-15'
  },
  {
    id: 'p107',
    name: 'Osman Polat',
    tcNumber: '88990011223',
    phone: '0541 889 9001',
    email: 'osman.polat@email.com',
    birthDate: '1968-11-30',
    address: 'Kartal, İstanbul',
    status: 'active',
    segment: 'lead',
    lastVisit: '2024-01-30',
    createdAt: '2024-01-30T09:00:00Z',
    updatedAt: '2024-01-30T09:00:00Z',
    notes: 'İlk değerlendirme, orta derece işitme kaybı',
    devices: [],
    appointments: [],
    sgkStatus: 'pending',
    sgkReportDate: null
  },
  {
    id: 'p108',
    name: 'Leyla Güven',
    tcNumber: '99001122334',
    phone: '0542 990 0112',
    email: 'leyla.guven@email.com',
    birthDate: '1990-05-18',
    address: 'Ataşehir, İstanbul',
    status: 'active',
    segment: 'purchased',
    lastVisit: '2024-01-21',
    createdAt: '2024-01-05T15:30:00Z',
    updatedAt: '2024-01-21T11:00:00Z',
    notes: 'Genç hasta, müzik dinlemeyi seviyor',
    devices: [
      {
        brand: 'Oticon',
        model: 'More 1',
        serialNumber: 'OT789015',
        ear: 'both',
        status: 'purchased',
        purchaseDate: '2024-01-15',
        warrantyEndDate: '2026-01-15'
      }
    ],
    appointments: [],
    sgkStatus: 'approved',
    sgkReportDate: '2024-01-02'
  },
  {
    id: 'p109',
    name: 'İbrahim Kılıç',
    tcNumber: '10112233445',
    phone: '0543 101 1223',
    email: 'ibrahim.kilic@email.com',
    birthDate: '1958-01-09',
    address: 'Küçükçekmece, İstanbul',
    status: 'inactive',
    segment: 'trial',
    lastVisit: '2024-01-12',
    createdAt: '2024-01-05T13:45:00Z',
    updatedAt: '2024-01-12T16:15:00Z',
    notes: 'Deneme süreci tamamlandı, karar vermedi',
    devices: [],
    appointments: [],
    sgkStatus: 'approved',
    sgkReportDate: '2024-01-03'
  },
  {
    id: 'p110',
    name: 'Sevgi Yaman',
    tcNumber: '21223344556',
    phone: '0544 212 2334',
    email: 'sevgi.yaman@email.com',
    birthDate: '1995-04-22',
    address: 'Esenler, İstanbul',
    status: 'active',
    segment: 'trial',
    lastVisit: '2024-01-28',
    createdAt: '2024-01-22T08:30:00Z',
    updatedAt: '2024-01-28T12:45:00Z',
    notes: 'Üniversite öğrencisi, deneme süreci devam ediyor',
    devices: [
      {
        brand: 'Phonak',
        model: 'Audeo Paradise P90',
        serialNumber: 'PH123461',
        ear: 'left',
        status: 'trial',
        trialStartDate: '2024-01-22',
        trialEndDate: '2024-02-05'
      }
    ],
    appointments: [],
    sgkStatus: 'approved',
    sgkReportDate: '2024-01-18'
  },
  {
    id: 'p111',
    name: 'Kemal Acar',
    tcNumber: '32334455667',
    phone: '0545 323 3445',
    email: 'kemal.acar@email.com',
    birthDate: '1952-10-15',
    address: 'Zeytinburnu, İstanbul',
    status: 'active',
    segment: 'follow_up',
    lastVisit: '2024-01-25',
    createdAt: '2022-08-05T14:20:00Z',
    updatedAt: '2024-01-25T10:30:00Z',
    notes: 'Uzun süreli hasta, düzenli kontroller',
    devices: [
      {
        brand: 'Widex',
        model: 'Moment 440',
        serialNumber: 'WX567891',
        ear: 'both',
        status: 'purchased',
        purchaseDate: '2022-09-10',
        warrantyEndDate: '2024-09-10'
      }
    ],
    appointments: [],
    sgkStatus: 'approved',
    sgkReportDate: '2022-07-28'
  },
  {
    id: 'p112',
    name: 'Hatice Doğan',
    tcNumber: '43445566778',
    phone: '0546 434 4556',
    email: 'hatice.dogan@email.com',
    birthDate: '1980-07-03',
    address: 'Başakşehir, İstanbul',
    status: 'pending',
    segment: 'lead',
    lastVisit: '2024-01-31',
    createdAt: '2024-01-31T16:45:00Z',
    updatedAt: '2024-01-31T16:45:00Z',
    notes: 'Online başvuru, telefon görüşmesi yapıldı',
    devices: [],
    appointments: [],
    sgkStatus: 'not_applied',
    sgkReportDate: null
  },
  {
    id: 'p113',
    name: 'Veli Özkan',
    tcNumber: '54556677889',
    phone: '0547 545 5667',
    email: 'veli.ozkan@email.com',
    birthDate: '1963-03-12',
    address: 'Beylikdüzü, İstanbul',
    status: 'active',
    segment: 'trial',
    lastVisit: '2024-01-26',
    createdAt: '2024-01-18T09:00:00Z',
    updatedAt: '2024-01-26T11:30:00Z',
    notes: 'Emekli, deneme süreci devam ediyor',
    devices: [
      {
        brand: 'Phonak',
        model: 'Audeo Paradise P90',
        serialNumber: 'PH123462',
        ear: 'right',
        status: 'trial',
        trialStartDate: '2024-01-18',
        trialEndDate: '2024-02-01'
      }
    ],
    appointments: [],
    sgkStatus: 'approved',
    sgkReportDate: '2024-01-15'
  },
  {
    id: 'p114',
    name: 'Nurten Kara',
    tcNumber: '65667788990',
    phone: '0548 656 6778',
    email: 'nurten.kara@email.com',
    birthDate: '1971-11-25',
    address: 'Esenyurt, İstanbul',
    status: 'active',
    segment: 'purchased',
    lastVisit: '2024-01-24',
    createdAt: '2024-01-12T14:15:00Z',
    updatedAt: '2024-01-24T16:20:00Z',
    notes: 'Bilateral işitme kaybı, cihaz satın aldı',
    devices: [
      {
        brand: 'Signia',
        model: 'Pure Charge&Go 7X',
        serialNumber: 'SG345683',
        ear: 'both',
        status: 'purchased',
        purchaseDate: '2024-01-20',
        warrantyEndDate: '2026-01-20'
      }
    ],
    appointments: [],
    sgkStatus: 'approved',
    sgkReportDate: '2024-01-08'
  },
  {
    id: 'p115',
    name: 'Ramazan Yıldırım',
    tcNumber: '76778899001',
    phone: '0549 767 7889',
    email: 'ramazan.yildirim@email.com',
    birthDate: '1987-09-14',
    address: 'Sultangazi, İstanbul',
    status: 'active',
    segment: 'follow_up',
    lastVisit: '2024-01-29',
    createdAt: '2023-10-20T11:30:00Z',
    updatedAt: '2024-01-29T13:15:00Z',
    notes: 'İş kazası sonrası işitme kaybı, düzenli takip',
    devices: [
      {
        brand: 'Oticon',
        model: 'More 1',
        serialNumber: 'OT789016',
        ear: 'left',
        status: 'purchased',
        purchaseDate: '2023-11-15',
        warrantyEndDate: '2025-11-15'
      }
    ],
    appointments: [],
    sgkStatus: 'approved',
    sgkReportDate: '2023-10-15'
  },
  {
    id: 'p116',
    name: 'Emine Çetin',
    tcNumber: '87889900112',
    phone: '0550 878 8990',
    email: 'emine.cetin@email.com',
    birthDate: '1959-12-08',
    address: 'Gaziosmanpaşa, İstanbul',
    status: 'inactive',
    segment: 'lead',
    lastVisit: '2024-01-15',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-15T12:30:00Z',
    notes: 'İlk değerlendirme yapıldı, takip edilemiyor',
    devices: [],
    appointments: [],
    sgkStatus: 'pending',
    sgkReportDate: null
  },
  {
    id: 'p117',
    name: 'Mustafa Koç',
    tcNumber: '98990011223',
    phone: '0551 989 9001',
    email: 'mustafa.koc2@email.com',
    birthDate: '1974-06-20',
    address: 'Arnavutköy, İstanbul',
    status: 'active',
    segment: 'trial',
    lastVisit: '2024-01-27',
    createdAt: '2024-01-20T15:45:00Z',
    updatedAt: '2024-01-27T17:10:00Z',
    notes: 'Şoför, gürültü kaynaklı işitme kaybı',
    devices: [
      {
        brand: 'Widex',
        model: 'Moment 440',
        serialNumber: 'WX567892',
        ear: 'both',
        status: 'trial',
        trialStartDate: '2024-01-20',
        trialEndDate: '2024-02-03'
      }
    ],
    appointments: [],
    sgkStatus: 'approved',
    sgkReportDate: '2024-01-17'
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
  },
  {
    id: 'p5',
    name: 'Can Erdoğan',
    tcNumber: '33445566778',
    phone: '0536 333 4455',
    email: 'can.erdogan@email.com',
    birthDate: '1990-09-12',
    address: 'Beyoğlu, İstanbul',
    status: 'active',
    segment: 'trial',
    lastVisit: '2024-01-19',
    createdAt: '2024-01-05T11:00:00Z',
    updatedAt: '2024-01-19T15:20:00Z',
    notes: 'Genç hasta, müzik sektöründe çalışıyor, gürültü kaynaklı işitme kaybı',
    devices: [
      {
        brand: 'Widex',
        model: 'Moment 440',
        serialNumber: 'WX567890',
        ear: 'both',
        status: 'trial',
        trialStartDate: '2024-01-15',
        trialEndDate: '2024-01-29'
      }
    ],
    appointments: [],
    sgkStatus: 'pending',
    sgkReportDate: null
  },
  {
    id: 'p6',
    name: 'Zeynep Aktaş',
    tcNumber: '77889900112',
    phone: '0537 777 8899',
    email: 'zeynep.aktas@email.com',
    birthDate: '1963-12-03',
    address: 'Bakırköy, İstanbul',
    status: 'inactive',
    segment: 'lead',
    lastVisit: '2023-12-20',
    createdAt: '2023-12-15T14:00:00Z',
    updatedAt: '2023-12-20T16:30:00Z',
    notes: 'İlk değerlendirme yapıldı, takip randevusuna gelmedi',
    devices: [],
    appointments: [],
    sgkStatus: 'rejected',
    sgkReportDate: '2023-12-18'
  },
  {
    id: 'p7',
    name: 'Hasan Çelik',
    tcNumber: '99887766554',
    phone: '0538 999 8877',
    email: 'hasan.celik@email.com',
    birthDate: '1948-06-25',
    address: 'Fatih, İstanbul',
    status: 'active',
    segment: 'purchased',
    lastVisit: '2024-01-16',
    createdAt: '2023-08-10T09:30:00Z',
    updatedAt: '2024-01-16T13:45:00Z',
    notes: 'Bilateral cihaz kullanıcısı, memnun, arkadaşlarını yönlendiriyor',
    devices: [
      {
        brand: 'Phonak',
        model: 'Audeo Paradise P90',
        serialNumber: 'PH123459',
        ear: 'left',
        status: 'purchased',
        purchaseDate: '2023-09-15',
        warrantyEndDate: '2025-09-15'
      },
      {
        brand: 'Phonak',
        model: 'Audeo Paradise P90',
        serialNumber: 'PH123460',
        ear: 'right',
        status: 'purchased',
        purchaseDate: '2023-09-15',
        warrantyEndDate: '2025-09-15'
      }
    ],
    appointments: [],
    sgkStatus: 'approved',
    sgkReportDate: '2023-08-05'
  },
  {
    id: 'p8',
    name: 'Elif Yıldırım',
    tcNumber: '22334455667',
    phone: '0539 222 3344',
    email: 'elif.yildirim@email.com',
    birthDate: '1978-02-14',
    address: 'Maltepe, İstanbul',
    status: 'pending',
    segment: 'trial',
    lastVisit: '2024-01-21',
    createdAt: '2024-01-21T10:15:00Z',
    updatedAt: '2024-01-21T10:15:00Z',
    notes: 'Yeni hasta, deneme cihazı bugün teslim edildi',
    devices: [
      {
        brand: 'Oticon',
        model: 'More 1',
        serialNumber: 'OT789014',
        ear: 'left',
        status: 'trial',
        trialStartDate: '2024-01-21',
        trialEndDate: '2024-02-04'
      }
    ],
    appointments: [],
    sgkStatus: 'approved',
    sgkReportDate: '2024-01-18'
  },
  {
    id: 'p9',
    name: 'Mustafa Koç',
    tcNumber: '66778899001',
    phone: '0540 666 7788',
    email: 'mustafa.koc@email.com',
    birthDate: '1985-08-07',
    address: 'Pendik, İstanbul',
    status: 'active',
    segment: 'follow_up',
    lastVisit: '2024-01-14',
    createdAt: '2023-06-20T12:00:00Z',
    updatedAt: '2024-01-14T14:20:00Z',
    notes: 'Tek taraflı işitme kaybı, iş kazası sonrası, düzenli kontroller',
    devices: [
      {
        brand: 'Signia',
        model: 'Pure Charge&Go 7X',
        serialNumber: 'SG345682',
        ear: 'left',
        status: 'purchased',
        purchaseDate: '2023-07-25',
        warrantyEndDate: '2025-07-25'
      }
    ],
    appointments: [],
    sgkStatus: 'approved',
    sgkReportDate: '2023-06-15'
  },
  {
    id: 'p10',
    name: 'Sema Aydın',
    tcNumber: '44556677889',
    phone: '0541 444 5566',
    email: 'sema.aydin@email.com',
    birthDate: '1972-11-30',
    address: 'Kartal, İstanbul',
    status: 'active',
    segment: 'lead',
    lastVisit: '2024-01-22',
    createdAt: '2024-01-22T09:00:00Z',
    updatedAt: '2024-01-22T09:00:00Z',
    notes: 'İlk değerlendirme, hafif işitme kaybı tespit edildi',
    devices: [],
    appointments: [],
    sgkStatus: 'pending',
    sgkReportDate: null
  },
  {
    id: 'p11',
    name: 'Oğuz Şahin',
    tcNumber: '88990011223',
    phone: '0542 888 9900',
    email: 'oguz.sahin@email.com',
    birthDate: '1960-05-18',
    address: 'Ataşehir, İstanbul',
    status: 'active',
    segment: 'purchased',
    lastVisit: '2024-01-11',
    createdAt: '2023-04-12T15:30:00Z',
    updatedAt: '2024-01-11T11:00:00Z',
    notes: 'Premium cihaz kullanıcısı, teknoloji meraklısı',
    devices: [
      {
        brand: 'Oticon',
        model: 'More 1',
        serialNumber: 'OT789015',
        ear: 'both',
        status: 'purchased',
        purchaseDate: '2023-05-20',
        warrantyEndDate: '2025-05-20'
      }
    ],
    appointments: [],
    sgkStatus: 'approved',
    sgkReportDate: '2023-04-08'
  },
  {
    id: 'p12',
    name: 'Gülsüm Polat',
    tcNumber: '11223344557',
    phone: '0543 111 2233',
    email: 'gulsum.polat@email.com',
    birthDate: '1952-01-09',
    address: 'Küçükçekmece, İstanbul',
    status: 'inactive',
    segment: 'trial',
    lastVisit: '2023-11-28',
    createdAt: '2023-11-15T13:45:00Z',
    updatedAt: '2023-11-28T16:15:00Z',
    notes: 'Deneme süreci tamamlandı, satın alma kararı vermedi',
    devices: [],
    appointments: [],
    sgkStatus: 'approved',
    sgkReportDate: '2023-11-10'
  },
  {
    id: 'p13',
    name: 'Emre Güven',
    tcNumber: '55443322110',
    phone: '0544 554 4332',
    email: 'emre.guven@email.com',
    birthDate: '1987-04-22',
    address: 'Esenler, İstanbul',
    status: 'active',
    segment: 'trial',
    lastVisit: '2024-01-17',
    createdAt: '2024-01-12T08:30:00Z',
    updatedAt: '2024-01-17T12:45:00Z',
    notes: 'Sporcu, su sporları yapıyor, su geçirmez cihaz denemesi',
    devices: [
      {
        brand: 'Phonak',
        model: 'Audeo Paradise P90',
        serialNumber: 'PH123461',
        ear: 'right',
        status: 'trial',
        trialStartDate: '2024-01-12',
        trialEndDate: '2024-01-26'
      }
    ],
    appointments: [],
    sgkStatus: 'approved',
    sgkReportDate: '2024-01-08'
  },
  {
    id: 'p14',
    name: 'Nermin Öztürk',
    tcNumber: '99887766553',
    phone: '0545 998 8776',
    email: 'nermin.ozturk@email.com',
    birthDate: '1945-10-15',
    address: 'Zeytinburnu, İstanbul',
    status: 'active',
    segment: 'follow_up',
    lastVisit: '2024-01-13',
    createdAt: '2022-03-05T14:20:00Z',
    updatedAt: '2024-01-13T10:30:00Z',
    notes: 'Uzun süreli hasta, düzenli kontroller, çok memnun',
    devices: [
      {
        brand: 'Widex',
        model: 'Moment 440',
        serialNumber: 'WX567891',
        ear: 'both',
        status: 'purchased',
        purchaseDate: '2022-04-10',
        warrantyEndDate: '2024-04-10'
      }
    ],
    appointments: [],
    sgkStatus: 'approved',
    sgkReportDate: '2022-02-28'
  },
  {
    id: 'p15',
    name: 'Burak Yaman',
    tcNumber: '33221100998',
    phone: '0546 332 2110',
    email: 'burak.yaman@email.com',
    birthDate: '1993-07-03',
    address: 'Başakşehir, İstanbul',
    status: 'pending',
    segment: 'lead',
    lastVisit: '2024-01-23',
    createdAt: '2024-01-23T16:45:00Z',
    updatedAt: '2024-01-23T16:45:00Z',
    notes: 'Online başvuru, telefon görüşmesi yapıldı, randevu bekleniyor',
    devices: [],
    appointments: [],
    sgkStatus: 'not_applied',
    sgkReportDate: null
  },
  {
    id: 'p16',
    name: 'Deniz Korkmaz',
    tcNumber: '12312312312',
    phone: '0547 123 1231',
    email: 'deniz.korkmaz@email.com',
    birthDate: '1980-03-12',
    address: 'Beylikdüzü, İstanbul',
    status: 'active',
    segment: 'trial',
    lastVisit: '2024-01-20',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-20T11:30:00Z',
    notes: 'Bilateral işitme kaybı, deneme süreci devam ediyor',
    devices: [
      {
        brand: 'Phonak',
        model: 'Audeo Paradise P90',
        serialNumber: 'PH123462',
        ear: 'both',
        status: 'trial',
        trialStartDate: '2024-01-15',
        trialEndDate: '2024-01-29'
      }
    ],
    appointments: [],
    sgkStatus: 'approved',
    sgkReportDate: '2024-01-10'
  },
  {
    id: 'p17',
    name: 'Leyla Arslan',
    tcNumber: '45645645645',
    phone: '0548 456 4564',
    email: 'leyla.arslan@email.com',
    birthDate: '1965-08-25',
    address: 'Gaziosmanpaşa, İstanbul',
    status: 'inactive',
    segment: 'lead',
    lastVisit: '2023-12-15',
    createdAt: '2023-12-10T14:00:00Z',
    updatedAt: '2023-12-15T16:00:00Z',
    notes: 'İlk değerlendirme yapıldı, takip edilemiyor',
    devices: [],
    appointments: [],
    sgkStatus: 'rejected',
    sgkReportDate: '2023-12-12'
  },
  {
    id: 'p18',
    name: 'Kemal Özdemir',
    tcNumber: '78978978978',
    phone: '0549 789 7897',
    email: 'kemal.ozdemir@email.com',
    birthDate: '1958-12-05',
    address: 'Sarıyer, İstanbul',
    status: 'active',
    segment: 'purchased',
    lastVisit: '2024-01-19',
    createdAt: '2023-09-20T10:30:00Z',
    updatedAt: '2024-01-19T14:15:00Z',
    notes: 'Premium cihaz kullanıcısı, çok memnun',
    devices: [
      {
        brand: 'Oticon',
        model: 'More 1',
        serialNumber: 'OT789016',
        ear: 'both',
        status: 'purchased',
        purchaseDate: '2023-10-15',
        warrantyEndDate: '2025-10-15'
      }
    ],
    appointments: [],
    sgkStatus: 'approved',
    sgkReportDate: '2023-09-15'
  },
  {
    id: 'p19',
    name: 'Sevgi Kılıç',
    tcNumber: '32132132132',
    phone: '0550 321 3213',
    email: 'sevgi.kilic@email.com',
    birthDate: '1970-06-18',
    address: 'Avcılar, İstanbul',
    status: 'pending',
    segment: 'trial',
    lastVisit: '2024-01-22',
    createdAt: '2024-01-20T11:00:00Z',
    updatedAt: '2024-01-22T13:45:00Z',
    notes: 'Yeni deneme başladı, adaptasyon süreci',
    devices: [
      {
        brand: 'Signia',
        model: 'Pure Charge&Go 7X',
        serialNumber: 'SG345683',
        ear: 'left',
        status: 'trial',
        trialStartDate: '2024-01-20',
        trialEndDate: '2024-02-03'
      }
    ],
    appointments: [],
    sgkStatus: 'pending',
    sgkReportDate: null
  },
  {
    id: 'p20',
    name: 'Recep Yıldırım',
    tcNumber: '65465465465',
    phone: '0551 654 6546',
    email: 'recep.yildirim@email.com',
    birthDate: '1943-02-28',
    address: 'Eyüp, İstanbul',
    status: 'active',
    segment: 'follow_up',
    lastVisit: '2024-01-16',
    createdAt: '2021-05-10T08:00:00Z',
    updatedAt: '2024-01-16T10:20:00Z',
    notes: 'Uzun süreli hasta, düzenli kontroller yapılıyor',
    devices: [
      {
        brand: 'Widex',
        model: 'Moment 440',
        serialNumber: 'WX567892',
        ear: 'right',
        status: 'purchased',
        purchaseDate: '2021-06-15',
        warrantyEndDate: '2023-06-15'
      }
    ],
    appointments: [],
    sgkStatus: 'approved',
     sgkReportDate: '2021-05-05'
   },
   {
     id: 'p21',
     name: 'Murat Şimşek',
     tcNumber: '98798798798',
     phone: '0552 987 9879',
     email: 'murat.simsek@email.com',
     birthDate: '1976-11-14',
     address: 'Bağcılar, İstanbul',
     status: 'active',
     segment: 'purchased',
     lastVisit: '2024-01-18',
     createdAt: '2023-07-05T12:00:00Z',
     updatedAt: '2024-01-18T15:30:00Z',
     notes: 'Çift cihaz kullanıcısı, işyerinde gürültü problemi',
     devices: [
       {
         brand: 'Phonak',
         model: 'Audeo Paradise P90',
         serialNumber: 'PH123463',
         ear: 'both',
         status: 'purchased',
         purchaseDate: '2023-08-10',
         warrantyEndDate: '2025-08-10'
       }
     ],
     appointments: [],
     sgkStatus: 'approved',
     sgkReportDate: '2023-07-01'
   },
   {
     id: 'p22',
     name: 'Hatice Doğan',
     tcNumber: '14714714714',
     phone: '0553 147 1471',
     email: 'hatice.dogan@email.com',
     birthDate: '1962-04-07',
     address: 'Sultangazi, İstanbul',
     status: 'pending',
     segment: 'lead',
     lastVisit: '2024-01-24',
     createdAt: '2024-01-24T10:00:00Z',
     updatedAt: '2024-01-24T10:00:00Z',
     notes: 'Yeni başvuru, ilk değerlendirme bekliyor',
     devices: [],
     appointments: [],
     sgkStatus: 'not_applied',
     sgkReportDate: null
   },
   {
     id: 'p23',
     name: 'İbrahim Kara',
     tcNumber: '25825825825',
     phone: '0554 258 2582',
     email: 'ibrahim.kara@email.com',
     birthDate: '1951-09-30',
     address: 'Güngören, İstanbul',
     status: 'active',
     segment: 'follow_up',
     lastVisit: '2024-01-17',
     createdAt: '2022-01-15T09:30:00Z',
     updatedAt: '2024-01-17T11:45:00Z',
     notes: 'Yaşlı hasta, düzenli bakım gerekiyor',
     devices: [
       {
         brand: 'Signia',
         model: 'Pure Charge&Go 7X',
         serialNumber: 'SG345684',
         ear: 'right',
         status: 'purchased',
         purchaseDate: '2022-02-20',
         warrantyEndDate: '2024-02-20'
       }
     ],
     appointments: [],
     sgkStatus: 'approved',
     sgkReportDate: '2022-01-10'
   },
   {
     id: 'p24',
     name: 'Aysel Tunç',
     tcNumber: '36936936936',
     phone: '0555 369 3693',
     email: 'aysel.tunc@email.com',
     birthDate: '1969-01-22',
     address: 'Bahçelievler, İstanbul',
     status: 'inactive',
     segment: 'trial',
     lastVisit: '2023-11-30',
     createdAt: '2023-11-20T14:15:00Z',
     updatedAt: '2023-11-30T16:30:00Z',
     notes: 'Deneme süreci yarıda bırakıldı',
     devices: [],
     appointments: [],
     sgkStatus: 'approved',
     sgkReportDate: '2023-11-15'
   },
   {
     id: 'p25',
     name: 'Veli Özkan',
     tcNumber: '74174174174',
     phone: '0556 741 7417',
     email: 'veli.ozkan@email.com',
     birthDate: '1984-07-11',
     address: 'Esenyurt, İstanbul',
     status: 'active',
     segment: 'trial',
     lastVisit: '2024-01-21',
     createdAt: '2024-01-16T13:00:00Z',
     updatedAt: '2024-01-21T14:20:00Z',
     notes: 'Genç hasta, teknoloji odaklı çözüm arıyor',
     devices: [
       {
         brand: 'Oticon',
         model: 'More 1',
         serialNumber: 'OT789017',
         ear: 'left',
         status: 'trial',
         trialStartDate: '2024-01-16',
         trialEndDate: '2024-01-30'
       }
     ],
     appointments: [],
     sgkStatus: 'pending',
      sgkReportDate: null
    },
    {
      id: 'p26',
      name: 'Selma Yılmaz',
      tcNumber: '85285285285',
      phone: '0557 852 8528',
      email: 'selma.yilmaz@email.com',
      birthDate: '1973-05-16',
      address: 'Arnavutköy, İstanbul',
      status: 'active',
      segment: 'purchased',
      lastVisit: '2024-01-15',
      createdAt: '2023-11-01T11:30:00Z',
      updatedAt: '2024-01-15T13:20:00Z',
      notes: 'Bilateral cihaz, çok memnun, referans veriyor',
      devices: [
        {
          brand: 'Widex',
          model: 'Moment 440',
          serialNumber: 'WX567893',
          ear: 'both',
          status: 'purchased',
          purchaseDate: '2023-12-05',
          warrantyEndDate: '2025-12-05'
        }
      ],
      appointments: [],
      sgkStatus: 'approved',
      sgkReportDate: '2023-10-25'
    },
    {
      id: 'p27',
      name: 'Hüseyin Çetin',
      tcNumber: '96396396396',
      phone: '0558 963 9639',
      email: 'huseyin.cetin@email.com',
      birthDate: '1967-12-03',
      address: 'Çatalca, İstanbul',
      status: 'pending',
      segment: 'trial',
      lastVisit: '2024-01-23',
      createdAt: '2024-01-18T15:45:00Z',
      updatedAt: '2024-01-23T09:15:00Z',
      notes: 'Kırsal bölgede yaşıyor, özel takip gerekiyor',
      devices: [
        {
          brand: 'Phonak',
          model: 'Audeo Paradise P90',
          serialNumber: 'PH123464',
          ear: 'right',
          status: 'trial',
          trialStartDate: '2024-01-18',
          trialEndDate: '2024-02-01'
        }
      ],
      appointments: [],
      sgkStatus: 'approved',
      sgkReportDate: '2024-01-15'
    },
    {
      id: 'p28',
      name: 'Fadime Koç',
      tcNumber: '15915915915',
      phone: '0559 159 1591',
      email: 'fadime.koc@email.com',
      birthDate: '1956-08-19',
      address: 'Silivri, İstanbul',
      status: 'inactive',
      segment: 'lead',
      lastVisit: '2023-10-20',
      createdAt: '2023-10-15T12:00:00Z',
      updatedAt: '2023-10-20T14:30:00Z',
      notes: 'Ekonomik sebepler, takip edilemiyor',
      devices: [],
      appointments: [],
      sgkStatus: 'rejected',
      sgkReportDate: '2023-10-18'
    },
    {
      id: 'p29',
      name: 'Orhan Demir',
      tcNumber: '75375375375',
      phone: '0560 753 7537',
      email: 'orhan.demir@email.com',
      birthDate: '1979-03-08',
      address: 'Büyükçekmece, İstanbul',
      status: 'active',
      segment: 'follow_up',
      lastVisit: '2024-01-14',
      createdAt: '2023-03-10T10:15:00Z',
      updatedAt: '2024-01-14T16:45:00Z',
      notes: 'İş kazası sonrası, düzenli kontrol',
      devices: [
        {
          brand: 'Signia',
          model: 'Pure Charge&Go 7X',
          serialNumber: 'SG345685',
          ear: 'left',
          status: 'purchased',
          purchaseDate: '2023-04-15',
          warrantyEndDate: '2025-04-15'
        }
      ],
      appointments: [],
      sgkStatus: 'approved',
      sgkReportDate: '2023-03-05'
    },
    {
      id: 'p30',
      name: 'Gülten Acar',
      tcNumber: '48648648648',
      phone: '0561 486 4864',
      email: 'gulten.acar@email.com',
      birthDate: '1964-10-27',
      address: 'Çekmeköy, İstanbul',
      status: 'active',
      segment: 'trial',
      lastVisit: '2024-01-22',
      createdAt: '2024-01-17T08:30:00Z',
      updatedAt: '2024-01-22T11:00:00Z',
      notes: 'İlk kez cihaz deneyimi, adaptasyon süreci',
      devices: [
        {
          brand: 'Oticon',
          model: 'More 1',
          serialNumber: 'OT789018',
          ear: 'both',
          status: 'trial',
          trialStartDate: '2024-01-17',
          trialEndDate: '2024-01-31'
        }
      ],
      appointments: [],
      sgkStatus: 'pending',
       sgkReportDate: null
     },
     {
       id: 'p31',
       name: 'Yusuf Kaya',
       tcNumber: '35735735735',
       phone: '0562 357 3573',
       email: 'yusuf.kaya@email.com',
       birthDate: '1988-01-15',
       address: 'Tuzla, İstanbul',
       status: 'active',
       segment: 'purchased',
       lastVisit: '2024-01-19',
       createdAt: '2023-12-20T14:00:00Z',
       updatedAt: '2024-01-19T10:30:00Z',
       notes: 'Genç profesyonel, teknoloji dostu',
       devices: [
         {
           brand: 'Phonak',
           model: 'Audeo Paradise P90',
           serialNumber: 'PH123465',
           ear: 'left',
           status: 'purchased',
           purchaseDate: '2024-01-05',
           warrantyEndDate: '2026-01-05'
         }
       ],
       appointments: [],
       sgkStatus: 'approved',
       sgkReportDate: '2023-12-15'
     },
     {
       id: 'p32',
       name: 'Zehra Öztürk',
       tcNumber: '95195195195',
       phone: '0563 951 9519',
       email: 'zehra.ozturk@email.com',
       birthDate: '1971-06-28',
       address: 'Adalar, İstanbul',
       status: 'pending',
       segment: 'lead',
       lastVisit: '2024-01-25',
       createdAt: '2024-01-25T09:00:00Z',
       updatedAt: '2024-01-25T09:00:00Z',
       notes: 'Ada sakini, ulaşım zorluğu var',
       devices: [],
       appointments: [],
       sgkStatus: 'not_applied',
       sgkReportDate: null
     },
     {
       id: 'p33',
       name: 'Mehmet Ali Şen',
       tcNumber: '75975975975',
       phone: '0564 759 7597',
       email: 'mehmetali.sen@email.com',
       birthDate: '1954-11-12',
       address: 'Beykoz, İstanbul',
       status: 'active',
       segment: 'follow_up',
       lastVisit: '2024-01-16',
       createdAt: '2020-08-15T11:00:00Z',
       updatedAt: '2024-01-16T15:20:00Z',
       notes: 'Uzun süreli hasta, garanti yenileme gerekiyor',
       devices: [
         {
           brand: 'Widex',
           model: 'Moment 440',
           serialNumber: 'WX567894',
           ear: 'both',
           status: 'purchased',
           purchaseDate: '2020-09-20',
           warrantyEndDate: '2022-09-20'
         }
       ],
       appointments: [],
       sgkStatus: 'approved',
       sgkReportDate: '2020-08-10'
     },
     {
       id: 'p34',
       name: 'Nurten Yıldız',
       tcNumber: '15315315315',
       phone: '0565 153 1531',
       email: 'nurten.yildiz@email.com',
       birthDate: '1959-04-03',
       address: 'Şile, İstanbul',
       status: 'inactive',
       segment: 'trial',
       lastVisit: '2023-09-15',
       createdAt: '2023-09-01T13:30:00Z',
       updatedAt: '2023-09-15T16:45:00Z',
       notes: 'Deneme süreci tamamlandı, karar veremedi',
       devices: [],
       appointments: [],
       sgkStatus: 'approved',
       sgkReportDate: '2023-08-25'
     },
     {
       id: 'p35',
       name: 'Ramazan Çelik',
       tcNumber: '95395395395',
       phone: '0566 953 9539',
       email: 'ramazan.celik@email.com',
       birthDate: '1966-09-21',
       address: 'Sultanbeyli, İstanbul',
       status: 'active',
       segment: 'trial',
       lastVisit: '2024-01-24',
       createdAt: '2024-01-19T10:15:00Z',
       updatedAt: '2024-01-24T12:30:00Z',
       notes: 'Mesleki işitme kaybı, deneme devam ediyor',
       devices: [
         {
           brand: 'Signia',
           model: 'Pure Charge&Go 7X',
           serialNumber: 'SG345686',
           ear: 'both',
           status: 'trial',
           trialStartDate: '2024-01-19',
           trialEndDate: '2024-02-02'
         }
       ],
       appointments: [],
       sgkStatus: 'approved',
        sgkReportDate: '2024-01-16'
      },
      {
        id: 'p36',
        name: 'Emine Polat',
        tcNumber: '75175175175',
        phone: '0567 751 7517',
        email: 'emine.polat@email.com',
        birthDate: '1961-02-14',
        address: 'Sancaktepe, İstanbul',
        status: 'active',
        segment: 'purchased',
        lastVisit: '2024-01-17',
        createdAt: '2023-05-12T09:45:00Z',
        updatedAt: '2024-01-17T14:00:00Z',
        notes: 'Tek taraflı cihaz, çok memnun',
        devices: [
          {
            brand: 'Oticon',
            model: 'More 1',
            serialNumber: 'OT789019',
            ear: 'right',
            status: 'purchased',
            purchaseDate: '2023-06-20',
            warrantyEndDate: '2025-06-20'
          }
        ],
        appointments: [],
        sgkStatus: 'approved',
        sgkReportDate: '2023-05-08'
      },
      {
        id: 'p37',
        name: 'Ahmet Güler',
        tcNumber: '35935935935',
        phone: '0568 359 3593',
        email: 'ahmet.guler@email.com',
        birthDate: '1983-07-09',
        address: 'Pendik, İstanbul',
        status: 'pending',
        segment: 'trial',
        lastVisit: '2024-01-23',
        createdAt: '2024-01-20T11:30:00Z',
        updatedAt: '2024-01-23T16:15:00Z',
        notes: 'Sporcu, su sporları yapıyor',
        devices: [
          {
            brand: 'Phonak',
            model: 'Audeo Paradise P90',
            serialNumber: 'PH123466',
            ear: 'both',
            status: 'trial',
            trialStartDate: '2024-01-20',
            trialEndDate: '2024-02-03'
          }
        ],
        appointments: [],
        sgkStatus: 'pending',
        sgkReportDate: null
      },
      {
        id: 'p38',
        name: 'Fatma Kara',
        tcNumber: '15715715715',
        phone: '0569 157 1571',
        email: 'fatma.kara@email.com',
        birthDate: '1950-12-25',
        address: 'Kartal, İstanbul',
        status: 'inactive',
        segment: 'lead',
        lastVisit: '2023-08-10',
        createdAt: '2023-08-05T15:00:00Z',
        updatedAt: '2023-08-10T17:30:00Z',
        notes: 'Yaşlı hasta, aile desteği yetersiz',
        devices: [],
        appointments: [],
        sgkStatus: 'rejected',
        sgkReportDate: '2023-08-08'
      },
      {
        id: 'p39',
        name: 'Mustafa Yaman',
        tcNumber: '95795795795',
        phone: '0570 957 9579',
        email: 'mustafa.yaman@email.com',
        birthDate: '1974-05-18',
        address: 'Maltepe, İstanbul',
        status: 'active',
        segment: 'follow_up',
        lastVisit: '2024-01-18',
        createdAt: '2022-11-20T12:15:00Z',
        updatedAt: '2024-01-18T09:45:00Z',
        notes: 'Bilateral cihaz, düzenli bakım yapılıyor',
        devices: [
          {
            brand: 'Widex',
            model: 'Moment 440',
            serialNumber: 'WX567895',
            ear: 'both',
            status: 'purchased',
            purchaseDate: '2022-12-25',
            warrantyEndDate: '2024-12-25'
          }
        ],
        appointments: [],
        sgkStatus: 'approved',
        sgkReportDate: '2022-11-15'
      },
      {
        id: 'p40',
        name: 'Ayşe Doğan',
        tcNumber: '35135135135',
        phone: '0571 351 3513',
        email: 'ayse.dogan@email.com',
        birthDate: '1977-08-06',
        address: 'Ümraniye, İstanbul',
        status: 'active',
        segment: 'trial',
        lastVisit: '2024-01-21',
        createdAt: '2024-01-16T14:20:00Z',
        updatedAt: '2024-01-21T11:10:00Z',
        notes: 'Çalışan anne, pratik çözüm arıyor',
        devices: [
          {
            brand: 'Signia',
            model: 'Pure Charge&Go 7X',
            serialNumber: 'SG345687',
            ear: 'left',
            status: 'trial',
            trialStartDate: '2024-01-16',
            trialEndDate: '2024-01-30'
          }
        ],
        appointments: [],
        sgkStatus: 'approved',
        sgkReportDate: '2024-01-12'
      },
      {
        id: 'p41',
        name: 'Hakan Yıldız',
        tcNumber: '75175175175',
        phone: '0572 751 7517',
        email: 'hakan.yildiz@email.com',
        birthDate: '1969-03-12',
        address: 'Gaziosmanpaşa, İstanbul',
        status: 'active',
        segment: 'purchased',
        lastVisit: '2024-01-19',
        createdAt: '2023-07-15T10:30:00Z',
        updatedAt: '2024-01-19T14:20:00Z',
        notes: 'Memnun müşteri, arkadaşlarını yönlendiriyor',
        devices: [
          {
            brand: 'Phonak',
            model: 'Audeo Paradise P90',
            serialNumber: 'PH123462',
            ear: 'both',
            status: 'purchased',
            purchaseDate: '2023-08-20',
            warrantyEndDate: '2025-08-20'
          }
        ],
        appointments: [],
        sgkStatus: 'approved',
        sgkReportDate: '2023-07-10'
      },
      {
        id: 'p42',
        name: 'Serpil Kaya',
        tcNumber: '15315315315',
        phone: '0573 153 1531',
        email: 'serpil.kaya@email.com',
        birthDate: '1981-11-25',
        address: 'Sultangazi, İstanbul',
        status: 'pending',
        segment: 'trial',
        lastVisit: '2024-01-22',
        createdAt: '2024-01-17T09:15:00Z',
        updatedAt: '2024-01-22T16:30:00Z',
        notes: 'Öğretmen, sınıfta duyma zorluğu yaşıyor',
        devices: [
          {
            brand: 'Oticon',
            model: 'More 1',
            serialNumber: 'OT789016',
            ear: 'right',
            status: 'trial',
            trialStartDate: '2024-01-17',
            trialEndDate: '2024-01-31'
          }
        ],
        appointments: [],
        sgkStatus: 'pending',
        sgkReportDate: null
      },
      {
        id: 'p43',
        name: 'Cengiz Özkan',
        tcNumber: '95395395395',
        phone: '0574 953 9539',
        email: 'cengiz.ozkan@email.com',
        birthDate: '1956-07-08',
        address: 'Arnavutköy, İstanbul',
        status: 'active',
        segment: 'follow_up',
        lastVisit: '2024-01-16',
        createdAt: '2022-05-12T11:45:00Z',
        updatedAt: '2024-01-16T13:20:00Z',
        notes: 'Emekli, düzenli kontroller yapılıyor',
        devices: [
          {
            brand: 'Signia',
            model: 'Pure Charge&Go 7X',
            serialNumber: 'SG345688',
            ear: 'left',
            status: 'purchased',
            purchaseDate: '2022-06-15',
            warrantyEndDate: '2024-06-15'
          }
        ],
        appointments: [],
        sgkStatus: 'approved',
        sgkReportDate: '2022-05-08'
      },
      {
        id: 'p44',
        name: 'Dilek Şen',
        tcNumber: '35735735735',
        phone: '0575 357 3573',
        email: 'dilek.sen@email.com',
        birthDate: '1973-12-14',
        address: 'Başakşehir, İstanbul',
        status: 'active',
        segment: 'trial',
        lastVisit: '2024-01-20',
        createdAt: '2024-01-15T08:00:00Z',
        updatedAt: '2024-01-20T12:45:00Z',
        notes: 'Hemşire, iş yerinde duyma problemi',
        devices: [
          {
            brand: 'Widex',
            model: 'Moment 440',
            serialNumber: 'WX567896',
            ear: 'both',
            status: 'trial',
            trialStartDate: '2024-01-15',
            trialEndDate: '2024-01-29'
          }
        ],
        appointments: [],
        sgkStatus: 'approved',
        sgkReportDate: '2024-01-12'
      },
      {
        id: 'p45',
        name: 'Bülent Acar',
        tcNumber: '75975975975',
        phone: '0576 759 7597',
        email: 'bulent.acar@email.com',
        birthDate: '1962-04-03',
        address: 'Büyükçekmece, İstanbul',
        status: 'inactive',
        segment: 'lead',
        lastVisit: '2023-12-28',
        createdAt: '2023-12-20T15:30:00Z',
        updatedAt: '2023-12-28T10:15:00Z',
        notes: 'İlk değerlendirme yapıldı, karar veremiyor',
        devices: [],
        appointments: [],
        sgkStatus: 'rejected',
        sgkReportDate: '2023-12-25'
      },
      {
        id: 'p46',
        name: 'Tülay Koç',
        tcNumber: '15915915915',
        phone: '0577 159 1591',
        email: 'tulay.koc@email.com',
        birthDate: '1970-09-17',
        address: 'Çatalca, İstanbul',
        status: 'active',
        segment: 'purchased',
        lastVisit: '2024-01-17',
        createdAt: '2023-09-08T13:20:00Z',
        updatedAt: '2024-01-17T11:30:00Z',
        notes: 'Bilateral cihaz, çok memnun',
        devices: [
          {
            brand: 'Oticon',
            model: 'More 1',
            serialNumber: 'OT789017',
            ear: 'both',
            status: 'purchased',
            purchaseDate: '2023-10-12',
            warrantyEndDate: '2025-10-12'
          }
        ],
        appointments: [],
        sgkStatus: 'approved',
        sgkReportDate: '2023-09-05'
      },
      {
        id: 'p47',
        name: 'Erkan Yılmaz',
        tcNumber: '35935935935',
        phone: '0578 359 3593',
        email: 'erkan.yilmaz@email.com',
        birthDate: '1984-01-29',
        address: 'Silivri, İstanbul',
        status: 'pending',
        segment: 'lead',
        lastVisit: '2024-01-23',
        createdAt: '2024-01-23T14:45:00Z',
        updatedAt: '2024-01-23T14:45:00Z',
        notes: 'Yeni hasta, ilk değerlendirme bugün yapıldı',
        devices: [],
        appointments: [],
        sgkStatus: 'pending',
        sgkReportDate: null
      },
      {
        id: 'p48',
        name: 'Gönül Arslan',
        tcNumber: '75375375375',
        phone: '0579 753 7537',
        email: 'gonul.arslan@email.com',
        birthDate: '1959-06-11',
        address: 'Eyüpsultan, İstanbul',
        status: 'active',
        segment: 'follow_up',
        lastVisit: '2024-01-15',
        createdAt: '2022-08-25T10:00:00Z',
        updatedAt: '2024-01-15T15:30:00Z',
        notes: 'Uzun süreli hasta, düzenli takip',
        devices: [
          {
            brand: 'Widex',
            model: 'Moment 440',
            serialNumber: 'WX567897',
            ear: 'right',
            status: 'purchased',
            purchaseDate: '2022-09-30',
            warrantyEndDate: '2024-09-30'
          }
        ],
        appointments: [],
        sgkStatus: 'approved',
        sgkReportDate: '2022-08-20'
      },
      {
        id: 'p49',
        name: 'Kadir Özdemir',
        tcNumber: '95795795795',
        phone: '0580 957 9579',
        email: 'kadir.ozdemir@email.com',
        birthDate: '1976-10-22',
        address: 'Çekmeköy, İstanbul',
        status: 'active',
        segment: 'trial',
        lastVisit: '2024-01-21',
        createdAt: '2024-01-18T09:30:00Z',
        updatedAt: '2024-01-21T13:15:00Z',
        notes: 'Mühendis, teknoloji odaklı çözüm arıyor',
        devices: [
          {
            brand: 'Phonak',
            model: 'Audeo Paradise P90',
            serialNumber: 'PH123463',
            ear: 'left',
            status: 'trial',
            trialStartDate: '2024-01-18',
            trialEndDate: '2024-02-01'
          }
        ],
        appointments: [],
        sgkStatus: 'approved',
        sgkReportDate: '2024-01-15'
      },
      {
        id: 'p50',
        name: 'Sevim Kılıç',
        tcNumber: '15715715715',
        phone: '0581 157 1571',
        email: 'sevim.kilic@email.com',
        birthDate: '1965-08-05',
        address: 'Beykoz, İstanbul',
        status: 'active',
        segment: 'purchased',
        lastVisit: '2024-01-14',
        createdAt: '2023-11-30T16:00:00Z',
        updatedAt: '2024-01-14T10:45:00Z',
        notes: 'Emekli öğretmen, çok titiz ve düzenli',
        devices: [
          {
            brand: 'Signia',
            model: 'Pure Charge&Go 7X',
            serialNumber: 'SG345689',
            ear: 'both',
            status: 'purchased',
            purchaseDate: '2023-12-15',
            warrantyEndDate: '2025-12-15'
          }
        ],
        appointments: [],
        sgkStatus: 'approved',
        sgkReportDate: '2023-11-25'
      },
      {
        id: 'p201',
        name: 'Rahime Çelik',
        tcNumber: '33445566778',
        phone: '0536 334 4556',
        email: 'rahime.celik@email.com',
        birthDate: '1975-09-20',
        address: 'Fatih, İstanbul',
        status: 'active',
        segment: 'trial',
        lastVisit: '2024-08-28',
        createdAt: '2024-08-20T14:00:00Z',
        updatedAt: '2024-08-28T16:30:00Z',
        notes: 'Yaşa bağlı işitme kaybı, deneme cihazı memnun',
        devices: [
          {
            brand: 'Phonak',
            model: 'Audeo Lumity L90',
            serialNumber: 'PH567890',
            ear: 'both',
            status: 'trial',
            trialStartDate: '2024-08-20',
            trialEndDate: '2024-09-03'
          }
        ],
        appointments: [],
        sgkStatus: 'approved',
        sgkReportDate: '2024-08-15'
      },
      {
        id: 'p202',
        name: 'Sami Karatay',
        tcNumber: '44556677889',
        phone: '0537 445 5667',
        email: 'sami.karatay@email.com',
        birthDate: '1962-12-05',
        address: 'Bakırköy, İstanbul',
        status: 'active',
        segment: 'purchased',
        lastVisit: '2024-08-25',
        createdAt: '2024-07-15T09:00:00Z',
        updatedAt: '2024-08-25T11:20:00Z',
        notes: 'Gürültülü ortamda işitme zorluğu, cihaz satın aldı',
        devices: [
          {
            brand: 'Oticon',
            model: 'Real 1',
            serialNumber: 'OT234567',
            ear: 'both',
            status: 'purchased',
            purchaseDate: '2024-08-10',
            warrantyEndDate: '2026-08-10'
          }
        ],
        appointments: [],
        sgkStatus: 'approved',
        sgkReportDate: '2024-07-20'
      },
      {
        id: 'p203',
        name: 'Sercan Kubilay',
        tcNumber: '55667788990',
        phone: '0538 556 6778',
        email: 'sercan.kubilay@email.com',
        birthDate: '1988-04-18',
        address: 'Maltepe, İstanbul',
        status: 'pending',
        segment: 'lead',
        lastVisit: '2024-08-30',
        createdAt: '2024-08-30T10:30:00Z',
        updatedAt: '2024-08-30T10:30:00Z',
        notes: 'Ani işitme kaybı, acil değerlendirme gerekli',
        devices: [],
        appointments: [],
        sgkStatus: 'pending',
        sgkReportDate: null
      },
      {
        id: 'p204',
        name: 'Onur Aydoğdu',
        tcNumber: '66778899001',
        phone: '0539 667 7889',
        email: 'onur.aydogdu@email.com',
        birthDate: '1980-01-12',
        address: 'Pendik, İstanbul',
        status: 'active',
        segment: 'follow_up',
        lastVisit: '2024-08-27',
        createdAt: '2024-06-10T13:00:00Z',
        updatedAt: '2024-08-27T15:45:00Z',
        notes: 'Bilateral işitme cihazı kullanıyor, düzenli kontroller',
        devices: [
          {
            brand: 'Widex',
            model: 'Moment 440',
            serialNumber: 'WX123456',
            ear: 'both',
            status: 'purchased',
            purchaseDate: '2024-06-20',
            warrantyEndDate: '2026-06-20'
          }
        ],
        appointments: [],
        sgkStatus: 'approved',
        sgkReportDate: '2024-06-05'
      }];

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

// Sample inventory data - Enhanced with comprehensive stock management
const sampleInventory = [
  {
    id: 'item_1',
    name: 'Audeo Paradise P90',
    brand: 'Phonak',
    model: 'P90-13',
    category: 'isitme_cihazi',
    serialNumber: 'PH123456',
    barcode: '1234567890123',
    stock: 15,
    minStock: 5,
    price: 15000,
    supplier: 'Phonak Türkiye',
    warranty: 24,
    description: 'Premium seviye işitme cihazı, Bluetooth özellikli',
    onTrial: 3,
    createdAt: '2024-01-15T10:00:00Z',
    lastUpdated: '2024-01-15T10:00:00Z'
  },
  {
    id: 'item_2',
    name: 'Audeo Paradise P70',
    brand: 'Phonak',
    model: 'P70-312',
    category: 'isitme_cihazi',
    serialNumber: 'PH123457',
    barcode: '1234567890124',
    stock: 8,
    minStock: 3,
    price: 12000,
    supplier: 'Phonak Türkiye',
    warranty: 24,
    description: 'Orta seviye işitme cihazı',
    onTrial: 1,
    createdAt: '2024-01-10T09:00:00Z',
    lastUpdated: '2024-01-20T14:30:00Z'
  },
  {
    id: 'item_3',
    name: 'More 1',
    brand: 'Oticon',
    model: 'M1-312T',
    category: 'isitme_cihazi',
    serialNumber: 'OT789012',
    barcode: '1234567890125',
    stock: 12,
    minStock: 4,
    price: 18000,
    supplier: 'Oticon Türkiye',
    warranty: 24,
    description: 'Yapay zeka destekli premium cihaz',
    onTrial: 2,
    createdAt: '2024-01-12T11:00:00Z',
    lastUpdated: '2024-01-18T16:45:00Z'
  },
  {
    id: 'item_4',
    name: 'Pure Charge&Go 7X',
    brand: 'Signia',
    model: '7X-RIC',
    category: 'hearing_aid',
    serialNumber: 'SG345678',
    stock: 20,
    minStock: 8,
    price: 16500,
    supplier: 'Signia Türkiye',
    warranty: 24,
    description: 'Şarj edilebilir işitme cihazı',
    onTrial: 4,
    createdAt: '2024-01-05T13:00:00Z',
    lastUpdated: '2024-01-22T10:15:00Z'
  },
  {
    id: 'item_5',
    name: 'Moment 440',
    brand: 'Widex',
    model: '440-BTE',
    category: 'hearing_aid',
    serialNumber: 'WX567890',
    stock: 6,
    minStock: 2,
    price: 14000,
    supplier: 'Widex Türkiye',
    warranty: 24,
    description: 'Doğal ses kalitesi sunan cihaz',
    onTrial: 1,
    createdAt: '2024-01-08T15:00:00Z',
    lastUpdated: '2024-01-19T12:30:00Z'
  },
  {
    id: 'item_6',
    name: 'Size 312 Pil',
    brand: 'Duracell',
    model: '312-6P',
    category: 'pil',
    serialNumber: 'DR312-001',
    stock: 200,
    minStock: 50,
    price: 25,
    supplier: 'Duracell Türkiye',
    warranty: 0,
    description: 'İşitme cihazı pili, 6\'lı paket',
    onTrial: 0,
    createdAt: '2024-01-01T08:00:00Z',
    lastUpdated: '2024-01-25T09:00:00Z'
  },
  {
    id: 'item_7',
    name: 'Size 13 Pil',
    brand: 'Duracell',
    model: '13-6P',
    category: 'pil',
    serialNumber: 'DR13-001',
    stock: 150,
    minStock: 40,
    price: 25,
    supplier: 'Duracell Türkiye',
    warranty: 0,
    description: 'İşitme cihazı pili, 6\'lı paket',
    onTrial: 0,
    createdAt: '2024-01-01T08:00:00Z',
    lastUpdated: '2024-01-23T11:00:00Z'
  },
  {
    id: 'item_8',
    name: 'Dome Seti',
    brand: 'Phonak',
    model: 'DOME-SET',
    category: 'aksesuar',
    serialNumber: 'PH-DOME-001',
    stock: 50,
    minStock: 15,
    price: 150,
    supplier: 'Phonak Türkiye',
    warranty: 6,
    description: 'Kulak içi dome seti, çeşitli boyutlar',
    onTrial: 0,
    createdAt: '2024-01-03T10:00:00Z',
    lastUpdated: '2024-01-20T14:00:00Z'
  },
  {
    id: 'item_9',
    name: 'Temizlik Kiti',
    brand: 'Universal',
    model: 'CLEAN-KIT',
    category: 'maintenance',
    serialNumber: 'UC-001',
    stock: 75,
    minStock: 20,
    price: 85,
    supplier: 'Universal Medical',
    warranty: 0,
    description: 'İşitme cihazı temizlik ve bakım kiti',
    onTrial: 0,
    createdAt: '2024-01-02T12:00:00Z',
    lastUpdated: '2024-01-21T16:00:00Z'
  },
  {
    id: 'item_10',
    name: 'Wax Guard',
    brand: 'Oticon',
    model: 'WG-10',
    category: 'accessory',
    serialNumber: 'OT-WG-001',
    stock: 100,
    minStock: 30,
    price: 45,
    supplier: 'Oticon Türkiye',
    warranty: 0,
    description: 'Kulak kiri koruyucu, 10\'lu paket',
    onTrial: 0,
    createdAt: '2024-01-04T09:00:00Z',
    lastUpdated: '2024-01-24T13:00:00Z'
  },
  {
    id: 'item_11',
    name: 'Şarj Cihazı',
    brand: 'Signia',
    model: 'CHARGER-7X',
    category: 'accessory',
    serialNumber: 'SG-CH-001',
    stock: 25,
    minStock: 8,
    price: 750,
    supplier: 'Signia Türkiye',
    warranty: 12,
    description: 'Pure Charge&Go 7X için şarj cihazı',
    onTrial: 2,
    createdAt: '2024-01-06T11:00:00Z',
    lastUpdated: '2024-01-22T15:00:00Z'
  },
  {
    id: 'item_12',
    name: 'Roger Select',
    brand: 'Phonak',
    model: 'ROGER-SELECT',
    category: 'accessory',
    serialNumber: 'PH-RS-001',
    stock: 5,
    minStock: 2,
    price: 4500,
    supplier: 'Phonak Türkiye',
    warranty: 24,
    description: 'Uzaktan mikrofon sistemi',
    onTrial: 1,
    createdAt: '2024-01-07T14:00:00Z',
    lastUpdated: '2024-01-25T10:00:00Z'
  },
  {
    id: 'item_13',
    name: 'TV Streamer',
    brand: 'Oticon',
    model: 'TV-STREAM',
    category: 'accessory',
    serialNumber: 'OT-TV-001',
    stock: 8,
    minStock: 3,
    price: 1200,
    supplier: 'Oticon Türkiye',
    warranty: 12,
    description: 'TV ses aktarım cihazı',
    onTrial: 0,
    createdAt: '2024-01-09T16:00:00Z',
    lastUpdated: '2024-01-26T12:00:00Z'
  },
  {
    id: 'item_14',
    name: 'Nemlendirici Tablet',
    brand: 'Universal',
    model: 'DRY-TAB',
    category: 'maintenance',
    serialNumber: 'UD-001',
    stock: 120,
    minStock: 40,
    price: 35,
    supplier: 'Universal Medical',
    warranty: 0,
    description: 'Cihaz kurutma tableti, 30\'lu paket',
    onTrial: 0,
    createdAt: '2024-01-11T08:00:00Z',
    lastUpdated: '2024-01-27T14:00:00Z'
  },
  {
    id: 'item_15',
    name: 'Real 1',
    brand: 'Oticon',
    model: 'REAL1-312',
    category: 'hearing_aid',
    serialNumber: 'OT-R1-001',
    stock: 4,
    minStock: 2,
    price: 19500,
    supplier: 'Oticon Türkiye',
    warranty: 24,
    description: 'Yeni nesil premium işitme cihazı',
    onTrial: 1,
    createdAt: '2024-01-13T10:00:00Z',
    lastUpdated: '2024-01-28T11:00:00Z'
  },
  {
    id: 'item_16',
    name: 'Styletto 7X',
    brand: 'Signia',
    model: 'STY7X-312',
    category: 'hearing_aid',
    serialNumber: 'SG-ST-001',
    stock: 3,
    minStock: 1,
    price: 17500,
    supplier: 'Signia Türkiye',
    warranty: 24,
    description: 'Şık tasarımlı premium cihaz',
    onTrial: 0,
    createdAt: '2024-01-14T12:00:00Z',
    lastUpdated: '2024-01-29T09:00:00Z'
  },
  {
    id: 'item_17',
    name: 'Size 10 Pil',
    brand: 'Rayovac',
    model: '10-8P',
    category: 'battery',
    serialNumber: 'RV10-001',
    stock: 160,
    minStock: 50,
    price: 22,
    supplier: 'Rayovac Türkiye',
    warranty: 0,
    description: 'İşitme cihazı pili, 8\'li paket',
    onTrial: 0,
    createdAt: '2024-01-16T15:00:00Z',
    lastUpdated: '2024-01-30T08:00:00Z'
  },
  {
    id: 'item_18',
    name: 'Evoke 440',
    brand: 'Widex',
    model: 'EV440-RIC',
    category: 'hearing_aid',
    serialNumber: 'WX-EV-001',
    stock: 2,
    minStock: 1,
    price: 15500,
    supplier: 'Widex Türkiye',
    warranty: 24,
    description: 'Makine öğrenmeli cihaz',
    onTrial: 0,
    createdAt: '2024-01-17T13:00:00Z',
    lastUpdated: '2024-01-31T10:00:00Z'
  },
  {
    id: 'item_19',
    name: 'Lumity L90',
    brand: 'Phonak',
    model: 'L90-312T',
    category: 'hearing_aid',
    serialNumber: 'PH-L90-001',
    stock: 12,
    minStock: 4,
    price: 20000,
    supplier: 'Phonak Türkiye',
    warranty: 24,
    description: 'En yeni nesil premium işitme cihazı',
    onTrial: 2,
    createdAt: '2024-02-01T09:00:00Z',
    lastUpdated: '2024-02-01T09:00:00Z'
  },
  {
    id: 'item_20',
    name: 'Intent 1',
    brand: 'Oticon',
    model: 'INT1-312',
    category: 'hearing_aid',
    serialNumber: 'OT-INT-001',
    stock: 8,
    minStock: 3,
    price: 21000,
    supplier: 'Oticon Türkiye',
    warranty: 24,
    description: 'Gelişmiş yapay zeka teknolojisi',
    onTrial: 1,
    createdAt: '2024-02-01T10:00:00Z',
    lastUpdated: '2024-02-01T10:00:00Z'
  },
  {
    id: 'item_21',
    name: 'Silk Charge&Go IX',
    brand: 'Signia',
    model: 'SILK-IX',
    category: 'hearing_aid',
    serialNumber: 'SG-SILK-001',
    stock: 6,
    minStock: 2,
    price: 18500,
    supplier: 'Signia Türkiye',
    warranty: 24,
    description: 'Tamamen kulak içi şarj edilebilir cihaz',
    onTrial: 1,
    createdAt: '2024-02-01T11:00:00Z',
    lastUpdated: '2024-02-01T11:00:00Z'
  },
  {
    id: 'item_22',
    name: 'Sheer 440',
    brand: 'Widex',
    model: 'SH440-CIC',
    category: 'hearing_aid',
    serialNumber: 'WX-SH-001',
    stock: 4,
    minStock: 2,
    price: 16000,
    supplier: 'Widex Türkiye',
    warranty: 24,
    description: 'Kulak içi gizli model',
    onTrial: 0,
    createdAt: '2024-02-01T12:00:00Z',
    lastUpdated: '2024-02-01T12:00:00Z'
  },
  {
    id: 'item_23',
    name: 'Size 675 Pil',
    brand: 'PowerOne',
    model: '675-6P',
    category: 'battery',
    serialNumber: 'PO675-001',
    stock: 80,
    minStock: 25,
    price: 30,
    supplier: 'PowerOne Türkiye',
    warranty: 0,
    description: 'Güçlü cihazlar için büyük pil',
    onTrial: 0,
    createdAt: '2024-02-01T13:00:00Z',
    lastUpdated: '2024-02-01T13:00:00Z'
  },
  {
    id: 'item_24',
    name: 'Kulak Kalıbı Seti',
    brand: 'Universal',
    model: 'MOLD-SET',
    category: 'accessory',
    serialNumber: 'UM-MOLD-001',
    stock: 30,
    minStock: 10,
    price: 250,
    supplier: 'Universal Medical',
    warranty: 6,
    description: 'Özel kulak kalıbı yapım seti',
    onTrial: 0,
    createdAt: '2024-02-01T14:00:00Z',
    lastUpdated: '2024-02-01T14:00:00Z'
  },
  {
    id: 'item_25',
    name: 'Bluetooth Streamer',
    brand: 'ReSound',
    model: 'RS-BT-001',
    category: 'accessory',
    serialNumber: 'RS-BT-001',
    stock: 15,
    minStock: 5,
    price: 1800,
    supplier: 'ReSound Türkiye',
    warranty: 12,
    description: 'Bluetooth ses aktarım cihazı',
    onTrial: 2,
    createdAt: '2024-02-01T15:00:00Z',
    lastUpdated: '2024-02-01T15:00:00Z'
  },
  {
    id: 'item_26',
    name: 'Cerumen Filter',
    brand: 'Phonak',
    model: 'CF-20',
    category: 'accessory',
    serialNumber: 'PH-CF-001',
    stock: 200,
    minStock: 60,
    price: 15,
    supplier: 'Phonak Türkiye',
    warranty: 0,
    description: 'Kulak kiri filtresi, 20\'li paket',
    onTrial: 0,
    createdAt: '2024-02-01T16:00:00Z',
    lastUpdated: '2024-02-01T16:00:00Z'
  },
  {
    id: 'item_27',
    name: 'Kurutma Kapsülü',
    brand: 'Unitron',
    model: 'DRY-CAP',
    category: 'maintenance',
    serialNumber: 'UN-DC-001',
    stock: 50,
    minStock: 15,
    price: 120,
    supplier: 'Unitron Türkiye',
    warranty: 0,
    description: 'Cihaz kurutma kapsülü sistemi',
    onTrial: 0,
    createdAt: '2024-02-01T17:00:00Z',
    lastUpdated: '2024-02-01T17:00:00Z'
  },
  {
    id: 'item_28',
    name: 'Paradise P50',
    brand: 'Phonak',
    model: 'P50-13',
    category: 'hearing_aid',
    serialNumber: 'PH-P50-001',
    stock: 10,
    minStock: 3,
    price: 10000,
    supplier: 'Phonak Türkiye',
    warranty: 24,
    description: 'Temel seviye Paradise serisi',
    onTrial: 1,
    createdAt: '2024-02-01T18:00:00Z',
    lastUpdated: '2024-02-01T18:00:00Z'
  },
  {
    id: 'item_29',
    name: 'More 2',
    brand: 'Oticon',
    model: 'M2-312T',
    category: 'hearing_aid',
    serialNumber: 'OT-M2-001',
    stock: 7,
    minStock: 2,
    price: 14500,
    supplier: 'Oticon Türkiye',
    warranty: 24,
    description: 'Orta seviye More serisi',
    onTrial: 0,
    createdAt: '2024-02-01T19:00:00Z',
    lastUpdated: '2024-02-01T19:00:00Z'
  },
  {
    id: 'item_30',
    name: 'Pure 7X',
    brand: 'Signia',
    model: 'P7X-312',
    category: 'hearing_aid',
    serialNumber: 'SG-P7X-001',
    stock: 14,
    minStock: 5,
    price: 13500,
    supplier: 'Signia Türkiye',
    warranty: 24,
    description: 'Standart Pure serisi',
    onTrial: 2,
    createdAt: '2024-02-01T20:00:00Z',
    lastUpdated: '2024-02-01T20:00:00Z'
  },
  {
    id: 'item_31',
    name: 'Enjoy 440',
    brand: 'Widex',
    model: 'EN440-BTE',
    category: 'hearing_aid',
    serialNumber: 'WX-EN-001',
    stock: 5,
    minStock: 2,
    price: 11500,
    supplier: 'Widex Türkiye',
    warranty: 24,
    description: 'Ekonomik Widex modeli',
    onTrial: 0,
    createdAt: '2024-02-01T21:00:00Z',
    lastUpdated: '2024-02-01T21:00:00Z'
  },
  {
    id: 'item_32',
    name: 'Telefon Kiti',
    brand: 'Universal',
    model: 'PHONE-KIT',
    category: 'accessory',
    serialNumber: 'UP-PK-001',
    stock: 25,
    minStock: 8,
    price: 350,
    supplier: 'Universal Medical',
    warranty: 6,
    description: 'Telefon adaptörü kiti',
    onTrial: 0,
    createdAt: '2024-02-01T22:00:00Z',
    lastUpdated: '2024-02-01T22:00:00Z'
  },
  {
    id: 'item_33',
    name: 'FM Sistemi',
    brand: 'Phonak',
    model: 'FM-SYS',
    category: 'accessory',
    serialNumber: 'PH-FM-001',
    stock: 3,
    minStock: 1,
    price: 5500,
    supplier: 'Phonak Türkiye',
    warranty: 24,
    description: 'Okul ve toplantı için FM sistemi',
    onTrial: 1,
    createdAt: '2024-02-01T23:00:00Z',
    lastUpdated: '2024-02-01T23:00:00Z'
  },
  {
    id: 'item_34',
    name: 'Kulak Tıkacı Seti',
    brand: 'Oticon',
    model: 'PLUG-SET',
    category: 'accessory',
    serialNumber: 'OT-PS-001',
    stock: 40,
    minStock: 12,
    price: 80,
    supplier: 'Oticon Türkiye',
    warranty: 0,
    description: 'Çeşitli boyutlarda kulak tıkacı',
    onTrial: 0,
    createdAt: '2024-02-02T08:00:00Z',
    lastUpdated: '2024-02-02T08:00:00Z'
  },
  {
    id: 'item_35',
    name: 'Spray Temizleyici',
    brand: 'Signia',
    model: 'SPRAY-CLEAN',
    category: 'maintenance',
    serialNumber: 'SG-SC-001',
    stock: 35,
    minStock: 10,
    price: 65,
    supplier: 'Signia Türkiye',
    warranty: 0,
    description: 'Cihaz temizlik spreyi',
    onTrial: 0,
    createdAt: '2024-02-02T09:00:00Z',
    lastUpdated: '2024-02-02T09:00:00Z'
  },
  {
    id: 'item_36',
    name: 'UV Sterilizör',
    brand: 'Universal',
    model: 'UV-STER',
    category: 'maintenance',
    serialNumber: 'UU-UV-001',
    stock: 8,
    minStock: 3,
    price: 450,
    supplier: 'Universal Medical',
    warranty: 12,
    description: 'UV ışık ile sterilizasyon cihazı',
    onTrial: 0,
    createdAt: '2024-02-02T10:00:00Z',
    lastUpdated: '2024-02-02T10:00:00Z'
  },
  {
    id: 'item_37',
    name: 'Taşıma Çantası',
    brand: 'Widex',
    model: 'CARRY-BAG',
    category: 'accessory',
    serialNumber: 'WX-CB-001',
    stock: 60,
    minStock: 20,
    price: 125,
    supplier: 'Widex Türkiye',
    warranty: 6,
    description: 'Cihaz taşıma ve koruma çantası',
    onTrial: 0,
    createdAt: '2024-02-02T11:00:00Z',
    lastUpdated: '2024-02-02T11:00:00Z'
  },
  {
    id: 'item_38',
    name: 'Pil Test Cihazı',
    brand: 'Universal',
    model: 'BAT-TEST',
    category: 'maintenance',
    serialNumber: 'UB-BT-001',
    stock: 12,
    minStock: 4,
    price: 180,
    supplier: 'Universal Medical',
    warranty: 12,
    description: 'Pil durumu test cihazı',
    onTrial: 0,
    createdAt: '2024-02-02T12:00:00Z',
    lastUpdated: '2024-02-02T12:00:00Z'
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
  totalPatients: 166,
  activeTrials: 27,
  monthlyRevenue: 485000,
  appointmentsToday: 8,
  noShowRate: 12,
  conversionRate: 68,
  avgSaleValue: 16500,
  stockAlerts: 3,
  pendingSGK: 9,
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

// Also export patients separately for backward compatibility
window.samplePatients = samplePatients;
window.patientsData = samplePatients;

window.initializeSampleData = initializeSampleData;

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
  initializeSampleData();
}