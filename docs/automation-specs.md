# X-Ear CRM — Automation Specifications

**Implementation-Ready Automation Rules for Maximum Workload Reduction**

## Overview

This document defines the automated workflows that will significantly reduce manual workload in X-Ear CRM. Each automation includes triggers, actions, ownership, communication channels, and success metrics.

## Patient Identity Management

### TC Identity Number Integration
- **Primary Key**: Turkish Citizenship (TC) Identity Number alongside phone number
- **Purpose**: Main identifier for connecting patient information across systems
- **Validation**: 11-digit TC number validation with checksum algorithm
- **Usage**: Patient lookup, duplicate prevention, SGK integration

## Core Automation Rules

### 1. No-Show Recovery
**Trigger**: Appointment marked as "No-show" OR not checked in by +15 minutes past appointment time

**Actions**:
- Tag patient with `no_show`
- Create call task for Reception team (due: next business day)
- Send SMS with reschedule link
- Add patient to "No-show" segment for targeted campaigns

**Channel**: In-app task notification + SMS
**Owner**: Reception team
**KPIs**: 
- No-show → rebook conversion rate
- Average time-to-rebook
- No-show rate reduction

**SMS Template**: 
```
"We missed you today at X-Ear. Reschedule in 10s: {link}"
```

### 2. Trial + Price Given → No Sale Follow-up
**Trigger**: Device trial exists AND priceGiven=true AND no sale recorded within 7 days

**Actions**:
- Tag patient with `high_priority`
- Schedule follow-up call task (due: 48 hours)
- Add to "Tried–Not Purchased" segment
- Show offer template in Quick SMS dashboard
- Create personalized discount offer (if configured)

**Channel**: In-app task + SMS template
**Owner**: Sales team
**KPIs**:
- Conversion rate of "Tried–Not Purchased" segment
- Pipeline aging metrics
- Revenue recovery from follow-ups

**SMS Template**:
```
"How did the hearing aid trial feel? We can tailor options & financing. Reply 1 for a callback."
```

### 3. Post-Purchase Clinical Controls (Auto-Generated Appointments)
**Trigger**: Sale/purchase completed successfully

**Actions**:
- Auto-create follow-up appointments at +30 days, +90 days, +180 days
- Send SMS reminder 24 hours before each appointment
- Create calendar blocks for clinical staff
- Set appointment type as "Control Visit"
- Link appointments to original device sale

**Channel**: In-app calendar + SMS reminders
**Owner**: Clinical staff
**KPIs**:
- Control appointment attendance rate
- Device return/complaint reduction
- Patient satisfaction scores

**SMS Template**:
```
"Your {device_model} control visit is tomorrow at {time}. Confirm: {link}"
```

### 4. Annual Battery Report Renewal
**Trigger**: Battery report due date exists AND next renewal due in ≤30 days

**Actions**:
- Create task for clinical staff
- Send SMS to patient with booking link
- Tag patient with `battery_due`
- Add to battery renewal campaign segment
- Set reminder escalation if no response in 7 days

**Channel**: In-app task + SMS + email (optional)
**Owner**: Clinical staff
**KPIs**:
- On-time renewal percentage
- Revenue from battery report renewals
- SGK compliance rate

**SMS Template**:
```
"Your annual battery report is due. Pick a time: {link}"
```

### 5. Inventory Reserve & Alternatives
**Trigger**: Attempt to assign device that is out of stock or not yet received

**Actions**:
- Mark requested model as backordered
- Display compatible alternatives panel
- Optionally reserve best alternative match
- Notify inventory manager
- Create purchase order suggestion if stock critically low

**Channel**: In-app modal + notification
**Owner**: Inventory manager
**KPIs**:
- Time-to-fulfill orders
- Percentage of orders fulfilled without delay
- Customer satisfaction with alternatives

### 6. Overdue Installment Recovery
**Trigger**: Installment due date < today AND paid=false

**Actions**:
- Tag patient with `overdue`
- Send SMS payment reminder with secure link
- Create task for Finance team after 3rd failed SMS attempt
- Escalate to phone call if overdue >14 days
- Generate payment plan renegotiation options

**Channel**: SMS → In-app task → Phone call
**Owner**: Finance team
**KPIs**:
- Days Sales Outstanding (DSO)
- Payment recovery rate
- Customer retention despite overdue

