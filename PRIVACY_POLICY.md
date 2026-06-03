# Privacy Policy

**Effective Date:** June 2, 2026  
**Last Updated:** June 2, 2026

## 1. Introduction

This Privacy Policy describes how the FITREP Evaluator (hereinafter "the Application") collects, uses, and protects information. This Application is a **Proof of Concept** tool designed to aid in military fitness report evaluation methodology using **synthetic data only**. It is not authorized to process, store, or transmit real Personally Identifiable Information (PII), Controlled Unclassified Information (CUI), or health information.

## 2. Scope and Applicability

This Privacy Policy applies to all users of the FITREP Evaluator PoC. By using this Application, you acknowledge that:

- You understand this is a proof-of-concept tool, not a system of record.
- You will not enter real Marine names, EDIPIs, ranks tied to identifiable individuals, evaluation periods, or performance narratives.
- You will use only the synthetic data fixture provided with this Application.

**If you cannot comply with these restrictions, you must not use this Application.**

## 3. Information We Collect

### 3.1 Form Input Data

When you use the evaluation methodology in the Application, you may enter the following information into web forms:

- **Marking Selections:** Your grade choices for trait evaluations (Does Not Meet, Meets, Surpasses)
- **Justification Text:** Narrative explanations of your marking decisions
- **Date Selections:** Reporting period date ranges
- **Section I Evaluations:** Written evaluations against synthetic evaluation criteria

### 3.2 Automatically Collected Technical Data

This Application does **not** automatically collect:

- Browser type, operating system, or device identifiers
- IP addresses or geolocation data
- Cookies or persistent identifiers
- Behavioral analytics or usage patterns
- Session tokens or authentication credentials

**Why?** All network calls (fetch, XMLHttpRequest, WebSocket) are blocked at the browser level. No telemetry is sent to any server.

## 4. Storage and Data Retention

### 4.1 In-Memory Storage Only

All information you enter into this Application is stored **in your browser's memory only** during your active session. No data is:

- Sent to any server
- Persisted to local storage (localStorage, sessionStorage, IndexedDB)
- Backed up to cloud services
- Retained after you close the browser tab or reload the page

### 4.2 Session Termination

Your data is automatically deleted when:

- You close the browser tab
- You reload the page
- You close your browser
- Your browser session expires (default: 30 minutes of inactivity)

**No archive, export, or recovery mechanism exists.** This is intentional. The Application does not retain or transmit user inputs.

## 5. How We Use Information

Any form inputs you enter are used **solely for the purpose of** this evaluation session in real-time. Specifically:

- To calculate trait grades based on your selection
- To display your justification text in the evaluation form
- To generate in-session reports (not persisted)

We do **not** use your information for:

- Marketing or profiling
- Sharing with third parties
- Long-term analytics
- Training machine learning models
- Any purpose beyond the active session

## 6. Third-Party Services and Data Sharing

**This Application does not integrate with, connect to, or share data with any third-party services, including but not limited to:**

- Cloud databases (Supabase, Firebase, AWS, Azure)
- Analytics platforms (Google Analytics, Mixpanel)
- Email or messaging services
- Payment processors
- Social media platforms
- Government systems (DADMS, DITPR-DON, Marine Corps databases)

**All computation occurs locally in your browser.** There is no backend server, no API calls, and no data transmission.

## 7. Data Subject Rights

### 7.1 Right to Access

Because the Application stores no persistent data, there is no data to access, retrieve, or export. Your session data exists only in memory and is deleted upon session termination.

### 7.2 Right to Deletion

Your session data is automatically deleted when your session ends. No action is required.

### 7.3 Right to Correction

Because data is not persisted, correction is not applicable. You may re-enter corrected information in a new session.

### 7.4 Right to Opt-Out

All data collection and persistence mechanisms (localStorage, sessionStorage, fetch, analytics) are disabled by default and cannot be enabled by users.

## 8. Synthetic Data Requirement

**You must use only the synthetic data fixture provided with this Application.**

The fixture contains fictional Marines with placeholder identifiers (e.g., "MARINE_ALPHA_01", "MARINE_BRAVO_02") and is the only acceptable input source.

**Entering real data is a violation of the PoC Charter and converts this tool into an unauthorized system processing government controlled information.** Violations trigger incident response procedures.

## 9. Synthetic Data Disclaimer

All data shown in the Application is **synthetic and for demonstration purposes only.** No real person, real rank, real unit, real evaluation period, or real performance narrative is represented in the fixture or in any output of this Application.

## 10. Security and Data Protection

### 10.1 In-Transit Security

Because no data is transmitted over the network, there is no in-transit encryption requirement. Your browser's memory is not encrypted.

### 10.2 Browser-Level Controls

The Application enforces the following security controls at the browser level:

- Network calls (fetch, XMLHttpRequest) are blocked
- localStorage and sessionStorage writes are blocked
- IndexedDB and cookie writes are blocked
- No external scripts or third-party code is loaded

### 10.3 User Responsibility

You are responsible for:

- Not entering real PII, CUI, or regulated information
- Using this Application in a secure environment (not on public computers)
- Not taking screenshots or exporting output containing real names

## 11. Policy Updates

This Privacy Policy may be updated at any time without notice. Changes take effect immediately upon posting to this document. Continued use of the Application after changes constitutes acceptance of the updated policy.

## 12. Limitation of Liability

**THIS APPLICATION IS PROVIDED "AS-IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.**

The Application developer makes no representation regarding:

- The accuracy, completeness, or reliability of the evaluation methodology
- The suitability of output for any specific purpose
- Compliance with any regulation, policy, or guideline

**You use this Application at your own risk.**

## 13. No Personal Data Sale or Sharing

Because this Application collects no persistent personal data, there is no data to sell, share, or license to third parties. This policy applies even if local law (e.g., CCPA) permits data sales; we do not engage in data sales.

## 14. Contact and Complaints

For privacy questions or complaints, contact the originating command identified in **PoC-CHARTER.md**. This is a developer-controlled proof-of-concept tool with no public-facing privacy office.

**This Application is not subject to standard Privacy Act procedures or FOIA requests.**

## 15. GDPR and CCPA Acknowledgments

### 15.1 GDPR (EU General Data Protection Regulation)

This Application is compliant with GDPR because:

- No personal data (in the GDPR sense) is collected or retained
- All inputs are deleted upon session termination
- No data is shared with third parties
- No automated decision-making or profiling occurs
- No cookies or tracking identifiers are used

### 15.2 CCPA / CPRA (California Consumer Privacy Act / California Privacy Rights Act)

This Application is compliant with CCPA/CPRA because:

- No personal information is sold, shared, or retained
- No data is retained for longer than the active session
- Users have implicit rights to deletion (automatic upon session termination)
- No "Do Not Sell My Personal Information" link is required because no data is sold or shared

---

**End of Privacy Policy**
