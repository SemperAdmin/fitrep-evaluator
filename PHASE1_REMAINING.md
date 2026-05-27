# Phase 1 Strip - Remaining Work

Last updated 2026-05-26 after Phase 1b excision pass.

## Phase 1b summary

Post-strip forensic analysis surfaced findings missed in the first pass. Phase 1b addresses all of them.

Files modified in Phase 1b:

- js/constants.js - API_CONFIG cleared, RENDER_URL removed.
- js/formStore.js - localStorage and sessionStorage writes replaced with in-memory cache. No Redux dependency required.
- js/navigation.js - localStorage has_profile fallback gutted. profileLoginCard and profileDashboardCard removed from card hide list.
- js/utils.js - getCsrfToken now returns null. No CSRF token storage. No backend exists.
- js/evaluation.js - Accordion state moved to module-level memory. profileDashboardCard guard removed.
- js/app.js - sessionStorage login_source code gutted. Theme localStorage replaced with in-memory toggle. showRSLoginFirst and showProfileLogin reduced to no-op stubs with warn-on-call logging. profileLoginCard and profileDashboardCard variable lookups removed from boot path.
- index.html - errorLogger script tag removed.

Files to be removed by scripts/phase1b-strip.ps1:

- src/ entire React TypeScript Vite directory including src/lib/supabase.ts.
- public/ Vite public directory.
- .env, .env.example, .env.local.
- js/errorLogger.js (remote fetch and localStorage paths).
- tests/persistence.safeguards.test.js, tests/profile.header.escape.test.js, tests/errorLogger.test.js.
- styles/admin.css.
- docs/PRD-COMPREHENSIVE-IMPROVEMENTS.md, docs/NETWORK-EFFICIENCY.md, docs/UNIFIED-STORAGE.md, docs/MEMORY-MANAGEMENT.md, docs/IMMEDIATE-ACTION-CHECKLIST.md, docs/IMPLEMENTATION_SUMMARY.md, docs/InstructionsExampleComponent.tsx.txt, docs/GLOBALS-MIGRATION.md, docs/PERF-BENCHMARKS.md, docs/PERFORMANCE-IMPROVEMENTS.md, docs/CONFIG.md.
- .trae/ directory.

Verification grep after Phase 1b edits and before Phase 1b strip execution shows that the remaining matches in js/ are: PoC removal comments (intentional), errorLogger.js code (file scheduled for deletion), and stub function definitions for showRSLoginFirst and showProfileLogin (no-op warn-on-call). No live localStorage, sessionStorage, fetch, supabase, onrender, or RENDER_URL references remain in surviving code.

## What is complete in this session

- PoC Charter Memo drafted at PoC-CHARTER.md.
- README.md rewritten to PoC posture.
- Deletion script created at scripts/phase1-strip.ps1, including supabase/ migrations folder.
- package.json reduced to PoC-only dependencies, no Express, no Supabase, no bcryptjs, no Redis, no jsPDF.
- js/config.js rewritten with hard network and storage guards. fetch and Storage.setItem are blocked at runtime.
- js/syntheticFixture.js created with eight notional Marines using the MARINE_ALPHA_01 naming convention.
- css/poc-banner.css and js/pocBanner.js created. A forced acknowledgment modal gates user interaction.
- index.html head updated to load the PoC banner, config, and fixture first.
- index.html setup form patched to require synthetic identifier pattern.
- index.html RS Dashboard surfaces excised in full. The following sections are removed:
  - returnToDashboardBtn on the setup card.
  - rsDashboardBtn on the RS info group.
  - viewRsDashboardBtn on the summary card.
  - RS Dashboard mode option from the mode selection card.
  - The entire What's New changelog including Supabase Accounts references.
  - The entire profileLoginCard including login, create account, forgot password.
  - The entire profileDashboardCard including breadcrumb, profile header, Manage Data, sync, upload, export, template, rank filter bar, evaluation filters, profile grid container.
  - The entire resetPasswordModal.
  - The Render API configuration script block setting RENDER_URL and TRUSTED_API_ORIGINS.
  - All script src references to deleted modules: githubService, idbStore, storageCore, unifiedStorage, storageHelpers, voice, networkCache, githubServiceCached, githubHelpers, profile, persistence, feedback.
  - All external CDN script references including Redux, jsPDF, jsPDF-autotable.
  - The saveProfileModal, editProfileModal, pendingSyncModal at the bottom of body.