**SMS Template**:
```
"Reminder: an installment is overdue. Pay securely: {link}"
```

### 7. SGK Report Status Tracking
**Trigger**: Patient requires device/battery report AND status ≠ "paid"

**Actions**:
- Progress through status stages: preparing → submitted → pending → paid
- Send reminders when stalled (e.g., pending >10 days)
- Create tasks for document preparation
- Alert when SGK deadlines approach
- Generate compliance reports

**Channel**: In-app notifications + daily digest
**Owner**: Administrative staff
**KPIs**:
- Average days to SGK payment
- Number of stuck/delayed reports
- SGK compliance percentage

### 8. Lead Source Intake → Call Queue
**Trigger**: New lead created from ads/signboard/referral

**Actions**:
- Create call task within 24 hours
- Assign to available sales representative
- Track contact attempts (max 3)
- If no contact after 3 attempts: tag `could_not_reach`, move to nurture segment
- Log lead source for ROI tracking

**Channel**: In-app task queue
**Owner**: Sales team
**KPIs**:
- First-contact SLA compliance
- Lead-to-contact conversion rate
- Lead source ROI analysis

### 9. Duplicate Detection & Merge Suggestions
**Trigger**: New patient entry with same TC number, phone, or fuzzy-matched name

**Actions**:
- Flag potential duplicate
- Suggest merge with confidence score
- Present side-by-side comparison
- Log merge decision for audit
- Update all related records if merged

**Channel**: In-app alert during patient creation
**Owner**: Data entry staff
**KPIs**:
- Duplicate rate per 100 patients
- Data quality score
- Time saved on duplicate cleanup

### 10. Five-Year Device Renewal Campaign
**Trigger**: 5 years since device purchase, starting at -60 days and -30 days

**Actions**:
- Create renewal opportunity task
- Send educational SMS/email series about new technology
- Offer trade-in evaluation
- Schedule consultation appointment
- Generate financing options

**Channel**: SMS + Email + In-app task
**Owner**: Sales team
**KPIs**:
- 5-year renewal conversion rate
- Average upgrade revenue
- Customer lifetime value

### 11. Daily Operational Digest
**Trigger**: Every day at 08:30

**Actions**:
- Generate summary report: today's appointments, overdue installments, critical stock, pending SGK items, priority follow-ups
- Send to relevant team members
- Create dashboard alerts for urgent items
- Update KPI metrics

**Channel**: Email + In-app inbox
**Owner**: Management team
**KPIs**:
- Task completion rate by noon
- Operational efficiency metrics
- Team productivity scores

### 12. Consent-Aware Communication
**Trigger**: Attempt to send SMS/email without recorded consent

**Actions**:
- Block communication attempt
- Show opt-in template
- Log blocked attempt for compliance
- Suggest alternative communication method
- Update consent status when obtained

**Channel**: In-app warning + compliance log
**Owner**: Marketing/Communications team
**KPIs**:
- Consent opt-in rate
- Compliance violation prevention
- Communication deliverability

## Implementation Framework

### Rule Engine Structure (JSON-based)

```javascript
const AUTOMATION_RULES = [
  {
    id: "no_show_recovery",
    priority: "high",
    when: (patient, context) => {
      return patient.lastAppointment?.status === "no_show" ||
             (patient.lastAppointment?.status === "scheduled" && 
              context.minutesPast(patient.lastAppointment.dateTime) > 15);
    },
    then: (patient, context) => {
      context.tag(patient.id, "no_show");
      context.task.create({
        assignee: "reception",
        due: "D+1",
        title: "Rebook no-show patient",
        patientRef: patient.id
      });
      context.sms.send(patient.id, "no_show_reschedule");
      context.segment.add("no_show", patient.id);
    }
  },
  
  {
    id: "trial_price_no_sale",
    priority: "high",
    when: (patient, context) => {
      return patient.deviceTrial && 
             patient.priceGiven && 
             !patient.sale && 
             context.daysSince(patient.trialDate) >= 7;
    },
    then: (patient, context) => {
      context.tag(patient.id, "high_priority");
      context.task.create({
        assignee: "sales",
        due: "D+2",
        title: "Follow up: trial+price, no sale",
        patientRef: patient.id
      });
      context.segment.add("tried_not_purchased", patient.id);
    }
  },
  
  {
    id: "post_purchase_controls",
    priority: "medium",
    when: (sale, context) => {
      return sale.status === "completed" && sale.deviceType === "hearing_aid";
    },
    then: (sale, context) => {
      [30, 90, 180].forEach(days => {
        context.appointment.create({
          patientId: sale.patientId,
          type: "control_visit",
          scheduledDate: context.addDays(sale.completedDate, days),
          duration: 30,
          notes: `${days}-day control for ${sale.deviceModel}`
        });
        
        context.sms.schedule({
          patientId: sale.patientId,
          template: "control_reminder",
          sendDate: context.addDays(sale.completedDate, days - 1)
        });
      });
    }
  },
  
  {
    id: "battery_renewal_reminder",
    priority: "medium",
    when: (patient, context) => {
      return patient.batteryReportDue && 
             context.daysUntil(patient.batteryReportDue) <= 30;
    },
    then: (patient, context) => {
      context.tag(patient.id, "battery_due");
      context.task.create({
        assignee: "clinic",
        due: "D+1",
        title: "Process battery report renewal",
        patientRef: patient.id
      });
      context.sms.send(patient.id, "battery_renewal");
    }
  }
];
```

