---
description: PayrollTimeSheetExpert
---

SKILL: PR-480 Professional Services Timesheet
Antigravity Memory Entries
---
🔑 Identity & Triggers
#1 — SKILL TRIGGER
```
SKILL:pr480-timesheet | Triggers: timesheet, log hours, 480, 480.6B, retención, invoice PR, EQVAL, professional services, withholding calc, billable hours, contractor hours PR.
```
#2 — CONTRACTOR
```
CONTRACTOR: Luis Reyes Morales | EQVAL Consulting Group Inc. | Sr. Quality Engineer (Contractor) | Mayagüez PR | Invoice prefix: EQVAL-INV- | Stack: antigravity/n8n/OpenClaw.
```
---
⚖️ Tax Law
#3 — TAX LAW
```
TAX LAW: PR IRC-2011 §1062.03 — 10% withholding at source by payor. If Registro de Comerciante invalid/expired → 15%. Payor issues Form 480.6B by Jan 31 of following year.
```
#4 — SC 2225 DUE DATES
```
SC 2225 DUE DATES: Q1→Apr 15 | Q2→Jun 15 | Q3→Sep 15 | Q4→Jan 15 (next yr). 10% withheld by client may NOT cover full PR income tax liability. Always consult CPA.
```
---
📋 Data Model
#5 — LOG REQUIRED FIELDS
```
LOG REQUIRED FIELDS: entry_id(TMS-YYYY-NNN) | date(YYYY-MM-DD) | client_name | project_code | task_group | task_item | task_description | start_time(HH:MM) | end_time | break_minutes | status.
```
#6 — CALCULATED FIELDS
```
CALCULATED FIELDS (auto): hours=(end-start)*24-(break/60) | gross=hours×rate | withholding=gross×0.10 | net=gross-withholding. Always 2 decimal places. Never estimate — use timestamps.
```
#7 — STATUS WORKFLOW
```
STATUS WORKFLOW: Draft → Submitted → Invoiced → Paid | Void. Update status on every action. All LOG rows for a period must be Submitted before invoice is generated.
```
---
🗂️ Task Taxonomy
#8 — TASK GROUPS A
```
TASK GROUPS A: Validation(CSV/CSA, IQ/OQ/PQ, URS/FRS, Protocol Review, Report Writing) | Quality Systems(CAPA, Change Control, Deviation, Periodic Review, Audit Support).
```
#9 — TASK GROUPS B
```
TASK GROUPS B: Risk Mgmt(ISO 14971, FMEA/FMECA, Risk Assessment) | Regulatory(21 CFR Pt 11, EU Annex 11, FDA Prep, 483 Response) | Automation(n8n, APEX Agent, Integration).
```
#10 — TASK GROUPS C
```
TASK GROUPS C: Project Mgmt(Client Meeting, Status Report, Planning/Scoping) | Administrative(Onboarding, Contracting/Legal, Invoicing). Use exact vocab for pivot reporting.
```
---
🔬 ALCOA+ Rules
#11 — ALCOA+ RULES A
```
ALCOA+ RULES A: Attributable=entry_id+name on every row | Legible=ISO date+24h time, no abbreviations | Contemporaneous=log same day or within 24h, never backfill a full week.
```
#12 — ALCOA+ RULES B
```
ALCOA+ RULES B: Original=LOG is master, never edit summaries | Accurate=timestamps not estimates, break deducted | Complete=no blank rows in submitted period | Consistent=same client name spelling.
```
#13 — ALCOA+ RULES C
```
ALCOA+ RULES C: Enduring=archive as locked PDF+locked tab, never delete rows | Available=workbook in Google Drive shared with CPA (view access).
```
---
📊 Workbook Structure
#14 — WORKBOOK TABS
```
WORKBOOK TABS: LOG(master entries) | WEEKLY | MONTHLY | BY_CLIENT(480.6B reconcile) | BY_PROJECT | INVOICE_BUILDER | CONFIG(rates/clients/constants) | ARCHIVE(locked paid periods).
```
#15 — CONFIG CELLS
```
CONFIG CELLS: B1=Contractor | B2=Entity | B3=Registro# | B4=Rate($85) | B5=Withholding(10%) | B6=FY start | B7=Invoice prefix. All formulas reference CONFIG — never hardcode rate.
```
#16 — SHEETS FORMULAS
```
SHEETS FORMULAS: Hours=IF(AND(D<>"",E<>""),(E-D)*24-(G/60),"") | Gross=F*VLOOKUP(C,CONFIG!$A:$B,2,FALSE) | Withholding=H*CONFIG!$B$5 | Net=H-I.
```
#17 — WEEKLY/MONTHLY FORMULA
```
WEEKLY/MONTHLY FORMULA: Use SUMIFS not SUMPRODUCT for date ranges. =SUMIFS(LOG!$J:$J,LOG!$B:$B,">="&DATE(y,m,d),LOG!$B:$B,"<="&DATE(ye,me,de)).
```
---
🧾 Invoice
#18 — INVOICE REQUIRED
```
INVOICE REQUIRED: Number(EQVAL-INV-YYYY-NNN) | Issue date | Service period | Contractor name/entity/Registro/EIN | Client legal name | Line items | Gross | 10% withheld | Net payable.
```
#19 — INVOICE LEGAL NOTE
```
INVOICE LEGAL NOTE: 'Subject to 10% income tax withholding per PR IRC-2011 §1062.03. Payor must remit to Hacienda and issue Form 480.6B by January 31 of following year.'
```
#20 — INVOICE CHECKLIST
```
INVOICE CHECKLIST: gross=SUM(LOG rows for period) | withholding=gross×10% | net=gross-withholding | client name=480.6B exact match | status=Submitted | PDF→Drive /Invoices/YYYY/Client/.
```
---
🤖 AI Behavior & Validation
#21 — AI BEHAVIOR
```
AI BEHAVIOR: date=YYYY-MM-DD | time=24h HH:MM | hours=2 decimals | apply 10% always | never estimate hours — ask for start/end | flag missing workdays | confirm client name vs 480.6B.
```
#22 — ERROR HANDLING
```
ERROR HANDLING: hours>12→flag | start>end→overnight split | client not in CONFIG→add first | break>hours→reject | status mismatch on invoice→alert | 480.6B variance→reconcile checklist.
```
#23 — 480.6B RECONCILIATION
```
480.6B RECONCILIATION: client_name in LOG must match payor name on 480.6B EXACTLY. BY_CLIENT tab: variance=YTD_gross_calculated − 480.6B_reported. Variance must be $0.00.
```
---
⚙️ Automation
#24 — N8N WEBHOOK
```
N8N WEBHOOK: POST /log-hours JSON: {date,client_name,project_code,task_category,task_description,start_time,end_time,break_minutes,hourly_rate,deliverable_ref,notes,status}.
```
#25 — N8N TRIGGERS
```
N8N TRIGGERS: Webhook /log-hours | Daily 5PM AST log reminder | Sheets new-row trigger | Mon 8AM weekly summary email | 1st-of-month CPA report | Gmail invoice draft on demand.
```
#26 — APPS SCRIPT
```
APPS SCRIPT: onEdit LOG col E (end_time) → hours=(end-start)*24-(break/60) | gross=hours*rate | withholding=gross*0.10 | net=gross-withholding → write to cols J,K,L,M.
```
---
📖 Glossary
#27 — GLOSSARY
```
GLOSSARY: 480.6B=payor informative return | §1062.03=10% withholding law | SC 2225=quarterly est. tax form | Hacienda=PR Treasury | Registro=merchant cert | AST=UTC-4 year-round.
```
---

#28 — DATABASE
DATABASE ALWAYS SAVE IN SUPABASE SELF HOSTED IN DOKPLOY, NEVER IN SUPABASE CLOUD
