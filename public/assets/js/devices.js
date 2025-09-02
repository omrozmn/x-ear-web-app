/**
 * Devices Manager - Handles hearing aid device management
 * Manages device inventory, trials, assignments, and patient device history
 */
class DevicesManager {
    constructor() {
        this.devices = this.loadDevices();
        this.deviceTrials = this.loadDeviceTrials();
        this.deviceAssignments = this.loadDeviceAssignments();
        this.deviceTypes = [
            { id: 'bte', name: 'BTE (Kulak Arkası)', description: 'Behind-the-Ear' },
            { id: 'ite', name: 'ITE (Kulak İçi)', description: 'In-the-Ear' },
            { id: 'itc', name: 'ITC (Kanal İçi)', description: 'In-the-Canal' },
            { id: 'cic', name: 'CIC (Tamamen Kanal İçi)', description: 'Completely-in-Canal' },
            { id: 'ric', name: 'RIC (Alıcı Kanal İçi)', description: 'Receiver-in-Canal' },
            { id: 'baha', name: 'BAHA (Kemik İletimi)', description: 'Bone Anchored Hearing Aid' }
        ];
        this.deviceBrands = [
            'Phonak', 'Oticon', 'Widex', 'Signia', 'ReSound', 'Starkey', 'Unitron', 'Bernafon'
        ];
    }

    /**
     * Load devices from localStorage
     */
    loadDevices() {
        try {
            const data = localStorage.getItem('devices');
            return data ? JSON.parse(data) : this.getDefaultDevices();
        } catch (error) {
            console.error('Error loading devices:', error);
            return this.getDefaultDevices();
        }
    }

    /**
     * Load device trials from localStorage
     */
    loadDeviceTrials() {
        try {
            const data = localStorage.getItem('deviceTrials');
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading device trials:', error);
            return [];
        }
    }

    /**
     * Load device assignments from localStorage
     */
    loadDeviceAssignments() {
        try {
            const data = localStorage.getItem('deviceAssignments');
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading device assignments:', error);
            return [];
        }
    }

    /**
     * Save devices to localStorage
     */
    saveDevices() {
        try {
            localStorage.setItem('devices', JSON.stringify(this.devices));
        } catch (error) {
            console.error('Error saving devices:', error);
        }
    }

    /**
     * Save device trials to localStorage
     */
    saveDeviceTrials() {
        try {
            localStorage.setItem('deviceTrials', JSON.stringify(this.deviceTrials));
        } catch (error) {
            console.error('Error saving device trials:', error);
        }
    }

    /**
     * Save device assignments to localStorage
     */
    saveDeviceAssignments() {
        try {
            localStorage.setItem('deviceAssignments', JSON.stringify(this.deviceAssignments));
        } catch (error) {
            console.error('Error saving device assignments:', error);
        }
    }

    /**
     * Get default device inventory
     */
    getDefaultDevices() {
        return [
            {
                id: 'phonak-audeo-p90',
                brand: 'Phonak',
                model: 'Audeo Paradise P90',
                type: 'ric',
                price: 15000,
                stock: 5,
                features: ['Bluetooth', 'Rechargeable', 'Waterproof'],
                description: 'Premium RIC hearing aid with advanced features'
            },
            {
                id: 'oticon-more-1',
                brand: 'Oticon',
                model: 'More 1',
                type: 'ric',
                price: 14500,
                stock: 3,
                features: ['Deep Neural Network', 'Bluetooth', 'Rechargeable'],
                description: 'AI-powered hearing aid with natural sound processing'
            },
            {
                id: 'widex-moment-440',
                brand: 'Widex',
                model: 'Moment 440',
                type: 'ric',
                price: 13500,
                stock: 4,
                features: ['PureSound', 'Bluetooth', 'Rechargeable'],
                description: 'Natural sound experience with zero delay'
            }
        ];
    }

    /**
     * Get all devices
     * @returns {Array} All devices
     */
    getAllDevices() {
        return this.devices;
    }

    /**
     * Get device by ID
     * @param {string} deviceId - Device ID
     * @returns {Object} Device information
     */
    getDevice(deviceId) {
        return this.devices.find(device => device.id === deviceId);
    }

    /**
     * Get devices by type
     * @param {string} type - Device type
     * @returns {Array} Devices of specified type
     */
    getDevicesByType(type) {
        return this.devices.filter(device => device.type === type);
    }

    /**
     * Get devices by brand
     * @param {string} brand - Device brand
     * @returns {Array} Devices of specified brand
     */
    getDevicesByBrand(brand) {
        return this.devices.filter(device => device.brand === brand);
    }

