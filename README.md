# FITREP Evaluator - Methodology Proof of Concept

## Status

PROOF OF CONCEPT. NOT A SYSTEM OF RECORD. NOT AUTHORIZED FOR LIVE PERSONNEL DATA.

This project is a pre-acquisition Proof of Concept exploring an unbiased, left-to-right marking methodology for USMC Fitness Reports. It is not authorized to process, store, or transmit Personally Identifiable Information or Controlled Unclassified Information.

## Authorization Posture

- ATO: Not issued. PoC operates outside an Authorization to Operate boundary.
- PIA: Not issued. No live PII is accepted by design.
- SORN: Not applicable in PoC mode because no live records are created.
- DADMS or DITPR-DON: Not registered. Registration is a Phase 4 prerequisite for any production successor.
- Hosting: Developer-controlled environments only. Public-internet hosting is prohibited.

See PoC-CHARTER.md for the signed charter establishing these constraints.

## Hard Constraints for All Users and Contributors

1. Do not enter real Marine names, real Reporting Senior names, real EDIPIs, real email addresses, real ranks tied to identifiable individuals, real dates of rank, real evaluation periods, or real performance text.
2. Use only the synthetic data fixture shipped with the application.
3. Do not deploy this code to a public-internet endpoint.
4. Do not connect this code to any data store, cloud database, or external API in a configuration that persists user input beyond the active browser session.
5. Do not use this tool to produce evaluations submitted up the chain of command.

Violations of these constraints convert the PoC into an unauthorized live system processing CUI, exposing the operator and the sponsoring command to Privacy Act and DoDI 5200.48 enforcement.

## Methodology Overview

The application demonstrates a left-to-right FITREP marking framework intended to reduce grade inflation and confirmation bias.

- Start at the baseline trait grade.
- Step through each grade left to right against documented criteria.
- Advance one grade only when performance evidence supports the next standard.
- Stop when the evidence no longer supports advancement.

Each marking decision routes through one of three options: Does Not Meet, Meets, or Surpasses. Justifications are entered against synthetic Marines only and are not persisted.

## Synthetic Data Fixture

The application loads a static fixture file containing notional Marines with placeholder identifiers such as Marine Alpha-01, Marine Bravo-02, and so on. The fixture is the only acceptable input source. The fixture file resides at js/syntheticFixture.js and is loaded at startup. Any code path that ingests user-entered names is a defect to be filed and remediated.

## Environment

- Browser-only execution. No server-side runtime is required in PoC mode.
- All persistence is disabled. localStorage, sessionStorage, IndexedDB, fetch, XMLHttpRequest, and WebSocket calls are removed from the production build.
- All third-party integrations are removed. GitHub Actions workflows are disabled. Supabase modules are removed from package.json.

## Setup for PoC Participants

1. Clone the repository to a developer-controlled workstation.
2. Open index.html directly in a modern browser. No build step is required for the PoC artifact.
3. Verify the warning banner appears at the top of the page and requires acknowledgment.
4. Verify the synthetic fixture loads. No live name fields are exposed in the UI.

## Reporting Defects

Defects are filed in the project tracker behind the developer-controlled boundary. Do not post issue content containing real personnel data. Do not enable the prior Render-to-GitHub automatic issue creation. That workflow is deprecated and disabled.

## Charter and Audit Trail

- PoC-CHARTER.md - The signed PoC charter establishing scope, constraints, and sunset.
- docs/AUDIT-ISSUES-SUMMARY.md - Historical security audit. Preserved as evidence of the prior posture and as input to the Phase 4 acquisition effort.

## Sunset

This PoC sunsets on a date specified in the signed charter, no later than 12 months from the charter date. On sunset, the codebase is archived and the development environment is decommissioned. Any successor system runs under an issued ATO with full RMF, Privacy Act, and CUI controls.

## Distribution Statement

Distribution authorized to U.S. Government agencies and their contractors for administrative or operational use only. Other requests for this document shall be referred to the originating command identified in PoC-CHARTER.md.

## Contact

Project sponsorship inquiries route through the originating command identified in the PoC charter. No public-facing contact channel exists during the PoC phase.
