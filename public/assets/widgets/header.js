// Header Widget
class HeaderWidget {
    constructor(title = '', showUserInfo = true) {
        this.title = title;
        this.showUserInfo = showUserInfo;
    }

    render() {
        return `
            <header class="bg-white border-b border-gray-200 px-6 py-4">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900">${this.title}</h1>
                    </div>
                    ${this.showUserInfo ? this.renderUserInfo() : ''}
                </div>
            </header>
        `;
    }

    renderUserInfo() {
        return `
            <div class="flex items-center space-x-4">
                <div class="flex items-center space-x-3">
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%232563EB'/%3E%3Ctext x='16' y='21' text-anchor='middle' fill='white' font-family='Arial' font-size='14' font-weight='bold'%3EA%3C/text%3E%3C/svg%3E" alt="User" class="w-8 h-8 rounded-full">
                    <span class="text-sm font-medium text-gray-700">Admin User</span>
                </div>
            </div>
        `;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeaderWidget;
} else {
    window.HeaderWidget = HeaderWidget;
}