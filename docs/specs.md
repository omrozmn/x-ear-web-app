# X-Ear CRM — Project Brief & Front-End Specification (MVP)

**Single Source Document for Cursor Development**

## Goal & Constraints

**Objective**: Production-ready static HTML prototype for audiology clinic CRM
**Technology**: Tailwind CSS + vanilla JavaScript (no build process)
**Constraint**: Each HTML file ≤ 500 lines (including comments)
**Target**: Desktop-first (1440×1024), light theme, English UI

## Business Context — Patient Workflow

### Core Patient Journey
1. **Lead Generation**: Signboard/Facebook ads → manual list entry
2. **Initial Contact**: Phone outreach to prospects
3. **Assessment**: Hearing test + ear inspection + clinical notes
4. **Device Trial**: If hearing loss detected, trial appropriate hearing aids
5. **Pricing**: Quote pricing after successful trial
6. **Purchase Process**: Record device details, payment info, address, ID/phone
7. **SGK Documentation**: Track device report & battery report separately
8. **Manufacturing**: Ear mold → central lab → device preparation/mounting
9. **Delivery**: Device fitting + patient education
10. **Follow-up Schedule**: 1/3/6 month controls + annual battery report + 5-year device renewal
11. **Insurance Processing**: Enter reports into SGK system for reimbursement

### Patient Segmentation & Prioritization
- **High Priority**: "Tried–Not Purchased" (trial + pricing given + no purchase)
- **Follow-up Categories**: "On the Fence", "No-show", "Couldn't Reach", "Financially Unsuitable"
- **SMS Campaigns**: Targeted messaging by patient segment

### Inventory Management Requirements
- **Multi-brand Support**: Flexible system for different hearing aid manufacturers
- **Device Specifications**: Channels, battery type, mounting (ITE/BTE/BT), max output
- **Serial Number Tracking**: Individual device tracking with barcode support
- **Stock Control**: Batch purchasing, automatic decrement on assignment
- **Compatibility Matrix**: Alternative device suggestions (e.g., FORCE 200 ↔ FORCE 200 BT ↔ FORCE 200 ETH)
- **Stock Alerts**: Low inventory warnings with reorder suggestions

### Document Management & SGK Integration
- **Photo Upload**: Capture SGK documents (reports, prescriptions, audiometry, warranty)
- **PDF Generation**: Convert uploaded images to scanned PDFs for SGK system upload
- **Document Types**: Device reports, battery reports, prescriptions, audiometry results, warranties

## Technical Specifications

### Technology Stack
- **Frontend**: Static HTML5 (≤500 lines per file)
- **CSS**: Tailwind CSS (CDN)
- **JavaScript**: Vanilla ES6 (no build process)
- **Fonts**: Inter (Google Fonts)
- **Icons**: Inline SVG (Lucide/Heroicons) or emojis
- **Storage**: localStorage for saved views and preferences

### Design System
**Color Palette**:
- Primary: #2563EB
- Success: #16A34A  
- Warning: #F59E0B
- Danger: #DC2626
- Info: #0EA5E9
- Text: #111827
- Muted: #6B7280
- Border: #E5E7EB
- Surface: #FFFFFF
- Background: #F9FAFB

**Accessibility**:
- Keyboard navigation with focus rings
- ARIA attributes for screen readers
- Semantic HTML structure
- Tab order optimization

## File Structure

```
/public
  dashboard.html           # KPIs, funnel, timeline, alerts, quick SMS
  patients.html           # Patient list with filters and bulk actions
  patient-details.html    # Individual patient management (9 tabs)
  appointments.html       # Calendar views and scheduling
  inventory.html          # Stock management (unit/model-based)
  sms-campaign.html       # Campaign builder and management
  sgk.html               # Insurance report tracking
  reports.html           # Analytics and reporting
  settings.html          # System configuration

/assets
  app.js                 # Shared utilities and common functions
  data.js                # Mock data for development
  style.css              # Additional utility classes (≤100 lines)
```

## Navigation & URL Structure

### Multi-page Navigation
Full page transitions (no SPA architecture)

### Query Parameter Conventions
- `patients.html?view=trial_no_purchase` → Filter: Trial + Price Given + Not Purchased
- `patients.html?tag=no_show` → Filter by "No-show" tag
- `appointments.html?date=today&view=day` → Today's appointments in day view
- `inventory.html?alert=critical` → Critical stock levels

