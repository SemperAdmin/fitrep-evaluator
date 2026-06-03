# GitHub Repository Setup Guide

## Step 1: Create Repository on GitHub

1. Go to [GitHub](https://github.com/new)
2. Fill in the repository details:

| Field | Value |
|-------|-------|
| **Repository name** | `fitrep-evaluator` (or your preferred name) |
| **Description** | FITREP Evaluator - Unbiased Fitness Report Methodology Aid (Proof of Concept) |
| **Visibility** | Private (recommended for PoC) or Public (your choice) |
| **Initialize with** | None (you'll push existing code) |

3. Click **Create repository**

---

## Step 2: Clone and Configure Locally

```bash
# Clone the new repository
git clone https://github.com/YOUR_USERNAME/fitrep-evaluator.git
cd fitrep-evaluator

# Or if you already have the project, add the remote
git remote add origin https://github.com/YOUR_USERNAME/fitrep-evaluator.git
git branch -M main
```

---

## Step 3: Files to Include in Repository

### ✅ **INCLUDE These Files**

```
fitrep-evaluator/
├── index.html                          # Main application file
├── package.json                        # Dependencies and scripts
├── package-lock.json                   # Lock file for dependencies
├── .eslintrc.json                      # ESLint configuration
│
├── README.md                           # Project overview
├── PoC-CHARTER.md                      # Signed PoC charter
├── PRIVACY_POLICY.md                   # Legal: Privacy
├── TERMS_OF_SERVICE.md                 # Legal: Terms
├── AS_IS_DISCLAIMER.md                 # Legal: Disclaimer
├── COMPLIANCE_AUDIT_REPORT.md          # Audit findings
│
├── js/                                 # JavaScript modules
│   ├── app.js
│   ├── config.js
│   ├── constants.js
│   ├── data.js
│   ├── legalConsent.js                 # NEW: Legal consent management
│   ├── syntheticFixture.js
│   ├── pocBanner.js
│   └── ... (all other .js files)
│
├── css/                                # Stylesheets
│   ├── semper-tokens.css
│   ├── poc-banner.css
│   ├── legal-hub.css                   # NEW: Legal modals styling
│   └── ... (all other .css files)
│
└── assets/                             # Images and static assets
    └── images/
        └── Logo.png
```

### ❌ **EXCLUDE These Files** (in .gitignore)

```
node_modules/
.env
.DS_Store
*.swp
*.swo
*~
.vscode/
.idea/
.git/
```

---

## Step 4: Update .gitignore

Your `.fitrep-evaluator/.gitignore` should contain:

```
# Dependencies
node_modules/
package-lock.json (optional - include for reproducible builds)

# Environment variables
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# Logs
*.log
npm-debug.log*

# Build outputs
dist/
build/

# Temporary files
*.tmp
.cache/
```

---

## Step 5: Initialize Git and Push Code

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: FITREP Evaluator PoC with compliance framework"

# Push to GitHub
git push -u origin main
```

---

## Step 6: Repository Settings (GitHub Web UI)

### Visibility
- **Public**: Anyone can view; fits open-source model
- **Private**: Only invited collaborators can access; recommended for sensitive PoC

### Branch Protection (Recommended)
1. Go to **Settings** → **Branches**
2. Click **Add rule** under "Branch protection rules"
3. Configure:
   - **Branch name pattern**: `main`
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass
   - ✅ Include administrators

### Topics (for discoverability)
Add these topics to your repo:
- `fitrep` 
- `usmc`
- `military`
- `fitness-report`
- `methodology`
- `proof-of-concept`

---

## Step 7: Create GitHub-Specific Files

### Create `.github/CODEOWNERS`

```
# FITREP Evaluator PoC Code Owners

# Legal documents
PRIVACY_POLICY.md @YOUR_USERNAME
TERMS_OF_SERVICE.md @YOUR_USERNAME
AS_IS_DISCLAIMER.md @YOUR_USERNAME
COMPLIANCE_AUDIT_REPORT.md @YOUR_USERNAME

# Core configuration
PoC-CHARTER.md @YOUR_USERNAME
config.js @YOUR_USERNAME

# All code requires review
* @YOUR_USERNAME
```

### Create `.github/ISSUE_TEMPLATE/bug_report.md`

```markdown
---
name: Bug Report
about: Report a defect in the PoC
title: "[BUG] "
labels: bug
assignees: ''

---

## Description
Brief description of the issue.

## Reproduction Steps
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen.

## Actual Behavior
What actually happens.

## Environment
- Browser: (e.g., Chrome 120)
- OS: (e.g., Windows 11)

## Additional Context
Screenshots, error logs, etc.

---

## IMPORTANT
⚠️ **Do not include real Marine names, EDIPIs, ranks, or evaluation data in bug reports.**
Use synthetic identifiers only.
```

### Create `.github/ISSUE_TEMPLATE/feature_request.md`

```markdown
---
name: Feature Request
about: Suggest an idea for the PoC methodology
title: "[FEATURE] "
labels: enhancement
assignees: ''

---

## Description
Clear description of the feature.

## Motivation
Why would this feature be valuable?

## Alternative Approaches
Other ways to solve the problem.

## PoC Charter Alignment
How does this align with PoC constraints in PoC-CHARTER.md?
```

---

## Step 8: Commit and Push Initial Structure

```bash
git add .github/
git commit -m "Add GitHub templates and code owners"
git push origin main
```

---

## Step 9: Create Initial Release (Optional)

```bash
git tag -a v3.0.0-poc -m "FITREP Evaluator PoC v3.0.0 - Proof of Concept with compliance framework"
git push origin v3.0.0-poc
```

Then on GitHub:
1. Go to **Releases**
2. Click **Draft a new release**
3. Select tag `v3.0.0-poc`
4. Title: `FITREP Evaluator PoC v3.0.0`
5. Description:
   ```
   # Proof of Concept Release

   ## What's New
   - Complete legal compliance framework (Privacy Policy, Terms of Service, As-Is Disclaimer)
   - Clickwrap consent system with mandatory Terms acceptance
   - Legal Hub with in-app document viewers
   - Synthetic data only methodology aid
   - GDPR, CCPA/CPRA, and U.S. Government compliance

   ## Important Notes
   - ⚠️ NOT a system of record
   - ⚠️ Synthetic data only
   - ⚠️ Output not valid for official submission
   - See PoC-CHARTER.md for full constraints

   ## Files Included
   - Application code (HTML, JS, CSS)
   - Legal documents
   - Compliance audit report
   - PoC charter memo
   ```

---

## Repository Structure on GitHub

After setup, your repo should look like:

```
fitrep-evaluator/
├── .github/
│   ├── CODEOWNERS
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
├── .gitignore
├── js/
├── css/
├── assets/
├── index.html
├── package.json
├── README.md
├── PoC-CHARTER.md
├── PRIVACY_POLICY.md
├── TERMS_OF_SERVICE.md
├── AS_IS_DISCLAIMER.md
├── COMPLIANCE_AUDIT_REPORT.md
└── GITHUB_SETUP.md (this file)
```

---

## Quick Reference: GitHub Commands

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/fitrep-evaluator.git

# Create a new branch for work
git checkout -b feature/your-feature-name

# Make changes, then:
git add .
git commit -m "Descriptive commit message"
git push origin feature/your-feature-name

# Then create a Pull Request on GitHub

# Merge and sync main branch
git checkout main
git pull origin main
```

---

## Important Reminders for Contributors

Add this to your **CONTRIBUTING.md** (optional):

```markdown
# Contributing to FITREP Evaluator

## Scope
This is a Proof of Concept (PoC) tool for evaluating fitness report methodology. See PoC-CHARTER.md for constraints.

## Hard Constraints
1. ❌ Do not enter real Marine names, EDIPIs, ranks, or evaluation periods
2. ❌ Do not persist data to servers, databases, or cloud services
3. ❌ Do not enable network calls (fetch, XMLHttpRequest, WebSocket)
4. ❌ Do not submit output as official evaluations
5. ❌ Do not enable localStorage or sessionStorage

## Before Contributing
- Read PoC-CHARTER.md
- Review README.md
- Understand synthetic-data-only constraint
- Review compliance documents

## Reporting Issues
- Use GitHub Issues with the provided templates
- Do NOT include real personnel data
- Mention which constraint may be violated (if applicable)

## Pull Requests
- Reference the issue number: "Fixes #123"
- Ensure no network calls are added
- Ensure no data persistence is added
- Maintain synthetic-data-only design
```

---

## Verification Checklist

Before marking your repo as "ready":

- [ ] Repository created on GitHub
- [ ] Code pushed to `main` branch
- [ ] `.gitignore` configured (excludes `node_modules`, `.env`, etc.)
- [ ] README.md is present and clear
- [ ] Legal documents (Privacy, Terms, Disclaimer) are included
- [ ] PoC-CHARTER.md is prominently linked
- [ ] `.github/` directory with templates exists
- [ ] Initial commit message is descriptive
- [ ] Tags/releases are created (v3.0.0-poc)
- [ ] Branch protection configured on `main`
- [ ] Repository topics are added
- [ ] COMPLIANCE_AUDIT_REPORT.md is included for transparency

---

## GitHub Pages (Optional: Host the App)

If you want to host the app directly from GitHub:

1. Go to **Settings** → **Pages**
2. Select **Deploy from a branch**
3. Choose branch: `main`
4. Choose folder: `/ (root)`
5. Save

Your app will be live at: `https://YOUR_USERNAME.github.io/fitrep-evaluator/`

**Note:** Ensure your `.env` is not committed (it's in .gitignore already).

---

## Next Steps

1. **Create the GitHub repo** using the web UI
2. **Push your code** using the commands in Step 5
3. **Configure repo settings** (visibility, branch protection, topics)
4. **Add GitHub templates** (.github/ directory)
5. **Create an initial release** (v3.0.0-poc)
6. **Share the repo URL** with collaborators

---

**Questions?** Refer to [GitHub Docs](https://docs.github.com) or [GitHub CLI Reference](https://cli.github.com/manual/)
