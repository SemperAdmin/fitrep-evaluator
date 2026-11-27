# Proof-of-concept governance

This page records the original proof-of-concept terms of the FITREP Evaluator.
The owner has since approved public hosting (2026-11-27).

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

## Charter and Audit Trail

- PoC-CHARTER.md - The signed PoC charter establishing scope, constraints, and sunset.
- docs/AUDIT-ISSUES-SUMMARY.md - Historical security audit. Preserved as evidence of the prior posture and as input to the Phase 4 acquisition effort.

## Sunset

This PoC sunsets on a date specified in the signed charter, no later than 12 months from the charter date. On sunset, the codebase is archived and the development environment is decommissioned. Any successor system runs under an issued ATO with full RMF, Privacy Act, and CUI controls.

## Distribution Statement

Distribution authorized to U.S. Government agencies and their contractors for administrative or operational use only. Other requests for this document shall be referred to the originating command identified in PoC-CHARTER.md.

## Contact

Project sponsorship inquiries route through the originating command identified in the PoC charter. No public-facing contact channel exists during the PoC phase.
