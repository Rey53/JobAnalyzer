# Product Requirements Document (PRD)

## 1. Product Context
**Product Name:** MiniMed Personal Timesheet Application  
**Version:** 1.0 (Live via Dokploy)  
**Industry:** Pharmaceutical/Medical Device (Validation Services)  
**Region:** Puerto Rico  

## 2. Problem Statement
Professional contractors spend excessive unbillable time tracking hours, calculating strict tax retentions manually (Puerto Rico Hacienda vs Federal FICA/Medicare), tracking Year-To-Date (YTD) limits, and manually generating summary emails. Excel sheets often break, miscalculate, or fail to enforce proper chronological time entry. 

## 3. Product Vision & Goals
Deliver a frictionless, 24/7 accessible web application that:
1. Eliminates mental calculation of hours and taxes.
2. Ensures 100% accurate enforcement of PR-specific tax rules (10% Withholding) and the critical $500 exemption threshold.
3. Completely automates the delivery of professional reporting via n8n integration.
4. Maintains an exceedingly premium aesthetic to reflect professional standards.

## 4. Key Features & Requirements

### 4.1. Access Control
- **Authorization:** Must present an uninterrupted full-screen login barrier.
- **Branding:** Must display custom company logo.

### 4.2. Time Management
- **Grid:** Mandated Monday – Sunday visual layout.
- **Intervals:** Restricted 15-minute lockouts (`08:00`, `08:15`, etc.).
- **Validation:** Chronological locking (`Start` < `Lunch Out` < `Lunch In` < `End`) handling edge cases.
- **Visuals:** Visual indicators (Green/Red/Warning) when hours are calculated vs missing.

### 4.3. Financial Calculator (Rules Engine)
- **Gross Calculation:** `Total Hours x Rate` (Note: $53/hr is used for internal calculation but is **hidden** in UI labels).
- **Hacienda Rule (PR):** 10% retention. Critical exception: The first $500 of YTD accumulated Gross Pay is completely exempt from the 10% retention.
- **Federal Rule:** 12.4% strictly for Social Security. 2.9% strictly for Medicare. Applied flatly to overall Gross.
- **Persistence:** Local Storage must track `Previous YTD Gross`, `Previous YTD Net`, `Current Timesheet Number`.

### 4.4. Automation & Data Pipelines (n8n/Supabase)
- **Webhook Interface:** Automatically bundle all calculations into a structured JSON payload upon user signature.
- **Email Injection:** Dynamically construct a highly-designed, HTML snippet of the entire timesheet directly inside the browser JS, pushing it as `emailHtml` into n8n to bypass all formatting engines.
- **Fallback Mechanism:** Generate a seamless `mailto:` fallback link containing structured plaintext if the webhook endpoint crashes.

## 5. Technology Stack
- **Frontend:** Vanilla HTML5 / CSS3 / ES6 Javascript (Zero dependencies, incredibly fast execution).
- **Backend Automation:** n8n (Webhook handling, Data routing, Gmail execution).
- **Database:** Supabase (Remote JSON payload archiving).
- **Infrastructure & Hosting:** Nginx via Docker, orchestrated and deployed via Dokploy targeting `myts.servicioxpert.com`. Version control via GitHub (`main` branch).

## 6. Success Metrics
- 0% manual calculation errors in submitting timesheets.
- Sub-1-second render and calculation times.
- 100% uptime through static Dokploy Nginx hosting.
- Seamless email delivery on every payload submission.
