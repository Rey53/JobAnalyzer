# PharmaPace PR: MVP Scope & Definition

## 🚀 Minimum Viable Product (MVP) Status

The current implementation of PharmaPace PR has achieved Full MVP status, providing a functional end-to-end pipeline for Pharmaceutical Opportunity Analysis.

---

## 1. Targeted User Persona

- **Candidate**: Experienced Validation/CSV Engineers seeking fair compensation in Puerto Rico.
- **Recruiter**: Hiring managers needing data-driven justification for market-adjusted offers.

---

## 2. Core Functional Requirements (Completed)

### ✅ Job & CV Ingestion

- Upload PDF CVs.
- Manual entry of Company, Role, and Compensation details.

### ✅ Automated Market Analysis

- Integration with Gemini 1.5 for CV-to-Job matching.
- Implementation of the "Pharma Expert" prompt logic.

### ✅ Puerto Rico Specific Cost Logic

- Hardcoded localized benchmarks: Gas ($0.91/L), LUMA ($0.33/kWh).
- Miles-based distance and travel time estimation.

### ✅ Comparison Module

- W2 vs 1099 vs 480 conversion engine.
- Annual and Hourly breakdown displayed in a tripartite dashboard.

### ✅ Governance & Compliance

- ALCOA+ Standard header implementation.
- PDF Report generation with unique session ID and Contemporaneous Timestamp.

---

## 3. Success Metrics for MVP

- **Accuracy**: AI fit score matches professional experience within 90% confidence.
- **Performance**: Analysis result delivered in <15 seconds.
- **Usability**: Report is "Recruiter-Ready" with zero manual formatting needed.

---

## 4. MVP Out of Scope (For Future Versions)

- **Authentication**: No persistent user accounts (Session based).
- **Database**: No backend database (Stateless client-side processing).
- **Real-time API**: Tolls are estimates, not real-time Dynamic Pricing API calls.

---

## 5. Deployment Specs

- **Port**: Locally hosted on `5174`.
- **Environment**: `.env.local` for secure API Key management.
- **Protocol**: ALCOA+ verified for GxP regulated environments.
