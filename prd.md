# Project Requirements Document (PRD) - MiniMed Personal Timesheet

## 1. Project Overview
The **MiniMed Personal Timesheet Application** is a professional, web-based tool designed to replace manual Excel tracking for independent contractors. It provides a premium UI for logging hours, calculating complex Puerto Rico-specific tax retentions, and automating the submission of reports via email.

## 2. Objectives
- **Modern UI/UX:** A glassmorphism-inspired, responsive dashboard that feels premium and interactive.
- **Accuracy:** Precise calculation of total hours, gross pay at $53/hr, PR 10% Withholding, and Estimated Self-Employment tax (15.3%).
- **Persistence:** Bi-directional synchronization between local storage (for speed) and a self-hosted Supabase instance (for reliability).
- **Automation:** One-click submission to an n8n workflow for HTML email delivery.
- **Stability:** Robust state management to handle week transitions and data lookups without crashes.

## 3. Core Features
- **Authentication:** Secure login via Supabase Auth with an emergency bypass (Admin).
- **Weekly Tracking:** Week-by-week navigation with automatic date adjustment to Mondays.
- **Daily Detail:** Time entry (Start, Lunch, End) with automatic hour calculation and full-width work descriptions.
- **Financial Dashboard:** Real-time summary of Weekly and YTD earnings, retentions, and estimated net pay.
- **Export:** High-quality PDF generation for local records.
- **Sync Status:** Visual indicator for Supabase synchronization health.

## 4. Technical Stack
- **Frontend:** React 18, Vite, Framer Motion, Lucide React.
- **Backend:** Supabase (Self-hosted on Dokploy).
- **Automation:** n8n Webhooks.
- **Styling:** Vanilla CSS with modern tokens (Glassmorphism, Vibrant Palettes).

## 5. Success Criteria
- Zero runtime crashes during week navigation.
- Consistent numeric formatting across all devices.
- Successful delivery of automated email reports.
- Accurate persistence of data across sessions and logouts.
