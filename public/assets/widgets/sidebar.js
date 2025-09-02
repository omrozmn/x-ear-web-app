// Sidebar Navigation Widget
class SidebarWidget {
    constructor(activePage = '') {
        this.activePage = activePage;
        this.isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    }

    render() {
        return `
            <nav class="sidebar-nav ${this.isCollapsed ? 'collapsed' : ''}">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-8">
                        <div class="flex items-center space-x-3">
                            <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <h1 class="text-xl font-bold text-gray-900 sidebar-title">X-Ear CRM</h1>
                        </div>
                        <button onclick="window.toggleSidebar()" class="toggle-btn p-2 rounded hover:bg-gray-100 flex-shrink-0">
                            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                            </svg>
                        </button>
                    </div>
                    
                    <ul class="space-y-2">
                        ${this.renderNavItem('dashboard.html', 'Dashboard', this.getDashboardIcon(), 'dashboard')}
                        ${this.renderNavItem('patients.html', 'Hastalar', this.getPatientsIcon(), 'patients')}
                        ${this.renderNavItem('appointments.html', 'Randevular', this.getAppointmentsIcon(), 'appointments')}
                        ${this.renderNavItem('inventory.html', 'Stok', this.getInventoryIcon(), 'inventory')}
                        ${this.renderNavItem('campaigns.html', 'Kampanyalar', this.getCampaignsIcon(), 'campaigns')}
                        ${this.renderNavItem('sgk.html', 'SGK Raporları', this.getSGKIcon(), 'sgk')}
                        ${this.renderNavItem('reports.html', 'Raporlar', this.getReportsIcon(), 'reports')}
                        ${this.renderNavItem('automation.html', 'Otomasyon', this.getAutomationIcon(), 'automation')}
                        ${this.renderNavItem('settings.html', 'Ayarlar', this.getSettingsIcon(), 'settings')}
                    </ul>
                </div>
            </nav>
        `;
    }

    renderNavItem(href, text, icon, pageKey) {
        const isActive = this.activePage === pageKey;
        const activeClass = isActive ? ' active' : '';
        return `
            <li><a href="${href}" class="nav-item${activeClass}" title="${text}">
                ${icon}
                <span class="nav-text">${text}</span>
            </a></li>
        `;
    }

    getDashboardIcon() {
        return `
            <svg fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
            </svg>
        `;
    }

    getPatientsIcon() {
        return `
            <svg fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
            </svg>
        `;
    }

    getAppointmentsIcon() {
        return `
            <svg fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
            </svg>
        `;
    }

    getInventoryIcon() {
        return `
            <svg fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5zM6 9a1 1 0 112 0 1 1 0 01-2 0zm6 0a1 1 0 112 0 1 1 0 01-2 0z" clip-rule="evenodd"/>
            </svg>
        `;
    }

    getCampaignsIcon() {
        return `
            <svg fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
            </svg>
        `;
    }

    getReportsIcon() {
        return `
            <svg fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
            </svg>
        `;
    }

    getSGKIcon() {
        return `
            <svg fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                <path fill-rule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/>
            </svg>
        `;
    }

    getAutomationIcon() {
        return `
            <svg fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/>
            </svg>
        `;
    }

    getSettingsIcon() {
        return `
            <svg fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.532 1.532 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.532 1.532 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/>
            </svg>
        `;
    }
}

// Global sidebar toggle function
window.toggleSidebar = function() {
    const sidebar = document.querySelector('.sidebar-nav');
    const mainContent = document.querySelector('.main-content');
    
    if (sidebar) {
        sidebar.classList.toggle('collapsed');
        const isCollapsed = sidebar.classList.contains('collapsed');
        
        // Save state to localStorage
        localStorage.setItem('sidebarCollapsed', isCollapsed);
        
        // Update main content margin
        if (mainContent) {
            if (isCollapsed) {
                mainContent.style.marginLeft = '80px';
            } else {
                mainContent.style.marginLeft = '240px';
            }
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SidebarWidget;
} else {
    window.SidebarWidget = SidebarWidget;
}