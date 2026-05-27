# UNITED STATES MARINE CORPS

[INSERT ORIGINATING COMMAND HEADER]
[INSERT ORGANIZATION ADDRESS LINE 1]
[INSERT ORGANIZATION ADDRESS LINE 2]

                                                                            IN REPLY REFER TO:
                                                                            5230
                                                                            [INSERT CODE]
                                                                            [INSERT DATE OF SIGNATURE]

## MEMORANDUM FOR THE RECORD

From: [INSERT ORIGINATOR NAME, RANK, BILLET]
To:   Distribution List

Subj: PROOF OF CONCEPT CHARTER FOR THE FITNESS REPORT EVALUATOR (FITREP-E) METHODOLOGY AID

Ref:  (a) MCO 5239.2B, Marine Corps Cybersecurity
      (b) DoDI 8510.01, Risk Management Framework for DoD Information Technology
      (c) MCO 5211.5, Marine Corps Privacy Program
      (d) DoDI 5200.48, Controlled Unclassified Information
      (e) MCO 5230.21, Performance of Commercial Activities by the Marine Corps
      (f) Privacy Act of 1974, 5 U.S.C. Section 552a
      (g) 44 U.S.C. Section 3301, Records Management by Federal Agencies
      (h) FISMA, Federal Information Security Modernization Act of 2014
      (i) Clinger-Cohen Act of 1996

Encl: (1) Reference architecture for PoC artifact
      (2) Synthetic data fixture index
      (3) Compliance audit findings dated 2026-05-26

---

### 1. Purpose

This memorandum establishes the Fitness Report Evaluator, referred to throughout as FITREP-E, as a time-limited, sponsorship-pending Proof of Concept under references (a) through (i). This charter sets the boundary conditions under which FITREP-E is permitted to operate during the PoC phase and identifies the prohibitions that distinguish a PoC from an unauthorized production system.

### 2. Background

a. FITREP-E was previously deployed on a commercial public-internet endpoint at fitness-report-evaluator.onrender.com with marketing language suggesting general use by Reporting Seniors across the Marine Corps and other military branches.

b. A compliance audit dated 2026-05-26, attached as enclosure (3), identified nine Critical Violations against the five compliance pillars of cybersecurity, privacy, records management, IT portfolio management, and CUI handling. Findings include unauthorized commercial hosting, absence of CAC authentication, persistent PII storage on commercial backends, absence of a DoD Notice and Consent Banner, and absence of any DADMS or DITPR-DON registration.

c. The originator certifies that no live personnel data was processed by the prior deployment. All historical use occurred against test inputs. This charter therefore applies cleanly forward and backward.

d. The Marine Corps has not chartered FITREP-E as a system of record. Acquisition through the Defense Acquisition Framework has not been initiated. Sponsorship at O-5 or above has not been secured.

### 3. Scope

a. FITREP-E in PoC mode is a single-file HTML methodology aid demonstrating a left-to-right marking framework for Fitness Reports.

b. The PoC operates exclusively against synthetic data fixtures shipped with the artifact.

c. The PoC is intended to inform a future acquisition decision. It is not intended to substitute for, supplement, or shadow any authorized FITREP process.

### 4. Constraints

The following constraints are non-negotiable and supersede any contrary documentation or verbal direction.

a. Synthetic data only. No real names, EDIPIs, ranks tied to identifiable individuals, evaluation periods, or performance narratives are permitted as input.

b. No public-internet deployment. The artifact runs on developer-controlled workstations or behind internal network boundaries.

c. No external persistence. The artifact contains no fetch, XMLHttpRequest, WebSocket, localStorage, sessionStorage, or IndexedDB writes. The bundled package.json contains no dependencies for cloud database clients, authentication providers, or session managers.

d. No account creation, login, or password handling. The profile element is removed in its entirety.

e. No data export. PDF export, CSV export, voice input transcription to third parties, and clipboard write operations are removed.

f. No use against authorized FITREP processes. Outputs of the PoC are not submitted up the chain of command, attached to authorized fitness reports, or used to influence personnel decisions.

g. Banner enforcement. Every screen displays a prominent warning identifying the artifact as a PoC, prohibiting live data entry, and requiring user acknowledgment before any interaction.

### 5. Authority

a. This charter is signed by the originator named in paragraph 8 and is binding on all personnel granted access to the PoC.

b. This charter does not constitute an Authorization to Operate. It does not waive any provision of references (a) through (i). It does not authorize processing of PII or CUI.

c. Violation of any constraint in paragraph 4 converts the PoC into an unauthorized information system. Such violation is reportable under reference (a) and triggers incident handling under reference (c).

### 6. Duration and Sunset

a. Effective date: [INSERT DATE].

b. Sunset date: Not later than 12 months from the effective date.

c. On sunset, the codebase is archived in a developer-controlled repository under access restriction. The artifact is removed from any active distribution channel. Any successor effort operates under a separate authorization established through references (a) and (b).

d. The sunset date may be advanced by the originator without notice. The sunset date is not extended without command sponsorship at O-5 or above and a written extension memorandum.

### 7. Roles and Responsibilities

a. Originator. Maintains this charter, approves access to the PoC, and certifies compliance with paragraph 4. The originator is responsible for filing incidents under reference (c) if any constraint is violated.

b. Participants. Acknowledge this charter in writing before access. Operate the artifact only against the synthetic fixture. Report any defect, drift, or breach of paragraph 4 to the originator within 24 hours of discovery.

c. Sponsoring Command. Once identified at O-5 or above, the sponsoring command assumes oversight of the PoC and serves as the entry point for the Phase 4 accredited acquisition effort. Until sponsorship is identified, the PoC remains a developer-side effort with no command equity.

d. Compliance Reviewer. Conducts a quarterly review against paragraph 4 and against the enclosure (3) audit findings. Files the review as an artifact in the project record.

### 8. Acceptable Use

a. Permitted. Methodology demonstration against synthetic Marines. Internal briefings to potential sponsoring commands using synthetic outputs. Functional testing on developer workstations.

b. Prohibited. Use against any real Marine. Distribution to general Marine Corps audiences. Hosting on any public-internet endpoint. Integration with any cloud database, CAC reader, identity provider, or authorized FITREP submission system.

### 9. Distribution Statement

Distribution Statement E. Distribution authorized to DoD components only and their contractors for administrative or operational use. Other requests for this document shall be referred to the originator.

### 10. Signature Block

I certify that I have read this charter, that the constraints in paragraph 4 are binding on all PoC activity, and that the PoC operates within those constraints as of the effective date.

Signature:           ________________________________________

Printed Name:        ________________________________________

Rank or Grade:       ________________________________________

Billet:              ________________________________________

Date:                ________________________________________

---

### Acknowledgment by Participants

By signing below, the participant acknowledges receipt of this charter, agreement to operate within paragraph 4 constraints, and obligation to report violations to the originator within 24 hours.

| Printed Name | Rank or Grade | Signature | Date |
| ------------ | ------------- | --------- | ---- |
|              |               |           |      |
|              |               |           |      |
|              |               |           |      |
|              |               |           |      |
|              |               |           |      |

---

### Distribution List

- Originator file
- Sponsoring command, when identified
- Each participant granted access
- Compliance reviewer
- Future Authorizing Official, when identified during Phase 4

---

Document Version: 1.0
Last Updated: [INSERT DATE]
Next Review: Quarterly from effective date, or on any change to paragraph 4 constraints.