### Saved Views
- Storage: `localStorage['xe:patients:savedViews']` as JSON
- UI: Rendered as chip-tabs above filter controls

## Global Features

### Keyboard Shortcuts
- `⌘/Ctrl+K`: Global search (name/phone/serial/invoice)
- `N`: New Patient (modal or form navigation)
- `S`: Save forms
- `G`: Go to Dashboard
- `F`: Toggle Filters panel

### Common Components
- `showToast(type, msg)`: User feedback notifications
- `confirmDialog(msg, onYes)`: Confirmation dialogs
- Consistent sidebar + topbar across all pages

## Page-by-Page Specifications

### 1. Dashboard (dashboard.html)

**6 Clickable KPIs** (navigate to filtered pages):
- Today's Appointments
- Devices Sold (This Month)
- Overdue Installments
- New Leads (7 days)
- Pending SGK Approval
- Critical Stock

**Patient Funnel**: Visual conversion flow
- Ads → Called → Came → Trial → Price Given → Sale
- Click any stage to filter patients list

**Additional Components**:
- Appointment Timeline (Today): Time slot list
- Stock Alerts: Model/branch with Low/Critical badges
- Quick SMS: Segment chips + textarea + Send (mock)
- Recent Patients: Name, Phone (tel: link), Tags, Status, Last Call, Branch, Control Date, Actions

### 2. Patients List (patients.html)

**Search & Filters**:
- Search: Name/phone
- Tag filtering
- Status: Came/No-show/Purchased/Not Purchased
- Hearing Test: Present/Absent, Loss Present/Absent
- Device Trial: Y/N
- Price Given: Y/N
- Sale: Y/N
- Branch selection
- Date range picker

**Features**:
- Saved Views: Chip-tabs (localStorage)
- Bulk Actions: Add/Remove Tag, Send SMS, Export CSV, Set Follow-up Date
- Priority Badge: Auto-display for "Trial + Price Given + Not Purchased"

### 3. Patient Details (patient-details.html)

**Header Actions** (always visible):
- Add Appointment
- Assign Device
- Give Price
- Create Sale
- Send SMS

**9 Tabs**:

1. **General**: Identity fields + activity timeline + recommendations
2. **Appointments**: List + new appointment form; status chips (Planned/Came/No-show/Canceled)
3. **Exam & Test**: Audiogram upload/grid; "Any loss?" (Y/N) → if Yes, show "Start Device Trial" CTA
4. **Device Trial**: Table (Model, Channels, Max Output, Battery, Result, Price Given Y/N, Notes) + "Proceed to Purchase" CTA
5. **Purchase**: Stock selection by serial (filter by model/channels/battery); out-of-stock alert + compatible alternatives
6. **Payments**: Summary (total/paid/due) + installment plan table (due date, amount, paid/overdue status)
7. **Documents**: Device report, battery report, promissory note, prescription, invoice (list + upload UI with photo capture)
8. **Returns/Exchange**: Old device → stock; new device → patient
9. **Communication**: Call/SMS logs + template management

**SGK Tracking Integration**:
- Device & battery report status (Y/N + dates)
- Task creation for 1/3/6-month controls
- Annual battery report renewal reminders

### 4. Appointments (appointments.html)

**View Options**: Day / Week / List (toggle buttons)
**Quick Add**: Right panel form
**Filters**: Branch, clinician, status (Came/No-show), test/trial performed
**Drag & Drop**: Link to external calendar view (?view=week)

### 5. Inventory (inventory.html)

**View Modes**: Unit-based / Model-based tabs
**Filters**: Model, Channels, Battery Type, Branch, Status (in-stock/reserved/sold/in-service)
**Reserve Flow**: Mark units reserved from Patient→Purchase; show compatible alternatives if unavailable
**Stock Management**: Low-stock thresholds per model with reorder alerts
**Barcode Support**: Serial number entry with barcode scanning capability

### 6. SMS Campaigns (sms-campaign.html)

**Audience Builder**: Segment by tags/statuses
- Appointment scheduled
- Couldn't reach
- Financially constrained
- Will consult family
- Custom tag combinations

**Template Manager**: Variables {FirstName}, {AppointmentDate}, {Branch}, {Link}
**Scheduling**: Immediate or scheduled delivery
**Metrics**: Campaign performance tracking (mock)

