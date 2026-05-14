# PharmaPace PR: Product Requirements Document (PRD)

## 1. Project Overview

**PharmaPace PR** is a specialized Salary & Opportunity Analyzer designed for the Puerto Rico Pharmaceutical and Industrial sector. It empowers job seekers and recruiters with data-driven insights to evaluate job offers, determine fair market value, and ensure long-term career sustainability in a high-cost environment (LUMA energy rates, localized inflation, and complex tax structures).

---

## 2. Core Problem & Solution

### Problem:

- **Cost of Living Volatility**: Rapidly changing utility rates (LUMA) and gas prices in PR often make traditional salary offers misleading.
- **Contract Complexity**: Candidates often struggle to compare W2 (Employee) vs. 1099 (Contractor) vs. Form 480 (Professional Services) offers.
- **Recruiter-Candidate Gap**: Lack of standardized benchmarks for specialized roles like GAMP5, CSV, and Validation Engineers.

### Solution:

A comprehensive dashboard that uses **Generative AI (Gemini)** and **Grounding Search** to provide real-time market analysis, commute cost breakdowns in miles, and tripartite salary comparisons.

---

## 3. Key Features

### A. Opportunity Analyzer

- **Company Intelligence**: AI-driven "Tier" classification (Tier 1 vs Tier 2) and latest financial performance insights.
- **Commute Cost Analysis**:
  - Calculated in **Miles (One Way & Round Trip)**.
  - Integrated PR-specific gasoline prices ($0.91/L benchmark).
  - Toll basis logic (PR-22, PR-52).
- **LUMA Utility Delta**: Specifically calculates the impact of residential energy rates ($0.33/kWh) on the net take-home value.

### B. Salary Benchmarks & Scoreboard

- **Executive Scoreboard**: Displays "Strategic Market Targets" based on a 10/10 Candidate Fit Score.
- **Employment Type Comparison**: Tripartite breakdown (W2 vs. 1099 vs. 480) for both Annual and Hourly rates.
- **Interactive Market Simulator**: A demonstration tool for recruiters to cross-reference multiple industry roles (Validation, QA, Automation).

### C. Technical Onboarding Plan

- **30-60-90 Day Strategy**: AI-generated technical roadmap focused on GMP training, site-specific safety, and CSV/CSA compliance.

---

## 4. Technical Workflow

1. **Data Acquisition**: USER inputs CV, Job Title, Company, and Locations.
2. **AI Processing**: Gemini 1.5 Pro analyzes the CV against specialized "Expert Pharma Recruiter" logic.
3. **Data Integrity (ALCOA+)**: The system applies ALCOA+ standards (Attributable, Legible, Contemporaneous, Original, Accurate), including a live "Contemporaneous Timestamp" and Unique System ID.
4. **Output**: Interactive Dashboard and a downloadable **Formal Analysis Report (PDF)**.

---

## 5. Technology Stack

- **Frontend**: React, Vite, Tailwind CSS.
- **Icons**: Lucide React.
- **AI Core**: Google Generative AI (Gemini 1.5).
- **Reporting**: jsPDF & html2canvas.
- **Deployment**: Localhost (5173/5174) with standard Git workflow.

---

## 6. Implementation Notes for Recruiter Presentation

- **The "Negotiation Gap"**: Presenters should show the difference between the **Strategic Target** (Market Value) and the **Offer Reality** (Current Offer) as a basis for negotiation.
- **Site Culture**: The analyzer accounts for regional differences between Metro (San Juan) and Southern (Ponce) hubs.

---

## 7. Future Roadmap (Instructions/FAQ context)

- **FAQ Section**: To be added as a tab, explaining the math behind the 1099 vs 480 conversion.
- **Act 60 Integration**: Further depth into the 4% tax benefits for residents of Puerto Rico under professional services.
- **Live Gas Feed**: Integration with PR consumer affairs (DACO) for real-time gas price updates.
