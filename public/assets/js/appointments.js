// X-Ear CRM - Appointment Management System

class AppointmentManager {
    constructor() {
        this.appointments = [];
        this.patients = [];
        this.currentView = 'calendar';
        this.currentDate = new Date();
        this.selectedAppointment = null;
        this.filters = {};
        
        this.init();
    }

    init() {
        this.loadData();
        this.renderStats();
        this.setView('calendar');
        this.setupEventListeners();
    }

    loadData() {
        // Load appointments from sample data or localStorage
        if (window.sampleData && window.sampleData.appointments) {
            this.appointments = [...window.sampleData.appointments];
        } else {
            this.appointments = this.generateSampleAppointments();
        }

        // Load patients for appointment creation
        if (window.sampleData && window.sampleData.patients) {
            this.patients = [...window.sampleData.patients];
        } else {
            this.patients = [];
        }

        // Apply sample data enhancement
        this.enhanceAppointmentData();
        
        console.log(`Loaded ${this.appointments.length} appointments`);
    }

    enhanceAppointmentData() {
        // Add missing properties and ensure consistency
        this.appointments = this.appointments.map(apt => ({
            ...apt,
            duration: apt.duration || 30,
            color: this.getAppointmentColor(apt.type, apt.status),
            patientName: this.getPatientName(apt.patientId),
            priority: this.calculateAppointmentPriority(apt)
        }));
    }

    getPatientName(patientId) {
        const patient = this.patients.find(p => p.id === patientId);
        return patient ? patient.name : 'Bilinmeyen Hasta';
    }

    getAppointmentColor(type, status) {
        if (status === 'completed') return '#16A34A';
        if (status === 'cancelled') return '#DC2626';
        if (status === 'no_show') return '#F59E0B';
        
        const typeColors = {
            'İlk Değerlendirme': '#2563EB',
            'Kontrol Muayenesi': '#059669',
            'Cihaz Teslimi': '#7C3AED',
            'Deneme Sonu Değerlendirme': '#DC2626',
            'Test Sonuçları': '#EA580C',
            'Pil Değişimi': '#0891B2'
        };
        
        return typeColors[type] || '#6B7280';
    }

    calculateAppointmentPriority(appointment) {
        let priority = 50;
        
        // Higher priority for certain types
        if (appointment.type === 'İlk Değerlendirme') priority += 20;
        if (appointment.type === 'Deneme Sonu Değerlendirme') priority += 30;
        
        // Status-based priority
        if (appointment.status === 'scheduled') priority += 10;
        if (appointment.status === 'confirmed') priority += 15;
        
        // Today's appointments get higher priority
        const today = new Date().toISOString().split('T')[0];
        if (appointment.date === today) priority += 25;
        
        return Math.min(priority, 100);
    }

    renderStats() {
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0];
        const thisWeek = this.getWeekRange(new Date());
        
        const stats = {
            todayCount: this.appointments.filter(apt => apt.date === today).length,
            tomorrowCount: this.appointments.filter(apt => apt.date === tomorrow).length,
            weeklyCount: this.appointments.filter(apt => 
                apt.date >= thisWeek.start && apt.date <= thisWeek.end
            ).length,
            pendingCount: this.appointments.filter(apt => 
                apt.status === 'scheduled' || apt.status === 'confirmed'
            ).length,
            completedToday: this.appointments.filter(apt => 
                apt.date === today && apt.status === 'completed'
            ).length,
            noShowToday: this.appointments.filter(apt => 
                apt.date === today && apt.status === 'no_show'
            ).length
        };

        const statsCards = [
            {
                title: 'Bugünkü Randevular',
                value: stats.todayCount.toString(),
                subtitle: `${stats.completedToday} tamamlandı, ${stats.noShowToday} gelmedi`,
                icon: 'calendar',
                color: 'blue'
            },
            {
                title: 'Yarınki Randevular', 
                value: stats.tomorrowCount.toString(),
                subtitle: 'Hazırlık yapılması gereken',
                icon: 'clock',
                color: 'green'
            },
            {
                title: 'Bu Hafta Toplam',
                value: stats.weeklyCount.toString(),
                subtitle: 'Haftalık randevu sayısı',
                icon: 'calendar-week',
                color: 'purple'
            },
            {
                title: 'Bekleyen Randevular',
                value: stats.pendingCount.toString(),
                subtitle: 'Onay bekleyen veya planlanmış',
                icon: 'clock-pending',
                color: 'orange'
            }
        ];