### SMS Template Library

```javascript
const SMS_TEMPLATES = {
  no_show_reschedule: "We missed you today at X-Ear. Reschedule in 10s: {reschedule_link}",
  trial_followup: "How did the hearing aid trial feel? We can tailor options & financing. Reply 1 for a callback.",
  control_reminder: "Your {device_model} control visit is tomorrow at {appointment_time}. Confirm: {confirm_link}",
  battery_renewal: "Your annual battery report is due. Pick a time: {booking_link}",
  payment_overdue: "Reminder: an installment is overdue. Pay securely: {payment_link}",
  device_renewal: "It's been 5 years since your hearing aid purchase. See what's new: {catalog_link}"
};
```

## Impact Assessment

### Quick Impact Matrix

| Automation | Implementation Effort | Business Impact | Priority |
|------------|----------------------|-----------------|----------|
| No-show recovery | Low | High | 1 |
| Trial+Price→No sale | Low | High | 2 |
| Post-purchase controls | Low | High | 3 |
| Battery renewal | Low | High | 4 |
| Installment chasing | Low-Medium | High | 5 |
| Inventory alternatives | Medium | Medium-High | 6 |
| SGK tracking | Medium | High | 7 |
| Lead intake | Low | Medium | 8 |
| Daily digest | Low | Medium | 9 |
| Device renewal | Medium | High | 10 |

### Expected ROI

**High-Impact Automations (Implement First)**:
1. **No-show recovery**: 15-25% reduction in no-shows, 20% increase in rebookings
2. **Trial follow-up**: 10-15% increase in conversion from trial to sale
3. **Auto-generated controls**: 30% improvement in follow-up compliance, reduced returns
4. **Battery renewals**: 95%+ compliance with SGK requirements, steady revenue stream

**Medium-Impact Automations (Phase 2)**:
5. **Payment recovery**: 20-30% faster payment collection, reduced bad debt
6. **Inventory management**: 50% reduction in stockouts, improved customer satisfaction
7. **SGK tracking**: 100% compliance, faster reimbursements

## Technical Implementation Notes

### Data Requirements
- **Patient TC Numbers**: 11-digit validation with checksum
- **Appointment timestamps**: Precise scheduling for automation triggers
- **Device serial tracking**: Full lifecycle from stock to patient to renewal
- **Communication consent**: GDPR/KVKK compliant opt-in tracking
- **Task management**: Assignment, due dates, escalation rules

### Integration Points
- **SMS Gateway**: Bulk messaging with template support
- **Calendar System**: Appointment creation and reminder scheduling
- **Payment Gateway**: Secure payment links and status tracking
- **SGK API**: Report submission and status monitoring (if available)
- **Inventory System**: Stock levels and compatibility matrix

### Performance Considerations
- **Rule evaluation**: Efficient triggers to avoid system slowdown
- **Batch processing**: Daily/hourly automation runs for non-urgent items
- **Error handling**: Graceful failures with manual fallback options
- **Audit logging**: Complete trail of automated actions for compliance

This automation framework will significantly reduce manual workload while improving patient care quality and business efficiency across all aspects of the audiology practice.