### 7. SGK (sgk.html)

**Report Queues**: Pending device/battery reports
**Due Renewals**: Annual battery reports, 5-year device renewals
**Status Flow**: Preparing → Entered → Pending Approval → Paid
**Export Options**: CSV/PDF generation (mock)
**Document Processing**: Photo-to-PDF conversion for SGK uploads

### 8. Reports (reports.html)

**Analytics Dashboards**:
- Sales time series
- Appointment trends
- Funnel conversion rates
- Branch/clinician performance
- Top-selling models
- Return rates
- Overdue payment heatmaps

### 9. Settings (settings.html)

**Configuration Management**:
- Tag glossary
- Device model specifications (channels, battery, mounting, max output)
- Compatibility matrix
- Branch management
- Role-based access control (RBAC)

## UI States & Components

### Standard States (all lists/tables)
- **Loading**: Skeleton rows
- **Empty**: Icon + explanation + primary CTA
- **Error**: Warning banner + Retry button

### Component Patterns
- **KPI Cards**: `rounded-xl border border-[#E5E7EB] bg-white p-4 shadow hover:shadow-md`
- **Chips**: `h-8 px-3 rounded-full text-xs` (semantic background/foreground)
- **Tables**: `min-w-full text-sm` with `border-b` headers and `divide-y` rows
- **Funnel**: 5 trapezoid bars via CSS widths
- **Topbar**: Search + Branch select + Date picker + Notifications + Avatar (all focusable)

## Shared JavaScript Functions (app.js)

### Core Utilities
- `readQuery()`: Parse URL parameters to object
- `applyFilters(list, filters)`: Client-side filtering engine
- `navigateWithFilter(url, params)`: URL generation and navigation
- `SavedViews`: `load()`, `save(name, config)`, `remove(name)`
- `renderChips(container, items, onClick)`: Segment chip rendering
- `showToast(type, msg)`, `confirmDialog(msg, onYes)`: UI feedback
- Keyboard shortcut handlers: ⌘/Ctrl+K, N, S, G, F

## Mock Data Schema (data.js)

```javascript
window.DEMO = {
  patients: [
    // { id, name, phone, tags:[], status, lastCallISO, branch, controlDateISO, leadScore }
  ],
  appointments: [
    // { id, patientId, dateISO, status, type, branch }
  ],
  inventory: {
    units: [
      // { id, serial, barcode, modelId, channels, battery, branch, status, reservedForPatientId }
    ],
    models: [
      // { id, name, mount, maxOutput, channels, battery, compatWith:[modelId] }
    ]
  },
  sgk: { 
    pendingReports: [
      // { patientId, type, dateISO, status }
    ] 
  }
};
```

## Acceptance Criteria

### Technical Requirements
- [ ] All HTML files ≤ 500 lines
- [ ] Consistent sidebar + topbar across all pages
- [ ] Functional search and branch selector
- [ ] Dashboard KPI click-through with URL parameters
- [ ] localStorage-based saved views in patients page
- [ ] SGK device & battery report fields in patient details
- [ ] Inventory reserve flow with compatible alternatives
- [ ] Appointment view switching (Day/Week/List) with Quick Add
- [ ] Loading/Empty/Error states in all lists
- [ ] Active keyboard shortcuts: ⌘/Ctrl+K, N, S, G, F

### Business Requirements
- [ ] Complete patient journey workflow support
- [ ] Priority patient identification and segmentation
- [ ] SMS campaign audience building
- [ ] Stock compatibility warnings and alternatives
- [ ] SGK report deadline tracking
- [ ] Multi-branch support throughout
- [ ] Device lifecycle management (5-year renewal tracking)
- [ ] Document photo capture and PDF conversion capability
- [ ] Serial number and barcode tracking for hearing aids

## Development Notes

### Implementation Approach
- Mock actions with `console.log` + toast notifications
- Light theme consistency across all pages
- Shared layout patterns to minimize code duplication
- Focus on desktop experience (1440×1024 optimization)

### Code Organization
- Shared utilities in `app.js`
- Mock data centralized in `data.js`
- Minimal custom CSS in `style.css` (≤100 lines)
- Consistent component patterns and spacing tokens

This specification provides a complete blueprint for developing a production-ready audiology CRM prototype that addresses the specific needs of Turkish hearing aid centers while maintaining technical simplicity and development efficiency.