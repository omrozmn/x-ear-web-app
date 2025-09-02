/**
 * Simple Module Loader for X-Ear Web App
 * Provides dynamic loading of JavaScript modules
 */

window.ModuleLoader = {
    loadedModules: new Set(),
    
    /**
     * Load a single JavaScript module
     * @param {string} modulePath - Path to the module file
     * @returns {Promise} - Resolves when module is loaded
     */
    async loadModule(modulePath) {
        return new Promise((resolve, reject) => {
            // Check if already loaded
            if (this.loadedModules.has(modulePath)) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = modulePath;
            script.async = true;
            
            script.onload = () => {
                this.loadedModules.add(modulePath);
                console.log(`✅ Module loaded: ${modulePath}`);
                resolve();
            };
            
            script.onerror = () => {
                console.error(`❌ Failed to load module: ${modulePath}`);
                reject(new Error(`Failed to load module: ${modulePath}`));
            };
            
            document.head.appendChild(script);
        });
    },
    
    /**
     * Load multiple modules in parallel
     * @param {string[]} modulePaths - Array of module paths
     * @returns {Promise} - Resolves when all modules are loaded
     */
    async loadModules(modulePaths) {
        const loadPromises = modulePaths.map(path => this.loadModule(path));
        return Promise.all(loadPromises);
    },
    
    /**
     * Load modules for a specific page
     * @param {string} pageName - Name of the page (e.g., 'sgk', 'patients')
     * @param {string[]} modules - Array of module names for the page
     * @returns {Promise} - Resolves when all page modules are loaded
     */
    async loadPageModules(pageName, modules) {
        const modulePaths = modules.map(module => `/public/modules/${pageName}/${module}.js`);
        return this.loadModules(modulePaths);
    },
    
    /**
     * Load shared utilities
     * @param {string[]} utilities - Array of utility names
     * @returns {Promise} - Resolves when all utilities are loaded
     */
    async loadSharedUtilities(utilities) {
        const utilityPaths = utilities.map(util => `/public/shared/utils/${util}.js`);
        return this.loadModules(utilityPaths);
    }
};

// Make it globally available
window.loadModule = window.ModuleLoader.loadModule.bind(window.ModuleLoader);
window.loadModules = window.ModuleLoader.loadModules.bind(window.ModuleLoader);
window.loadPageModules = window.ModuleLoader.loadPageModules.bind(window.ModuleLoader);
window.loadSharedUtilities = window.ModuleLoader.loadSharedUtilities.bind(window.ModuleLoader);
