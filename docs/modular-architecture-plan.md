# X-Ear Web App - Modular Architecture Plan

## Current Structure Issues
- All JavaScript scattered in `/public/assets/js/`
- Large monolithic files (sgk-document-pipeline.js is 3000+ lines)
- Mixed concerns in single files
- Hard to maintain and debug
- No clear separation between pages and shared utilities

## Proposed Modular Structure

### 1. Page-Based Modules
Each page gets its own module folder with all related functionality:

```
/public/modules/
├── dashboard/
│   ├── dashboard-core.js           # Main dashboard logic
│   ├── dashboard-widgets.js        # Widget management
│   ├── dashboard-stats.js          # Statistics calculations
│   └── dashboard.css               # Page-specific styles
│
├── patients/
│   ├── patients-core.js            # Main patients page logic
│   ├── patients-search.js          # Patient search functionality
│   ├── patients-list.js            # Patient list management
│   ├── patients-details.js         # Patient details view
│   └── patients.css                # Page-specific styles
│
├── sgk/
│   ├── sgk-core.js                 # Main SGK page controller
│   ├── sgk-upload.js               # File upload handling
│   ├── sgk-patient-matcher.js      # Patient matching logic
│   ├── sgk-document-classifier.js  # Document type detection
│   ├── sgk-ocr-processor.js        # OCR processing
│   ├── sgk-pipeline.js             # Processing pipeline
│   ├── sgk-ui-components.js        # UI components and rendering
│   └── sgk.css                     # Page-specific styles
│
├── automation/
│   ├── automation-core.js          # Main automation logic
│   ├── automation-rules.js         # Rules engine
│   ├── automation-engine.js        # Processing engine
│   └── automation.css              # Page-specific styles
│
├── inventory/
│   ├── inventory-core.js           # Main inventory logic
│   ├── inventory-management.js     # Stock management
│   └── inventory.css               # Page-specific styles
│
├── campaigns/
│   ├── campaigns-core.js           # SMS campaign management
│   ├── campaigns-sms.js            # SMS handling
│   └── campaigns.css               # Page-specific styles
│
└── reports/
    ├── reports-core.js             # Main reports logic
    ├── reports-generator.js        # Report generation
    └── reports.css                 # Page-specific styles
```

### 2. Shared Utilities
Common functionality used across multiple pages:

```
/public/shared/
├── core/
│   ├── app-core.js                 # Core app initialization
│   ├── router.js                   # Page routing (if needed)
│   └── config.js                   # App configuration
│
├── ui/
│   ├── modal.js                    # Modal component
│   ├── table.js                    # Table component  
│   ├── sidebar.js                  # Sidebar component
│   ├── header.js                   # Header component
│   └── notifications.js            # Toast/alert system
│
├── data/
│   ├── patient-database.js         # Patient data management
│   ├── local-storage.js            # LocalStorage utilities
│   └── data-export-import.js       # Data import/export
│
├── utils/
│   ├── file-utils.js               # File handling utilities
│   ├── date-utils.js               # Date formatting
│   ├── validation.js               # Form validation
│   └── helpers.js                  # General helpers
│
├── ocr/
│   ├── ocr-engine.js               # Core OCR functionality
│   ├── image-processor.js          # Image preprocessing
│   └── pdf-converter.js            # PDF conversion
│
└── styles/
    ├── base.css                    # Base styles
    ├── components.css              # Shared component styles
    └── layout.css                  # Layout utilities
```

### 3. Integration Services
Services that integrate with external systems:

```
/public/services/
├── spacy-client.js                 # SpaCy backend integration
├── email-service.js                # Email functionality
├── sms-gateway.js                  # SMS integration
└── api-client.js                   # General API client
```

## Implementation Benefits

### 1. Maintainability
- **Single Responsibility**: Each file has one clear purpose
- **Easy Location**: Know exactly where to find/fix functionality
- **Reduced Complexity**: Smaller, focused files instead of monoliths

### 2. Development Efficiency
- **Parallel Development**: Multiple developers can work on different modules
- **Testing**: Each module can be tested independently
- **Debugging**: Easier to isolate issues to specific modules

### 3. Code Reusability
- **Shared Components**: UI components used across pages
- **Common Utilities**: Utility functions available everywhere
- **Consistent Patterns**: Similar structure across all pages

### 4. Performance
- **Lazy Loading**: Load only modules needed for current page
- **Smaller Bundles**: Reduced initial page load
- **Caching**: Better browser caching of individual modules

## Migration Strategy

### Phase 1: Create Structure
1. Create new directory structure
2. Set up module loader system
3. Create shared utilities first

### Phase 2: Extract Page Modules
1. Start with SGK page (most complex)
2. Move to patients page
3. Continue with remaining pages

### Phase 3: Optimize and Clean
1. Remove duplicate code
2. Optimize module loading
3. Add proper error handling
4. Update documentation

## Module Loading System

Each page will have a simple loader:

```javascript
// In sgk.html
<script>
window.SGK = {};
Promise.all([
    loadModule('/public/modules/sgk/sgk-core.js'),
    loadModule('/public/modules/sgk/sgk-patient-matcher.js'),
    loadModule('/public/modules/sgk/sgk-ocr-processor.js'),
    // ... other modules
]).then(() => {
    SGK.core.initialize();
});
</script>
```

## File Naming Convention
- **Core files**: `[page]-core.js` - Main page controller
- **Feature files**: `[page]-[feature].js` - Specific functionality
- **Shared files**: `[type].js` - Utility/shared functionality
- **Styles**: `[page].css` or `[component].css`

This modular approach will make the codebase much more maintainable and easier to work with!
