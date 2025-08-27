# X-Ear CRM - Project Details

## Project Overview

X-Ear CRM is a comprehensive Customer Relationship Management system specifically designed for audiology clinics and hearing aid centers. This MVP focuses on creating a production-ready prototype using static HTML pages with Tailwind CSS and vanilla JavaScript, optimized for desktop use (1440×1024).

## Business Context & Customer Journey

The system supports the complete patient journey in an audiology practice:

1. **Lead Generation**: Patients come from advertisements (signage, Facebook ads)
2. **Initial Contact**: Manual registration and phone outreach
3. **Assessment**: Hearing tests and ear examinations with detailed notes
4. **Device Trial**: Fitting appropriate hearing aids based on hearing loss
5. **Pricing**: Providing quotes after successful trials
6. **Purchase**: Recording device and payment information
7. **SGK Processing**: Managing insurance reports (battery and device reports)
8. **Delivery**: Device fitting and patient education
9. **Follow-up**: Scheduled controls (1, 3, 6 months) and annual battery report renewals
10. **Lifecycle Management**: 5-year device renewal tracking

### Patient Prioritization System
- **High Priority**: Patients who tried devices, received pricing, but haven't purchased
- **Segmented Marketing**: SMS campaigns targeting specific patient groups (trial-no-purchase, limbo/priority, no-shows, unreachable, financially unsuitable)

## Technical Specifications

### Technology Stack
- **Frontend**: Static HTML5 pages (≤500 lines each)
- **CSS**: Tailwind CSS (CDN)
- **JavaScript**: Vanilla ES6 (no build process)
- **Fonts**: Inter (Google Fonts)
- **Icons**: Lucide/Heroicons (inline SVG)
- **Storage**: localStorage for saved views and preferences

### Design System
- **Theme**: Light theme only
- **Target Resolution**: 1440×1024 (desktop-focused)
- **Color Palette**:
  - Primary: #2563EB
  - Success: #16A34A
  - Warning: #F59E0B
  - Danger: #DC2626
  - Info: #0EA5E9
  - Text: #111827
  - Secondary Text: #6B7280
  - Border: #E5E7EB
  - Surface: #FFFFFF
  - Background: #F9FAFB

### Accessibility
- Keyboard navigation support
- Focus rings on interactive elements
- ARIA attributes for screen readers
- Semantic HTML structure

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

## Core Features by Page

### 1. Dashboard (dashboard.html)
**Key Performance Indicators (Clickable)**:
- Today's Appointments
- Devices Sold This Month
- Overdue Payments
- New Leads (7 days)
- Pending SGK Approvals
- Critical Stock Levels

**Patient Funnel**: Visual representation of conversion stages
**Today's Timeline**: Appointment schedule
**Stock Alerts**: Low/critical inventory warnings
**Quick SMS**: Segment-based messaging
**Recent Patients**: Latest patient activities

### 2. Patients (patients.html)
**Search & Filters**:
- Name/phone search
- Tags, status, test results
- Trial status, pricing given
- Sales completion, branch
- Date ranges

**Saved Views**: localStorage-based custom filters
**Bulk Actions**: Tag management, SMS campaigns, CSV export
**Priority Indicators**: High-potential patient highlighting

### 3. Patient Details (patient-details.html)
**Header Actions**: Appointment, device assignment, pricing, sales, SMS

**9 Tabs**:
1. **General**: Identity, timeline, recommendations
2. **Appointments**: Scheduling and status tracking
3. **Examination & Tests**: Audiogram uploads, hearing loss assessment
4. **Device Trials**: Model specifications, trial results
5. **Purchases**: Stock selection, compatibility warnings
6. **Payments**: Payment plans, installment tracking
7. **Documents**: Reports, prescriptions, invoices
8. **Returns/Exchanges**: Device lifecycle management
9. **Communication**: Call logs, SMS history

### 4. Appointments (appointments.html)
**View Options**: Day/Week/List
**Quick Add**: Right panel form
**Filters**: Branch, specialist, status, test completion
**Drag & Drop**: Link to external calendar if needed

### 5. Inventory (inventory.html)
**View Modes**: Unit-based vs Model-based
**Filters**: Model, channels, battery type, branch, status
**Reserve Flow**: Patient purchase integration
**Stock Alerts**: Low inventory thresholds
**Compatibility Matrix**: Alternative device suggestions

