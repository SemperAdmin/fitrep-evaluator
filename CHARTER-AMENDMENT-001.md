# UNITED STATES MARINE CORPS

[INSERT ORIGINATING COMMAND HEADER]

                                                            IN REPLY REFER TO:
                                                            5230
                                                            [INSERT CODE]
                                                            [INSERT DATE]

## MEMORANDUM FOR THE RECORD

From: [INSERT ORIGINATOR NAME, RANK, BILLET]
To:   Distribution List

Subj: AMENDMENT 001 TO THE PROOF OF CONCEPT CHARTER FOR THE FITNESS REPORT
      EVALUATOR (FITREP-E) METHODOLOGY AID

Ref:  (a) PoC Charter for FITREP-E Methodology Aid, dated [INSERT DATE]
      (b) MCO 5239.2B, Marine Corps Cybersecurity
      (c) DoDI 5200.48, Controlled Unclassified Information
      (d) MCO 1610.7B, Performance Evaluation System

---

### 1. Purpose

To amend paragraphs 4.b, 4.e, and 8.b of reference (a) to align the chartered
constraints with the artifact's actual technical posture and its actual
distribution method, and to establish the compensating controls under which a
publicly accessible static instance is authorized.

### 2. Background

a. Reference (a) paragraph 4.b prohibited public-internet deployment. That
prohibition was written in direct response to the findings at reference (a)
paragraph 2.a and 2.b concerning the prior commercial deployment at
fitness-report-evaluator.onrender.com.

b. The specific defects that made the prior deployment unacceptable were:
persistent storage of user input on a commercial backend; a live outbound
transmission path to a commercial API endpoint; absence of any acknowledgment
banner; absence of a consent gate; and marketing language representing the tool
as suitable for general use across the Marine Corps.

c. Each of those defects has been remediated in code, not merely in policy:

   (1) No backend exists. The artifact is a static document set with no
       server-side runtime.

   (2) Outbound network I/O is blocked at runtime. The global fetch
       implementation is replaced with a throwing stub before any application
       module loads.

   (3) Persistent storage is blocked at runtime. Storage.prototype.setItem is
       replaced with a throwing stub.

   (4) Content Security Policy restricts script execution to same-origin
       sources. No third-party script, stylesheet, font, or analytics
       reference remains.

   (5) Subject identifiers are validated against a synthetic-only pattern.

   (6) A proof-of-concept acknowledgment banner and a clickwrap terms-of-
       service gate both require affirmative user action before any
       interaction is possible.

d. The consequence of subparagraph 2.c is that user input never leaves the
browser session under any code path. The risk model that justified paragraph
4.b no longer describes the artifact.

e. A separate review identified that paragraph 4.e of reference (a) states that
clipboard write operations and file export are removed. They are not. A
plain-text summary download and a clipboard copy function are both present and
reachable from the user interface. This amendment reconciles the charter to the
artifact rather than removing working functionality that carries no
transmission risk.

f. The copyright holder has certified that the artifact was authored on
personal time using personal equipment, outside the scope of official duties.
It is not a work of the United States Government. A proprietary license has
been added to the repository reflecting that status.

### 3. Amendments

a. **Paragraph 4.b is amended to read:**

   "No unaccredited hosting that processes data server-side. A publicly
   accessible instance is authorized only when served as static content with no
   server-side runtime, no backend, no database, no telemetry, and no
   analytics. The compensating controls in paragraph 4.h apply in full to any
   such instance. Hosting on any platform that stores, logs, processes, or
   transmits user input remains prohibited."

b. **Paragraph 4.e is amended to read:**

   "No transmission-based export. Any function that transmits evaluation
   content off the user's device is prohibited. Local-only output — a file
   written to the user's own device, or a clipboard write initiated by the user
   — is permitted, provided the output contains no data the artifact was not
   already permitted to accept. Any future structured export or import
   capability requires a further amendment to this charter and must enforce
   synthetic-identifier validation on import."

c. **Paragraph 8.b is amended** to strike "Hosting on any public-internet
endpoint" and to strike "Distribution to general Marine Corps audiences,"
replacing the latter with:

   "Representation of the artifact as authorized, accredited, official, or
   suitable for producing evaluations submitted through any chain of command."

d. **A new paragraph 4.h is added:**

   "Compensating controls for public static hosting. A publicly accessible
   instance is authorized only while all of the following hold. Failure of any
   one revokes the authorization and requires the instance be taken down:

   (1) Outbound network I/O remains blocked at runtime.
   (2) Persistent browser storage remains blocked at runtime.
   (3) Content Security Policy restricts scripts to same-origin.
   (4) No analytics, telemetry, tracking pixel, or logging of user input.
   (5) The acknowledgment banner and consent gate remain mandatory and
       cannot be dismissed without affirmative action.
   (6) Synthetic-identifier validation remains enforced on all subject fields.
   (7) The landing view states plainly that the artifact is a proof of
       concept, is not accredited, and must not receive real personnel data.
   (8) No third-party script, style, or font is loaded from any external
       origin."

### 4. Items Requiring Separate Action

a. Terms of Service paragraph 7.2 assigns the name, logo, and trademarks to
"the sponsoring command." No sponsoring command exists, per reference (a)
paragraph 7.c. This paragraph is to be corrected to reflect the copyright
holder's personal ownership.

b. Terms of Service paragraph 7.1 asserts a license grant. That grant is now
backed by the LICENSE file added to the repository. The two documents are to be
reviewed for consistency.

c. The repository remains public and forkable with no technical control
preventing a third party from deploying a modified instance with the paragraph
4.h controls removed. The LICENSE prohibits this. The originator is to monitor
for derivative deployments and act on any discovered.

### 5. Effect

All provisions of reference (a) not expressly amended above remain in force,
including the synthetic-data-only constraint at paragraph 4.a, the prohibition
on use against authorized FITREP processes at paragraph 4.f, and the sunset
provisions at paragraph 6.

### 6. Signature

I certify that the compensating controls at paragraph 3.d are in place as of
the date of signature, and that the amended constraints are binding on all PoC
activity.

Signature:           ________________________________________

Printed Name:        ________________________________________

Rank or Grade:       ________________________________________

Date:                ________________________________________

---

Amendment Version: 001
Supersedes: No prior amendment
Next Review: Quarterly, or on any change to paragraph 4 constraints.