    /**
     * Start a device trial for a patient
     * @param {Object} trialData - Trial information
     * @returns {Object} Created trial
     */
    startDeviceTrial(trialData) {
        const trial = {
            id: Utils.generateUniqueId(),
            patientId: trialData.patientId,
            patientName: trialData.patientName,
            deviceId: trialData.deviceId,
            deviceInfo: this.getDevice(trialData.deviceId),
            side: trialData.side, // 'left', 'right', 'bilateral'
            startDate: trialData.startDate || new Date().toISOString().split('T')[0],
            endDate: trialData.endDate,
            status: 'active', // active, completed, cancelled
            notes: trialData.notes || '',
            outcome: null, // purchased, returned, extended
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.deviceTrials.push(trial);
        this.saveDeviceTrials();
        
        return trial;
    }

    /**
     * Complete a device trial
     * @param {string} trialId - Trial ID
     * @param {string} outcome - Trial outcome
     * @param {string} notes - Additional notes
     * @returns {Object} Updated trial
     */
    completeDeviceTrial(trialId, outcome, notes = '') {
        const trial = this.deviceTrials.find(t => t.id === trialId);
        
        if (!trial) {
            throw new Error('Trial not found');
        }
        
        trial.status = 'completed';
        trial.outcome = outcome;
        trial.endDate = new Date().toISOString().split('T')[0];
        trial.notes = notes;
        trial.updatedAt = new Date().toISOString();
        
        this.saveDeviceTrials();
        
        // If purchased, create device assignment
        if (outcome === 'purchased') {
            this.createDeviceAssignmentFromTrial(trial);
        }
        
        return trial;
    }

    /**
     * Create device assignment from trial
     * @param {Object} trial - Completed trial
     * @returns {Object} Created assignment
     */
    createDeviceAssignmentFromTrial(trial) {
        const assignmentData = {
            patientId: trial.patientId,
            patientName: trial.patientName,
            deviceId: trial.deviceId,
            side: trial.side,
            price: trial.deviceInfo.price,
            quantity: trial.side === 'bilateral' ? 2 : 1,
            notes: `Converted from trial: ${trial.id}`
        };
        
        return this.assignDeviceToPatient(assignmentData);
    }

    /**
     * Assign device to patient
     * @param {Object} assignmentData - Assignment information
     * @returns {Object} Created assignment
     */
    assignDeviceToPatient(assignmentData) {
        const assignment = {
            id: Utils.generateUniqueId(),
            patientId: assignmentData.patientId,
            patientName: assignmentData.patientName,
            deviceId: assignmentData.deviceId,
            deviceInfo: this.getDevice(assignmentData.deviceId),
            side: assignmentData.side,
            price: assignmentData.price,
            quantity: assignmentData.quantity || 1,
            totalPrice: assignmentData.price * (assignmentData.quantity || 1),
            assignmentDate: new Date().toISOString().split('T')[0],
            warrantyEndDate: this.calculateWarrantyEndDate(),
            status: 'active', // active, warranty_expired, replaced
            notes: assignmentData.notes || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.deviceAssignments.push(assignment);
        this.saveDeviceAssignments();
        
        // Update device stock
        this.updateDeviceStock(assignmentData.deviceId, -assignment.quantity);
        
        return assignment;
    }

    /**
     * Calculate warranty end date (typically 2 years)
     * @returns {string} Warranty end date
     */
    calculateWarrantyEndDate() {
        const warrantyDate = new Date();
        warrantyDate.setFullYear(warrantyDate.getFullYear() + 2);
        return warrantyDate.toISOString().split('T')[0];
    }

    /**
     * Update device stock
     * @param {string} deviceId - Device ID
     * @param {number} change - Stock change (positive or negative)
     */
    updateDeviceStock(deviceId, change) {
        const device = this.getDevice(deviceId);
        if (device) {
            device.stock = Math.max(0, device.stock + change);
            this.saveDevices();
        }
    }

    /**
     * Get patient device trials
     * @param {string} patientId - Patient ID
     * @returns {Array} Patient trials
     */
    getPatientTrials(patientId) {
        return this.deviceTrials
            .filter(trial => trial.patientId === patientId)
            .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    }

    /**
     * Get patient device assignments
     * @param {string} patientId - Patient ID
     * @returns {Array} Patient assignments
     */
    getPatientAssignments(patientId) {
        return this.deviceAssignments
            .filter(assignment => assignment.patientId === patientId)
            .sort((a, b) => new Date(b.assignmentDate) - new Date(a.assignmentDate));
    }

    /**
     * Get active device trials
     * @returns {Array} Active trials
     */
    getActiveTrials() {
        return this.deviceTrials.filter(trial => trial.status === 'active');
    }

    /**
     * Get devices with low stock
     * @param {number} threshold - Stock threshold
     * @returns {Array} Devices with low stock
     */
    getLowStockDevices(threshold = 2) {
        return this.devices.filter(device => device.stock <= threshold);
    }

    /**
     * Get device statistics
     * @returns {Object} Device statistics
     */
    getDeviceStatistics() {
        const stats = {
            totalDevices: this.devices.length,
            totalStock: this.devices.reduce((sum, device) => sum + device.stock, 0),
            lowStockDevices: this.getLowStockDevices().length,
            activeTrials: this.getActiveTrials().length,
            totalAssignments: this.deviceAssignments.length,
            totalRevenue: this.deviceAssignments.reduce((sum, assignment) => sum + assignment.totalPrice, 0),
            byBrand: {},
            byType: {}
        };
        
        // Calculate by brand
        this.devices.forEach(device => {
            stats.byBrand[device.brand] = (stats.byBrand[device.brand] || 0) + device.stock;
        });
        
        // Calculate by type
        this.devices.forEach(device => {
            const typeName = this.getDeviceTypeName(device.type);
            stats.byType[typeName] = (stats.byType[typeName] || 0) + device.stock;
        });
        
        return stats;
    }

    /**
     * Get device type name
     * @param {string} typeId - Device type ID
     * @returns {string} Device type name
     */
    getDeviceTypeName(typeId) {
        const type = this.deviceTypes.find(t => t.id === typeId);
        return type ? type.name : typeId;
    }

    /**
     * Search devices
     * @param {string} query - Search query
     * @returns {Array} Matching devices
     */
    searchDevices(query) {
        const searchTerm = query.toLowerCase();
        
        return this.devices.filter(device => 
            device.brand.toLowerCase().includes(searchTerm) ||
            device.model.toLowerCase().includes(searchTerm) ||
            device.features.some(feature => feature.toLowerCase().includes(searchTerm))
        );
    }

    /**
     * Add new device to inventory
     * @param {Object} deviceData - Device information
     * @returns {Object} Created device
     */
    addDevice(deviceData) {
        const device = {
            id: Utils.generateUniqueId(),
            brand: deviceData.brand,
            model: deviceData.model,
            type: deviceData.type,
            price: deviceData.price,
            stock: deviceData.stock || 0,
            features: deviceData.features || [],
            description: deviceData.description || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.devices.push(device);
        this.saveDevices();
        
        return device;
    }

    /**
     * Update device information
     * @param {string} deviceId - Device ID
     * @param {Object} updates - Updates to apply
     * @returns {Object} Updated device
     */
    updateDevice(deviceId, updates) {
        const device = this.getDevice(deviceId);
        
        if (!device) {
            throw new Error('Device not found');
        }
        
        Object.assign(device, updates, { updatedAt: new Date().toISOString() });
        this.saveDevices();
        
        return device;
    }

    /**
     * Remove device from inventory
     * @param {string} deviceId - Device ID
     * @returns {boolean} Success status
     */
    removeDevice(deviceId) {
        const index = this.devices.findIndex(device => device.id === deviceId);
        
        if (index === -1) {
            return false;
        }
        
        this.devices.splice(index, 1);
        this.saveDevices();
        
        return true;
    }

    /**
     * Export devices data
     * @returns {string} JSON string of devices data
     */
    exportDevicesData() {
        return JSON.stringify({
            devices: this.devices,
            trials: this.deviceTrials,
            assignments: this.deviceAssignments
        }, null, 2);
    }

    /**
     * Import devices data
     * @param {string} jsonData - JSON string of devices data
     * @returns {boolean} Success status
     */
    importDevicesData(jsonData) {
        try {
            const importedData = JSON.parse(jsonData);
            
            if (importedData.devices) {
                this.devices = [...this.devices, ...importedData.devices];
                this.saveDevices();
            }
            
            if (importedData.trials) {
                this.deviceTrials = [...this.deviceTrials, ...importedData.trials];
                this.saveDeviceTrials();
            }
            
            if (importedData.assignments) {
                this.deviceAssignments = [...this.deviceAssignments, ...importedData.assignments];
                this.saveDeviceAssignments();
            }
            
            return true;
        } catch (error) {
            console.error('Error importing devices data:', error);
            return false;
        }
    }
}

// Initialize Devices Manager
const devicesManager = new DevicesManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DevicesManager;
}