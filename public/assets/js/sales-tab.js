/**
 * Sales Tab Module - Handles sales functionality for patient details
 */

class SalesTabManager {
    constructor() {
        this.sales = [];
        this.currentPatientId = null;
    }

    // Initialize the sales tab
    async initialize(patientId) {
        this.currentPatientId = patientId;
        await this.loadSalesData();
        this.attachEventListeners();
    }

    // Load sales data for the current patient
    async loadSalesData() {
        const salesTableBody = document.getElementById('salesTableBody');
        const noSalesMessage = document.getElementById('noSalesMessage');
        const totalSalesAmount = document.getElementById('totalSalesAmount');
        const monthlySalesAmount = document.getElementById('monthlySalesAmount');
        const totalSalesCount = document.getElementById('totalSalesCount');
        
        if (!salesTableBody) return;
        
        try {
            // Get sales data for current patient
            const sales = window.patientDetailsManager?.sales?.filter(sale => 
                sale.patientId === this.currentPatientId
            ) || [];
            
            this.sales = sales;
            
            // Clear existing content
            salesTableBody.innerHTML = '';
            
            if (sales.length === 0) {
                if (noSalesMessage) noSalesMessage.style.display = 'block';
                if (salesTableBody.parentElement.parentElement) {
                    salesTableBody.parentElement.parentElement.style.display = 'none';
                }
            } else {
                if (noSalesMessage) noSalesMessage.style.display = 'none';
                if (salesTableBody.parentElement.parentElement) {
                    salesTableBody.parentElement.parentElement.style.display = 'block';
                }
                
                // Sort sales by date (newest first)
                sales.sort((a, b) => new Date(b.date) - new Date(a.date));
                
                // Populate table
                sales.forEach(sale => {
                    const row = document.createElement('tr');
                    row.className = 'hover:bg-gray-50';
                    
                    const statusClass = this.getStatusClass(sale.status);
                    const statusText = this.getStatusText(sale.status);
                    
                    row.innerHTML = `
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${new Date(sale.date).toLocaleDateString('tr-TR')}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${sale.type || 'Genel'}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${sale.product || '-'}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${sale.quantity || 1}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₺${(sale.unitPrice || 0).toLocaleString('tr-TR', {minimumFractionDigits: 2})}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            %${sale.vat || 20}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ₺${(sale.total || 0).toLocaleString('tr-TR', {minimumFractionDigits: 2})}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 py-1 text-xs font-medium rounded-full ${statusClass}">
                                ${statusText}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div class="flex space-x-2">
                                <button onclick="salesTabManager.editSale('${sale.id}')" class="text-blue-600 hover:text-blue-900">
                                    Düzenle
                                </button>
                                <button onclick="salesTabManager.deleteSale('${sale.id}')" class="text-red-600 hover:text-red-900">
                                    Sil
                                </button>
                            </div>
                        </td>
                    `;
                    
                    salesTableBody.appendChild(row);
                });
            }
            
            // Update summary stats
            this.updateSummaryStats(sales);
            
        } catch (error) {
            console.error('Error loading sales data:', error);
        }
    }

    // Update summary statistics
    updateSummaryStats(sales) {
        const total = sales.reduce((sum, sale) => sum + (sale.total || 0), 0);
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthlyTotal = sales.filter(sale => {
            const saleDate = new Date(sale.date);
            return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
        }).reduce((sum, sale) => sum + (sale.total || 0), 0);
        
        const totalSalesAmount = document.getElementById('totalSalesAmount');
        const monthlySalesAmount = document.getElementById('monthlySalesAmount');
        const totalSalesCount = document.getElementById('totalSalesCount');
        
        if (totalSalesAmount) {
            totalSalesAmount.textContent = `₺${total.toLocaleString('tr-TR', {minimumFractionDigits: 2})}`;
        }
        
        if (monthlySalesAmount) {
            monthlySalesAmount.textContent = `₺${monthlyTotal.toLocaleString('tr-TR', {minimumFractionDigits: 2})}`;
        }
        
        if (totalSalesCount) {
            totalSalesCount.textContent = sales.length.toString();
        }
    }

    // Get status CSS class
    getStatusClass(status) {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            case 'refunded': return 'bg-gray-100 text-gray-800';
            default: return 'bg-blue-100 text-blue-800';
        }
    }

    // Get status text
    getStatusText(status) {
        switch (status) {
            case 'completed': return 'Tamamlandı';
            case 'pending': return 'Beklemede';
            case 'cancelled': return 'İptal Edildi';
            case 'refunded': return 'İade Edildi';
            default: return 'Bilinmiyor';
        }
    }

    // Attach event listeners
    attachEventListeners() {
        // Add any specific event listeners for the sales tab
    }

    // Create new sale
    createSale() {
        if (typeof salesManager !== 'undefined') {
            salesManager.openNewSaleModal();
        } else {
            console.error('Sales manager not available');
        }
    }

    // Edit sale
    editSale(saleId) {
        if (typeof salesManager !== 'undefined') {
            salesManager.editSale(saleId);
        } else {
            console.error('Sales manager not available');
        }
    }

    // Delete sale
    deleteSale(saleId) {
        if (confirm('Bu satışı silmek istediğinizden emin misiniz?')) {
            if (typeof salesManager !== 'undefined') {
                salesManager.deleteSale(saleId);
                this.loadSalesData(); // Refresh the list
            } else {
                console.error('Sales manager not available');
            }
        }
    }

    // Refresh sales data
    async refresh() {
        await this.loadSalesData();
    }
}

// Global instance
window.salesTabManager = new SalesTabManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SalesTabManager;
}