- Grep confirms no remaining references in index.html to: dashboard, RS Dashboard navigation, onrender, RENDER_URL, TRUSTED_API_ORIGINS, profileLogin, profileDashboard, saveProfile, editProfile, pendingSync, or any of the prohibited onclick handlers.

## What you must do next, in order

### Step 1 - Preserve the historical state

```powershell
cd D:\Coding\Fitness-Report-Evaluator
git add .
git commit -m "Pre-PoC-realignment snapshot. See compliance audit dated 2026-05-26."
git tag preserve/pre-poc-realignment
git checkout -b compliance/phase-1-strip
```

### Step 2 - Dry-run the deletion script

```powershell
.\scripts\phase1-strip.ps1 -DryRun
```

### Step 3 - Execute deletion

```powershell
.\scripts\phase1-strip.ps1
```

Type DELETE at the prompt.

### Step 4 - Refresh dependencies

```powershell
npm install
```

### Step 5 - Hand-edit remaining JS modules for stale references

The deletion script removes the cloud-related JS modules. The surviving modules in js/ still contain function calls and references to the deleted ones. These will throw at runtime under the config.js network and storage guards. You must hand-edit the following files to remove orphaned references:

- js/app.js - remove all dashboard initialization, showProfileDashboardOnLoad, and any code path that loads profileDashboardCard or profileLoginCard.
- js/navigation.js - remove rsDashboardBtn references, returnToDashboardBtn references, and any showProfileDashboard / showProfileLogin function bodies.
- js/evaluation.js - remove the confirmSaveToProfileAndReturn function and the View RS Dashboard handoff.
- js/utils.js - check for Reporting Senior data save helpers.
- js/sectionI.js - check for any sync or storage helpers.
- js/directedComments.js - same check.
- js/formStore.js - remove any persistence hooks.

Use this command to find every remaining call to a deleted module or function:

```powershell
Get-ChildItem -Recurse -Include *.js | Select-String -Pattern "showProfileDashboard|showProfileLogin|showCreateAccount|accountLogin|saveProfileUpdates|openEditProfile|syncAllEvaluations|initiateUpload|exportAllData|downloadTemplate|GitHub|Supabase|fetch\(|localStorage|IndexedDB|onrender|RENDER_URL|persistence|githubService|networkCache|idbStore|unifiedStorage|storageCore|storageHelpers|backend-api"
```

Every match is a defect.

### Step 6 - Verify the banner gate

Open index.html directly in a browser. The acknowledgment modal must appear immediately. The methodology aid must be interactive only after acknowledgment.

### Step 7 - Verify zero outbound network traffic

Open browser DevTools, Network tab. Reload index.html. Expected network request count is zero. The config.js guard will throw if any module attempts fetch.

### Step 8 - Sign the PoC Charter

Fill the bracketed placeholders in PoC-CHARTER.md. Convert to .docx in Word. Route through your sponsoring chain.

### Step 9 - Commit Phase 1

```powershell
git add -A
git commit -m "Phase 1 strip. RS Dashboard excised. See PoC-CHARTER.md."
```

## Blocked items requiring outside resolution

- Bash sandbox unavailable. Could not execute git operations or the docx skill toolchain from this session. PoC Charter delivered as markdown.
- Sponsorship at O-5 or above not yet identified. Charter remains a self-issued document with no command equity until sponsored.
- Phase 4 acquisition effort not initiated.

## Findings introduced during Phase 1 execution