        this.renderStatsCards(statsCards);
    }

    renderStatsCards(cards) {
        const container = document.getElementById('statsContainer');
        if (!container) return;

        const html = cards.map(card => `
            <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-600">${card.title}</p>
                        <p class="text-2xl font-bold text-gray-900">${card.value}</p>
                        <p class="text-sm text-gray-500 mt-1">${card.subtitle}</p>
                    </div>
                    <div class="w-12 h-12 bg-${card.color}-100 rounded-lg flex items-center justify-center">
                        ${this.getStatsIcon(card.icon, card.color)}
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
    }

    getStatsIcon(type, color) {
        const icons = {
            calendar: `<svg class="w-6 h-6 text-${color}-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>`,
            clock: `<svg class="w-6 h-6 text-${color}-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>`,
            'calendar-week': `<svg class="w-6 h-6 text-${color}-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>`,
            'clock-pending': `<svg class="w-6 h-6 text-${color}-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>`
        };
        return icons[type] || icons.calendar;
    }

    setView(viewType) {
        this.currentView = viewType;
        
        // Update view toggle buttons
        document.querySelectorAll('.view-toggle').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`[data-view="${viewType}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        // Update view containers based on actual HTML structure
        const views = ['day', 'week', 'list'];
        views.forEach(view => {
            const element = document.getElementById(`${view}View`);
            if (element) {
                if (view === viewType) {
                    element.classList.remove('hidden');
                    element.classList.add('view-content');
                } else {
                    element.classList.add('hidden');
                }
            }
        });

        // Render appropriate view
        switch(viewType) {
            case 'day':
                this.renderDay();
                break;
            case 'week':
                this.renderWeek();
                break;
            case 'list':
                this.renderList();
                break;
        }
        
        this.updatePeriodDisplay();
    }

    renderDay() {
        const container = document.getElementById('dayView');
        if (!container) return;

        const todayAppointments = this.getAppointmentsForDate(this.currentDate);
        container.innerHTML = this.generateDayHTML(todayAppointments);
    }

    renderWeek() {
        const container = document.getElementById('weekView');
        if (!container) return;

        container.innerHTML = this.generateWeekHTML();
    }

    renderCalendar() {
        const container = document.getElementById('calendarContainer');
        if (!container) return;

        const calendarHtml = this.generateCalendarHTML();
        container.innerHTML = calendarHtml;
    }

    getAppointmentsForDate(date) {
        const dateStr = date.toISOString().split('T')[0];
        return this.getFilteredAppointments().filter(apt => apt.date === dateStr)
            .sort((a, b) => a.time.localeCompare(b.time));
    }

    generateDayHTML(appointments) {
        if (appointments.length === 0) {
            return `
                <div class="text-center py-8">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <h3 class="mt-2 text-sm font-medium text-gray-900">Bu gün için randevu yok</h3>
                    <p class="mt-1 text-sm text-gray-500">Seçili gün için planlanmış randevu bulunmuyor.</p>
                </div>
            `;
        }

        return `
            <div class="day-view-container">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">${this.formatDate(this.currentDate.toISOString().split('T')[0])}</h3>
                <div class="space-y-3">
                    ${appointments.map(apt => `
                        <div class="appointment-card bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" 
                             onclick="openAppointmentModal('${apt.patientName || apt.patient}', '${apt.time}', '${apt.type}')">
                            <div class="flex justify-between items-start">
                                <div class="flex-1">
                                    <div class="flex items-center gap-3">
                                        <div class="w-3 h-3 rounded-full" style="background-color: ${apt.color}"></div>
                                        <h4 class="font-medium text-gray-900">${apt.time} - ${apt.patientName || apt.patient}</h4>
                                    </div>
                                    <p class="text-sm text-gray-600 mt-1">${apt.type}</p>
                                    <p class="text-sm text-gray-500">${apt.clinician} • ${apt.branch}</p>
                                    ${apt.notes ? `<p class="text-sm text-gray-600 mt-2">${apt.notes}</p>` : ''}
                                </div>
                                <div class="flex flex-col items-end gap-2">
                                    ${this.getStatusBadge(apt.status)}
                                    <span class="text-xs text-gray-400">${apt.duration} dk</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    generateWeekHTML() {
        const weekRange = this.getWeekRange(this.currentDate);
        const weekDays = [];
        const currentDate = new Date(weekRange.start);
        
        for (let i = 0; i < 7; i++) {
            const dayStr = currentDate.toISOString().split('T')[0];
            const dayAppointments = this.getFilteredAppointments().filter(apt => apt.date === dayStr);
            weekDays.push({
                date: new Date(currentDate),
                dateStr: dayStr,
                appointments: dayAppointments
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return `
            <div class="week-view-container">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                    ${this.formatDate(weekRange.start)} - ${this.formatDate(weekRange.end)}
                </h3>
                <div class="grid grid-cols-7 gap-4">
                    ${weekDays.map(day => `
                        <div class="week-day-column">
                            <div class="text-center mb-3">
                                <div class="text-sm font-medium text-gray-900">
                                    ${day.date.toLocaleDateString('tr-TR', { weekday: 'short' })}
                                </div>
                                <div class="text-lg font-bold text-gray-700">
                                    ${day.date.getDate()}
                                </div>
                            </div>
                            <div class="space-y-2">
                                ${day.appointments.map(apt => `
                                    <div class="appointment-mini bg-white border border-gray-200 rounded p-2 text-xs cursor-pointer hover:shadow-sm"
                                         onclick="showAppointmentDetails('${apt.id}')"
                                         style="border-left: 3px solid ${apt.color}">
                                        <div class="font-medium">${apt.time}</div>
                                        <div class="text-gray-600 truncate">${apt.patientName}</div>
                                        <div class="text-gray-500 truncate">${apt.type}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <style>
                .week-day-column {
                    min-height: 400px;
                }
                .appointment-mini {
                    transition: all 0.2s;
                }
                .appointment-mini:hover {
                    transform: translateY(-1px);
                }
            </style>
        `;
    }

    generateCalendarHTML() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        let html = `
            <div class="calendar-grid">
                <div class="calendar-header">
                    <div class="calendar-day-header">Pazar</div>
                    <div class="calendar-day-header">Pazartesi</div>
                    <div class="calendar-day-header">Salı</div>
                    <div class="calendar-day-header">Çarşamba</div>
                    <div class="calendar-day-header">Perşembe</div>
                    <div class="calendar-day-header">Cuma</div>
                    <div class="calendar-day-header">Cumartesi</div>
                </div>
                <div class="calendar-body">
        `;

        const currentDate = new Date(startDate);
        for (let week = 0; week < 6; week++) {
            for (let day = 0; day < 7; day++) {
                const dayStr = currentDate.toISOString().split('T')[0];
                const dayAppointments = this.getFilteredAppointments().filter(apt => apt.date === dayStr);
                const isCurrentMonth = currentDate.getMonth() === month;
                const isToday = dayStr === new Date().toISOString().split('T')[0];

                html += `
                    <div class="calendar-day ${isCurrentMonth ? 'current-month' : 'other-month'} ${isToday ? 'today' : ''}" 
                         onclick="selectCalendarDay('${dayStr}')">
                        <div class="day-number">${currentDate.getDate()}</div>
                        <div class="day-appointments">
                            ${dayAppointments.slice(0, 3).map(apt => `
                                <div class="appointment-badge" style="background-color: ${apt.color}20; border-left: 3px solid ${apt.color}"
                                     onclick="console.log('Calendar appointment clicked:', { id: '${apt.id}', patient: '${apt.patientName || apt.patient}' }); showAppointmentDetails('${apt.id}')" title="${apt.time} - ${apt.patientName || apt.patient}">
                                    <span class="text-xs">${apt.time} ${apt.patientName || apt.patient}</span>
                                </div>
                            `).join('')}
                            ${dayAppointments.length > 3 ? `<div class="text-xs text-gray-500">+${dayAppointments.length - 3} daha</div>` : ''}
                        </div>
                    </div>
                `;
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }

        html += `
                </div>
            </div>
            <style>
                .calendar-grid {
                    display: flex;
                    flex-direction: column;
                    height: 600px;
                }
                .calendar-header {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 1px;
                    background-color: #e5e7eb;
                    border: 1px solid #e5e7eb;
                }
                .calendar-day-header {
                    background-color: #f9fafb;
                    padding: 12px 8px;
                    text-align: center;
                    font-weight: 600;
                    color: #374151;
                    font-size: 14px;
                }
                .calendar-body {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    grid-template-rows: repeat(6, 1fr);
                    gap: 1px;
                    background-color: #e5e7eb;
                    border: 1px solid #e5e7eb;
                    border-top: none;
                    flex: 1;
                }
                .calendar-day {
                    background-color: white;
                    padding: 8px;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    min-height: 80px;
                }
                .calendar-day:hover {
                    background-color: #f9fafb;
                }
                .calendar-day.other-month {
                    background-color: #f9fafb;
                    color: #9ca3af;
                }
                .calendar-day.today {
                    background-color: #eff6ff;
                    border: 2px solid #2563eb;
                }
                .day-number {
                    font-weight: 600;
                    margin-bottom: 4px;
                }
                .day-appointments {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    flex: 1;
                    overflow: hidden;
                }
                .appointment-badge {
                    padding: 2px 6px;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .appointment-badge:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
            </style>
        `;

        return html;
    }

    renderList() {
        const container = document.getElementById('appointmentsTableContainer');
        if (!container) return;

        const appointments = this.getFilteredAppointments();
        const html = this.generateListHTML(appointments);
        container.innerHTML = html;
    }

    generateListHTML(appointments) {
        if (appointments.length === 0) {
            return `
                <div class="p-8 text-center">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <h3 class="mt-2 text-sm font-medium text-gray-900">Randevu bulunamadı</h3>
                    <p class="mt-1 text-sm text-gray-500">Seçili filtrelere uygun randevu bulunmuyor.</p>
                </div>
            `;
        }

        return `
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hasta</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih & Saat</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tür</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Klinisyen</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${appointments.map(apt => `
                            <tr class="hover:bg-gray-50 cursor-pointer" onclick="showAppointmentDetails('${apt.id}')">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="font-medium text-gray-900">${apt.patientName}</div>
                                    <div class="text-sm text-gray-500">${apt.branch}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-900">${this.formatDate(apt.date)}</div>
                                    <div class="text-sm text-gray-500">${apt.time}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="text-sm text-gray-900">${apt.type}</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ${apt.clinician}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    ${this.getStatusBadge(apt.status)}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button onclick="editAppointment('${apt.id}')" class="text-primary hover:text-blue-900 mr-3">
                                        Düzenle
                                    </button>
                                    <button onclick="completeAppointment('${apt.id}')" class="text-green-600 hover:text-green-900">
                                        Tamamla
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    renderTimeline() {
        const container = document.getElementById('timelineContainer');
        if (!container) return;

        const today = new Date().toISOString().split('T')[0];
        const todayAppointments = this.getFilteredAppointments()
            .filter(apt => apt.date === today)
            .sort((a, b) => a.time.localeCompare(b.time));

        const html = this.generateTimelineHTML(todayAppointments);
        container.innerHTML = html;
    }

    generateTimelineHTML(appointments) {
        if (appointments.length === 0) {
            return `
                <div class="text-center py-8">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <h3 class="mt-2 text-sm font-medium text-gray-900">Bugün randevu yok</h3>
                    <p class="mt-1 text-sm text-gray-500">Bugün için planlanmış randevu bulunmuyor.</p>
                </div>
            `;
        }

        return `
            <div class="timeline-container">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Bugünkü Randevular - ${this.formatDate(new Date().toISOString().split('T')[0])}</h3>
                <div class="timeline">
                    ${appointments.map(apt => `
                        <div class="timeline-item" onclick="showAppointmentDetails('${apt.id}')">
                            <div class="timeline-marker" style="background-color: ${apt.color}"></div>
                            <div class="timeline-content">
                                <div class="flex justify-between items-start">
                                    <div>
                                        <h4 class="font-medium text-gray-900">${apt.time} - ${apt.patientName}</h4>
                                        <p class="text-sm text-gray-600">${apt.type}</p>
                                        <p class="text-sm text-gray-500">${apt.clinician} • ${apt.branch}</p>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        ${this.getStatusBadge(apt.status)}
                                        <span class="text-xs text-gray-400">${apt.duration} dk</span>
                                    </div>
                                </div>
                                ${apt.notes ? `<p class="text-sm text-gray-600 mt-2">${apt.notes}</p>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <style>
                .timeline {
                    position: relative;
                    padding-left: 30px;
                }
                .timeline::before {
                    content: '';
                    position: absolute;
                    left: 15px;
                    top: 0;
                    bottom: 0;
                    width: 2px;
                    background-color: #e5e7eb;
                }
                .timeline-item {
                    position: relative;
                    margin-bottom: 24px;
                    cursor: pointer;
                }
                .timeline-marker {
                    position: absolute;
                    left: -22px;
                    top: 8px;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    border: 2px solid white;
                    box-shadow: 0 0 0 2px #e5e7eb;
                }
                .timeline-content {
                    background-color: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    padding: 16px;
                    transition: all 0.2s;
                }
                .timeline-content:hover {
                    shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    border-color: #2563eb;
                }
            </style>
        `;
    }

    getFilteredAppointments() {
        let filtered = [...this.appointments];

        // Apply filters
        if (this.filters.status && this.filters.status !== '') {
            filtered = filtered.filter(apt => apt.status === this.filters.status);
        }
        if (this.filters.clinician && this.filters.clinician !== '') {
            filtered = filtered.filter(apt => apt.clinician === this.filters.clinician);
        }
        if (this.filters.branch && this.filters.branch !== '') {
            filtered = filtered.filter(apt => apt.branch === this.filters.branch);
        }
        if (this.filters.type && this.filters.type !== '') {
            filtered = filtered.filter(apt => apt.type === this.filters.type);
        }

        return filtered;
    }

    getStatusBadge(status) {
        const badges = {
            scheduled: '<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Planlandı</span>',
            confirmed: '<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Onaylandı</span>',
            completed: '<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Tamamlandı</span>',
            cancelled: '<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">İptal Edildi</span>',
            no_show: '<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Gelmedi</span>'
        };
        return badges[status] || badges.scheduled;
    }

    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    updatePeriodDisplay() {
        const element = document.getElementById('currentPeriod');
        if (!element) return;

        let text = '';
        if (this.currentView === 'calendar') {
            text = this.currentDate.toLocaleDateString('tr-TR', {
                month: 'long',
                year: 'numeric'
            });
        } else if (this.currentView === 'timeline') {
            text = 'Bugün';
        } else {
            text = 'Tüm Randevular';
        }
        
        element.textContent = text;
    }

    previousPeriod() {
        if (this.currentView === 'calendar') {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
            this.updatePeriodDisplay();
        }
    }

    nextPeriod() {
        if (this.currentView === 'calendar') {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
            this.updatePeriodDisplay();
        }
    }

    goToToday() {
        this.currentDate = new Date();
        if (this.currentView === 'calendar') {
            this.renderCalendar();
        } else if (this.currentView === 'timeline') {
            this.renderTimeline();
        }
        this.updatePeriodDisplay();
    }

    populatePatientSelect() {
        const select = document.querySelector('select[name="patientId"]');
        if (!select) return;

        const options = this.patients.map(patient => 
            `<option value="${patient.id}">${patient.name} - ${patient.phone}</option>`
        ).join('');

        select.innerHTML = '<option value="">Hasta Seçiniz</option>' + options;
    }

    handleNewAppointment(form) {
        const formData = new FormData(form);
        const appointment = {
            id: 'a' + (this.appointments.length + 1),
            patientId: formData.get('patientId'),
            date: formData.get('date'),
            time: formData.get('time'),
            type: formData.get('type'),
            clinician: formData.get('clinician'),
            branch: formData.get('branch'),
            duration: parseInt(formData.get('duration')) || 30,
            notes: formData.get('notes') || '',
            status: 'scheduled',
            createdAt: new Date().toISOString()
        };

        // Add enhanced properties
        appointment.patientName = this.getPatientName(appointment.patientId);
        appointment.color = this.getAppointmentColor(appointment.type, appointment.status);
        appointment.priority = this.calculateAppointmentPriority(appointment);

        this.appointments.push(appointment);
        
        // Save to localStorage if available
        if (window.Storage) {
            window.Storage.save('appointments', this.appointments);
        }

        // Refresh current view
        this.renderStats();
        this.setView(this.currentView);
        
        // Close modal and show success message
        hideNewAppointmentModal();
        this.showToast('Randevu başarıyla eklendi', 'success');
    }

    applyFilters() {
        this.filters = {
            status: document.getElementById('statusFilter').value,
            clinician: document.getElementById('clinicianFilter').value,
            branch: document.getElementById('branchFilter').value,
            type: document.getElementById('typeFilter').value
        };

        // Refresh current view
        this.setView(this.currentView);
    }

    setupEventListeners() {
        // Filter change events are handled in the HTML
    }

    showAppointmentDetails(appointmentId) {
        const appointment = this.appointments.find(apt => apt.id === appointmentId);
        if (!appointment) {
            console.error('Appointment not found with ID:', appointmentId);
            return;
        }

        console.log('showAppointmentDetails called with appointment:', appointment);
        
        // Use the global openAppointmentModal function for consistency
        const patientName = appointment.patientName || appointment.patient || '';
        if (typeof openAppointmentModal === 'function') {
            openAppointmentModal(patientName, appointment.time, appointment.type);
        } else {
            console.error('openAppointmentModal function not found');
        }
    }

    editCurrentAppointment() {
        if (!this.selectedAppointment) return;
        // TODO: Implement appointment editing
        this.showToast('Randevu düzenleme özelliği yakında eklenecek', 'info');
    }

    completeCurrentAppointment() {
        // This function is deprecated - appointment completion should be handled through the main modal
        console.warn('completeCurrentAppointment is deprecated. Use the main appointment modal for status updates.');
    }

    getWeekRange(date) {
        const start = new Date(date);
        start.setDate(date.getDate() - date.getDay());
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        
        return {
            start: start.toISOString().split('T')[0],
            end: end.toISOString().split('T')[0]
        };
    }

    showToast(message, type = 'info') {
        // Simple toast implementation
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white z-50 ${
            type === 'success' ? 'bg-green-500' : 
            type === 'error' ? 'bg-red-500' : 
            'bg-blue-500'
        }`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    generateSampleAppointments() {
        // Fallback sample data if mockData is not available
        return [
            {
                id: 'a1',
                patientId: 'p1',
                date: '2024-01-24',
                time: '09:00',
                type: 'Deneme Sonu Değerlendirme',
                clinician: 'Dr. Elif Yıldız',
                status: 'scheduled',
                branch: 'Kadıköy',
                duration: 45,
                notes: 'Deneme cihazı geri alınacak, satış görüşmesi yapılacak'
            }
        ];
    }
}

// Global functions for calendar interaction
window.selectCalendarDay = function(dateStr) {
    // TODO: Implement day selection
    console.log('Selected day:', dateStr);
};

window.showAppointmentDetails = function(appointmentId) {
    if (window.appointmentManager) {
        window.appointmentManager.showAppointmentDetails(appointmentId);
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppointmentManager;
} else {
    window.AppointmentManager = AppointmentManager;
}
