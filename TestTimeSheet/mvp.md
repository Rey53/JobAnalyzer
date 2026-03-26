# Minimal Viable Product (MVP) Plan & Process

## Project Overview
**Product Name:** MiniMed Personal Timesheet Application
**Target Audience:** Independent Contractors in Puerto Rico (specifically Professional Services like Sr. Quality Engineers)
**Goal:** Replace a manual, error-prone Excel timesheet with a beautiful, automated, web-based tool that accurately calculates hours, strictly applies PR & Federal tax withholdings, and natively syncs with backend automation via n8n.

## MVP Scope (Completed Phase 1)

**1. Core User Interface**
- Single-page application (HTML/CSS/JS).
- Sleek, modern, dark-mode design with premium aesthetics (glassmorphism, subtle animations).
- Responsive layout prioritizing usability for daily entry.

**2. Authentication Layer**
- Simple overlay intercepting application load.
- Hardcoded basic authorization (`EqvalAdmin` / `Eqval2026!`).
- Branding injected (dynamic company logo).

**3. Data Entry & Validation**
- 7-day grid (Monday – Sunday) with 15-minute interval selection.
- Strict chronological validation (Start < Lunch Out < Lunch In < End).
- Auto-calculation of daily hours, skipping breaks.
- Tracking of metadata (Professional, Client, Title, Week Starting, Supervisor, PO Code, TS Number).
- Support for detailed daily task descriptions.

**4. Financial & Tax Engine**
- **Rate:** Flat $53.00/hr.
- **Hacienda (PR) Withholding:** 10% applied strictly on accumulated income beyond the first $500 exemption threshold.
- **Federal Withholdings:** Social Security (12.4%) and Medicare (2.9%) applied to Gross Pay.
- **YTD Tracking:** Local Storage-based caching to track Accumulated Gross and Accumulated Net Pay across submittals securely.

**5. Seamless Integration & Rollover**
- Webhook submission to `n8n`.
- Generates a beautifully styled, raw HTML email string dynamically to bypass n8n formatting bugs.
- Automated generation of JSON payloads with robust data mapping.
- Roll Over function to clear hours, advance the week by 7 days, shift YTD values, increment TS Numbers, and prep the board without wiping essential user data.

## Iteration History & Deployments
*   *Iteration 1:* Replicating the Excel sheet calculation behaviors via local JavaScript.
*   *Iteration 2:* Adjusting YTD calculations and exemption behaviors (Hacienda $500 PR rules).
*   *Iteration 3:* Overhauling HTML logic structure; integrating Docker & Dokploy for remote hosting.
*   *Iteration 4:* Creating the n8n webhook payload pipeline, resolving schema formatting errors.
*   *Iteration 5:* Hardening security with overlay authentication and locking down static variables.

## Future MVP Expansions (Phase 2 - Optional)
- **Database Scaling:** Migrate YTD data from `localStorage` into persistent `Supabase` records tied to sessions.
- **Authentication Scaling:** Implement OAuth or Supabase Auth to replace the hardcoded front-end layer.
- **PDF Generation:** Add the ability to generate and export signed PDF timesheets instantly via the UI.
- **Approvals Workflow:** In-app Supervisor sign-off interface instead of static email dispatch.