1. Synthetic personas in server/local-data used realistic-sounding names matching real Marine documentation patterns. Distinguishability defect documented. Going-forward convention is MARINE_ALPHA_## through MARINE_ZULU_##.
2. Supabase migrations folder discovered at supabase/migrations with 7 SQL files defining the commercial backend schema. Added to deletion script.
3. The Render API configuration script in index.html was configured to default to https://fitness-report-evaluator.onrender.com on GitHub Pages and any local static server. This was the live exfiltration vector. Removed during dashboard excision.

## Quick-reference file inventory after Phase 1 completes

Files that must exist:

- PoC-CHARTER.md
- README.md
- PHASE1_REMAINING.md
- package.json
- index.html (dashboard-free, single-modal interaction)
- js/config.js (with runtime guards)
- js/pocBanner.js
- js/syntheticFixture.js
- css/poc-banner.css
- styles.css and css/performance.css (UI base styles)
- Methodology engine modules in js/: errorLogger, constants, data, militaryData, utils, formCore, formStore, formUI, validation, sectionI, directedComments, memoryManager, performance, ui-states, accessibility, tooltips, modals, formValidationCore, formValidationUI, navigation (after editing), evaluation (after editing), app (after editing).
- assets/images/ for rank graphics.
- docs/AUDIT-ISSUES-SUMMARY.md preserved as evidence.

Files that must not exist after deletion runs:

- server/ in any form
- server-example.js, check_supabase.js, test_api.js
- admin.html
- js/admin/
- js/backend-api.js, js/github-api.js, js/githubHelpers.js, js/githubService.js, js/githubServiceCached.js
- js/idbStore.js, js/persistence.js, js/profile.js, js/networkCache.js
- js/storageCore.js, js/storageHelpers.js, js/unifiedStorage.js
- js/voice.js, js/feedback.js
- .github/workflows/*.yml
- scripts/migrate-to-supabase.js, scripts/render-*.js, scripts/test-issue.js
- node_modules/ until npm install repopulates against the new package.json
- docs/SUPABASE_*.md, docs/GITHUB_INTEGRATION.md, docs/ADMIN_DATA_SOURCE.md, docs/PRD-Admin-Dashboard.md, docs/FEEDBACK_*.md, docs/MIGRATION_GUIDE.md
- .trae/documents/admin-dashboard-*.md
- APP_DETAILS_DEMO.md
- server/local-data/
- supabase/ entire directory including 7 SQL migration files

## Styling Decisions for the PoC

The Semper Admin Portal Style Guide v1.2 dated 2026-05-04 has been adopted as the cross-app design system. Application to the FITREP PoC follows a deliberate two-layer model.

Layer A - Brand token system, applied. css/semper-tokens.css defines every variable from the style guide including brand palette, neutral and ink ramps, role accents, status, semantic tokens, type scale, spacing ladder, radii, shadows, layout constants, motion durations, premium polish helpers, eyebrow and mono treatments, focus and selection rules, and the reduced-motion gate. Light defaults sit on :root. Dark overrides activate when html or body carries the .dark class. The file is loaded first in the index.html head.

Layer B - PoC banner, deliberately unbranded. css/poc-banner.css does NOT reference brand tokens. The acknowledgment modal and the persistent top-of-page warning render in raw red and Arial system fallback. This is intentional. A branded warning competes with the surrounding polish and recreates the perception problem documented in the audit. The PoC banner reads as scaffolding warning, not production chrome. Do not refactor poc-banner.css to use tokens until the PoC is retired.

Outstanding styling work, not blocking Phase 1 closure:

1. styles.css still uses hardcoded colors throughout. To realize the full brand on methodology engine surfaces, refactor styles.css to consume tokens. This is a separate effort and is out of scope for Phase 1.
2. Font files are not bundled. The type stack falls back to system fonts. For full brand match, install @fontsource-variable/inter, @fontsource-variable/jetbrains-mono, and @fontsource/bebas-neue, then either bundle the woff2 files locally or document the system fallback as PoC-acceptable.
3. The .dark class is not yet toggled by any control in the PoC. The dark mode override is wired and ready. Add a theme toggle when methodology engine refactor begins.

## Distribution

Internal only. Do not post in public channels.
