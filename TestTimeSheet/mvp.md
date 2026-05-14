# Minimum Viable Product (MVP) - MiniMed Personal Timesheet

## 1. Scope
The MVP focuses on providing a stable, production-ready environment for a single user (independent contractor) to track hours for an entire month without data loss or crashes.

## 2. Mandatory Features for MVP
- **Login/Logout:** Securely access stateful data.
- **Data Persistence:** Automatically save data to Supabase every 5 seconds or upon edit.
- **Week Switching:** Flawless transition between weeks (Monday-to-Monday selection).
- **Hour Calculation:** Correct calculation of daily segments (Start, Lunch, End).
- **Financial Breakdown:** Accurate 10% PR Withholding logic for payments.
- **n8n Integration:** Successfully send a JSON payload to the production webhook.
- **Responsive Layout:** Viewing and editing on both desktop and mobile devices without major layout breakage.

## 3. Exclusions (Post-MVP)
- Multi-user collaboration (current setup is personal/single-identity focus).
- Advanced project tracking (multiple projects per day).
- Direct Supabase RLS policies (relying on Auth and single-table simplicity for now).

## 4. Current Progress
- [x] Basic UI and State Logic.
- [x] Supabase SH Integration.
- [x] n8n Webhook connection.
- [x] Layout refinement (Work Description row).
- [x] Critical crash fixes (Date navigation).
- [ ] Final production environment validation on Dokploy.