### 6. SMS Campaigns (sms-campaign.html)
**Audience Builder**: Tag and status combinations
**Template Variables**: {Name}, {AppointmentDate}, {Branch}, {Link}
**Scheduling**: Immediate or planned delivery
**Metrics**: Campaign performance tracking

### 7. SGK (sgk.html)
**Report Tracking**: Battery and device reports
**Deadline Management**: Annual renewals, 5-year cycles
**Status Flow**: Preparation → Submission → Approval → Payment
**Export Options**: CSV/PDF generation

### 8. Reports (reports.html)
**Analytics**:
- Sales time series
- Conversion funnel analysis
- Branch/staff performance
- Return rates
- Payment delay heatmaps

### 9. Settings (settings.html)
**Configuration**:
- Tag dictionary
- Device model specifications
- Compatibility matrix
- Branch management
- Role-based access control

## Navigation & URL Structure

### Query Parameters
- `patients.html?view=trial_no_purchase` - Pre-filtered views
- `patients.html?tag=no_show` - Tag-based filtering
- `appointments.html?date=today&view=day` - Date/view combinations
- `inventory.html?alert=critical` - Alert-based filtering

### Keyboard Shortcuts
- `⌘/Ctrl+K`: Global search
- `N`: New patient
- `S`: Save forms
- `G`: Go to dashboard
- `F`: Toggle filters

## Data Schema (Mock)

```javascript
window.DEMO = {
  patients: [{
    id, name, phone, tcNumber, tags: [], 
    status, lastCall, branch, 
    controlDate, leadScore
  }],
  appointments: [{
    id, patientId, dateISO, 
    status, type, branch
  }],
  inventory: {
    units: [{
      id, serial, barcode, modelId, channels, 
      battery, branch, status, 
      reservedForPatientId
    }],
    models: [{
      id, name, mount, maxOutput, 
      channels, battery, 
      compatWith: [modelId]
    }]
  },
  sgk: {
    pendingReports: [{
      patientId, type, dateISO, status
    }]
  }
};
```

## UI States & Components

### Standard States
- **Loading**: Skeleton rows
- **Empty**: Icon + description + CTA
- **Error**: Warning banner + retry option

### Component Patterns
- **KPI Cards**: `rounded-xl border bg-white p-4 shadow`
- **Chips**: `h-8 px-3 rounded-full text-xs`
- **Tables**: `min-w-full text-sm divide-y`
- **Funnel**: CSS width-based 5-stage visualization

## Shared JavaScript Functions (app.js)

### Core Utilities
- `readQuery()`: URL parameter parsing
- `applyFilters(list, filters)`: Client-side filtering
- `navigateWithFilter(url, params)`: URL generation
- `SavedViews`: localStorage management
- `renderChips()`: Segment chip rendering
- `showToast()`, `confirmDialog()`: UI feedback

## Acceptance Criteria

### Technical Requirements
- [ ] All HTML files ≤500 lines
- [ ] Consistent sidebar + topbar across pages
- [ ] Working search and branch selector
- [ ] Dashboard KPI click-through with URL parameters
- [ ] localStorage-based saved views in patients page
- [ ] SGK report fields in patient details
- [ ] Inventory reserve flow with alternatives
- [ ] Appointment view switching (Day/Week/List)
- [ ] Loading/Empty/Error states in all lists
- [ ] Functional keyboard shortcuts

### Business Requirements
- [ ] Complete patient journey workflow
- [ ] Priority patient identification
- [ ] SMS campaign segmentation
- [ ] Stock compatibility warnings
- [ ] SGK report deadline tracking
- [ ] Multi-branch support
- [ ] Device lifecycle management

## Development Notes

### Constraints
- No build process required
- Mock actions (console.log + toast notifications)
- Light theme only
- Desktop-optimized (1440×1024)
- Turkish business context with English UI labels

### Code Organization
- Shared functions in `app.js`
- Mock data in `data.js`
- Minimal custom CSS in `style.css`
- Consistent layout patterns to minimize code duplication

This specification provides a complete blueprint for developing a production-ready audiology CRM prototype that addresses real business needs while maintaining technical simplicity and development efficiency.