# Knowledge Base - MiniMed Personal Timesheet

## 1. Project Context
This application is designed for independent contractors in Puerto Rico who need professional tracking and reporting for payroll submission every Tuesday before 5 PM.

## 2. Key Architecture Decisions
- **Custom Hook `useTimesheet.js`:** Encapsulates all state (Professional Info, Entries) and Supabase synchronization logic.
- **Bi-directional Sync:** The application uses `localStorage` for primary state and synchronizes with Supabase every time data is edited.
- **Week Logic:** Every week must start on a Monday. Dates for entries (Tue-Sun) are calculated relative to this Monday.

## 3. Critical Fixes and "Gotchas"
### Date Navigation
- **Crash Prevention:** When the `Week Starting` date changes, the application must immediately re-calculate entry dates and initialize new default entries only if none exist for that week.
- **Safety:** Always use optional chaining (`?.`) when accessing `totals` or `profInfo` to prevent runtime crashes during state transitions.

### UI Consistency
- **Trembling Layout:** Numeric inputs and displays should use `tabular-nums` in CSS and `toFixed(2)` in Javascript to prevent visual jitter.
- **Work Description:** Positioned in a full-width row (`desc-row`) below each time entry for better readability without horizontal scrolling.

## 4. Maintenance / Operations
- **n8n Endpoint:** `https://n8ncon.servicioxpert.com/webhook/timesheet-send`
- **Supabase SH:** Hosted via Dokploy on private VPS.
- **Rate:** Standardized at $53.00/hr.

## 5. Frequently Asked Questions (FAQ)
- **Q:** How do I start a new week?  
  **A:** Use the "Next Week" (▶) or "Previous Week" (◀) arrows next to the page title. The system will automatically auto-save your current state, transition to the chosen week, decrement/increment the Timesheet number, and seamlessly carry-over / retrieve your accumulated YTD totals. You can also pick a Monday in the `Week Starting` date picker.
- **Q:** Why did my screen go blank?  
  **A:** This was a previous stability issue related to date navigation, now resolved with robust state lookups and initialization guards.
- **Q:** How do I send my timesheet?  
  **A:** Use the "Send via n8n Automation" button at the bottom. Ensure all required fields (Name, Company, Week Start, Recipient Email) are filled.
