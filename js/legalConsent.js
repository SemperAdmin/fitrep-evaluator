/**
 * FITREP Evaluator - Legal Consent Management
 *
 * Implements clickwrap consent with mandatory checkbox, legal document viewing,
 * and consent audit trail. Loads after pocBanner.js to layer on stricter consent requirements.
 */
(function () {
  'use strict';

  /**
   * Legal consent state - tracks user's active consent to Terms of Service
   * Stored in session memory only. Does not persist across reloads.
   */
  const CONSENT_STATE = {
    termsAccepted: false,
    acceptanceTimestamp: null,
    acceptanceAcknowledged: false
  };

  /**
   * Legal Hub Configuration
   * Define all legal documents available in the application
   */
  const LEGAL_DOCS = {
    privacy: {
      id: 'privacy-policy',
      title: 'Privacy Policy',
      file: '/PRIVACY_POLICY.md',
      description: 'How we collect, use, and protect your information'
    },
    terms: {
      id: 'terms-of-service',
      title: 'Terms of Service',
      file: '/TERMS_OF_SERVICE.md',
      description: 'Your rights and obligations when using this Application'
    },
    disclaimer: {
      id: 'as-is-disclaimer',
      title: 'As-Is Disclaimer',
      file: '/AS_IS_DISCLAIMER.md',
      description: 'Methodology limitations and warranty disclaimers'
    }
  };

  /**
   * Initialize Legal Hub Footer Links
   * Adds clickable legal document links to the footer
   */
  function initializeLegalHub() {
    const footerElement = document.querySelector('.poc-footer__content');
    if (!footerElement) {
      console.warn('[legalConsent] .poc-footer__content not found. Legal hub not initialized.');
      return;
    }

    // Create legal links container (centered)
    const linksHtml = `
      <div class="legal-hub-footer">
        <span style="opacity: 0.9; margin-right: 8px; color: #000000 !important;">Legal:</span>
        <a href="#" class="legal-link" data-doc="privacy" style="color: #000000 !important;">Privacy</a>
        <span style="opacity: 0.6; margin: 0 6px; color: #000000 !important;">·</span>
        <a href="#" class="legal-link" data-doc="terms" style="color: #000000 !important;">Terms</a>
        <span style="opacity: 0.6; margin: 0 6px; color: #000000 !important;">·</span>
        <a href="#" class="legal-link" data-doc="disclaimer" style="color: #000000 !important;">Disclaimer</a>
      </div>
    `;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = linksHtml.trim();
    footerElement.appendChild(wrapper.firstChild);

    // Attach click handlers to legal links
    document.querySelectorAll('.legal-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const docKey = link.getAttribute('data-doc');
        openLegalDocumentModal(docKey);
      });
    });

    console.log('[legalConsent] Legal hub footer initialized.');
  }

  /**
   * Open a Legal Document Modal
   * Displays the requested legal document in a scrollable modal
   */
  function openLegalDocumentModal(docKey) {
    const docConfig = LEGAL_DOCS[docKey];
    if (!docConfig) {
      console.error('[legalConsent] Unknown legal document:', docKey);
      return;
    }

    // Create modal structure
    const modalId = `legal-modal-${docKey}`;
    let modal = document.getElementById(modalId);

    if (!modal) {
      modal = document.createElement('div');
      modal.id = modalId;
      modal.className = 'legal-document-modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-labelledby', `legal-modal-title-${docKey}`);

      const html = `
        <div class="legal-modal-overlay" onclick="closeLegalDocumentModal('${docKey}')">
          <div class="legal-modal-content" onclick="event.stopPropagation()">
            <div class="legal-modal-header">
              <h2 id="legal-modal-title-${docKey}" class="legal-modal-title">${docConfig.title}</h2>
              <button type="button" class="legal-modal-close" aria-label="Close" onclick="closeLegalDocumentModal('${docKey}')">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="legal-modal-body" id="legal-content-${docKey}">
              <p style="color: #999; text-align: center; padding: 20px;">Loading document...</p>
            </div>
            <div class="legal-modal-footer">
              <button type="button" class="btn btn-primary" onclick="closeLegalDocumentModal('${docKey}')">Close</button>
            </div>
          </div>
        </div>
      `;

      modal.innerHTML = html;
      document.body.appendChild(modal);

      // Load and render the legal document content
      loadAndRenderLegalDocument(docKey);
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  /**
   * Legal Document Content (embedded)
   * Complete markdown content for all legal documents
   */
  const LEGAL_CONTENT = {
    privacy: `# Privacy Policy

**Effective Date:** June 2, 2026

## 1. Introduction

This Privacy Policy describes how the FITREP Evaluator handles information. This Application is a **Proof of Concept** tool for military fitness report evaluation using **synthetic data only**. It is not authorized to process real PII, CUI, or HIPAA data.

## 2. Data We Collect

When you use the evaluation methodology, you may enter:
- Marking selections (grade choices: Does Not Meet, Meets, Surpasses)
- Justification text (narrative explanations)
- Date selections (reporting periods)
- Section I evaluations (written evaluations)

## 3. Storage and Data Retention

All information is stored **in your browser's memory only** during your active session. No data is:
- Sent to any server
- Persisted to local storage, IndexedDB, or cookies
- Backed up to cloud services
- Retained after you close the browser or reload the page

Your data is automatically deleted when you close the tab, reload the page, or your session expires (default: 30 minutes).

## 4. Third-Party Services

**This Application does NOT integrate with any third-party services.** There is no data sharing with:
- Cloud databases
- Analytics platforms
- Email or messaging services
- Government systems

## 5. Synthetic Data Requirement

**You must use only the synthetic data fixture provided.** Do not enter:
- Real Marine names or EDIPIs
- Real ranks tied to individuals
- Real evaluation periods
- Real performance narratives

Entering real data violates the PoC Charter and triggers incident procedures.

## 6. Your Data Rights

Because data is not persisted, deletion requests are not applicable—your data auto-deletes on session end. You have implicit rights to access (view during session), correct (re-enter in new session), and delete (automatic on session termination).

## 7. GDPR and CCPA Compliance

**GDPR:** Compliant because no personal data is retained beyond session termination.

**CCPA:** Compliant because no personal information is sold, shared, or retained for longer than the active session.

For questions, contact the originating command in PoC-CHARTER.md.`,

    terms: `# Terms of Service

**Effective Date:** June 2, 2026

## 1. Agreement to Terms

By using the FITREP Evaluator, you agree to these Terms. This is a **Proof of Concept**, not a system of record, and not authorized for production use.

## 2. Purpose

This Application is a **methodology aid** demonstrating a left-to-right marking framework. It provides **guidance only** and does not replace authorized evaluation processes.

**Output from this Application is NOT valid for official submission.**

## 3. User Restrictions

You agree to:
- Use **only the synthetic data fixture** provided
- Not enter real Marine names, EDIPIs, ranks, or evaluation periods
- Not enter real performance narratives or any personally identifiable information
- Not submit output as official evaluations up the chain of command
- Not attach output to any personnel record

**Violation immediately converts this PoC into an unauthorized system and triggers incident response.**

## 4. Disclaimer of Warranties

**THE APPLICATION IS PROVIDED "AS-IS" WITHOUT WARRANTY OF ANY KIND**, including warranties of merchantability, fitness for a particular purpose, or accuracy.

## 5. Limitation of Liability

**TO THE EXTENT PERMITTED BY LAW, THE DEVELOPER AND SPONSORING COMMAND SHALL NOT BE LIABLE FOR:**
- Any damages arising from your use of this Application
- Loss of data or business interruption
- Any claim from misuse or violation of these terms

## 6. Indemnification

You agree to indemnify and hold harmless the developer from any claim arising from:
- Your use of the Application
- Your violation of these terms
- Your entry of real PII, CUI, or other controlled information

## 7. Termination

This PoC sunsets per the signed charter (no later than 12 months from charter date). On sunset, the Application is archived and no further development occurs.

For questions, contact the originating command in PoC-CHARTER.md.`,

    disclaimer: `# As-Is Disclaimer

**Effective Date:** June 2, 2026

## Critical Disclaimer

**The FITREP Evaluator is provided "AS-IS" for proof-of-concept evaluation of marking methodology only. It is NOT a system of record, NOT authorized for production use, and does NOT produce official Fitness Reports.**

## What This Application Is

A **methodology demonstration tool** that walks through a left-to-right marking framework designed to reduce grade inflation and confirmation bias. It:
- Provides **guidance only**
- Uses **synthetic test data exclusively**
- Runs **entirely in your browser** with no persistence
- **Does not produce official output** for submission

## What This Application Is NOT

The FITREP Evaluator is **NOT**:
- An authorized Fitness Report evaluation system
- A replacement for MCO 1610.7B training
- A substitute for Reporting Senior judgment
- Authorized to process real PII, CUI, or HIPAA information
- Connected to any Marine Corps database
- Suitable for creating official evaluations

## Methodology Limitations

The left-to-right marking methodology:
1. **Is Unvalidated** — Not formally tested or approved for official use
2. **Applies Assumptions** — Assumes trait descriptions and grade criteria are universally applicable
3. **Does Not Replace Judgment** — The Reporting Senior remains responsible
4. **May Not Reduce Bias** — While designed to address bias, human application may still introduce bias
5. **Is Not Precedent** — Each evaluation is independent

## Synthetic Data Requirement

**You MUST use only the synthetic data fixture.** The fixture contains fictional Marines with placeholder names (e.g., "MARINE_ALPHA_01").

**Entering real PII, CUI, or health information violates the PoC Charter.**

## Output Disclaimer

Any evaluation output:
- Is **NOT valid for official submission**
- Is **NOT an authorized Fitness Report**
- Is **NOT admissible as official documentation**
- Is **NOT retained** (deleted on session end)
- Is **advisory only** and must be independently validated

## No Warranty or Guarantees

The Application provides **no warranty** regarding:
- Accuracy of the evaluation framework
- Suitability of output for your command
- Compliance with your policies
- Reduction of grade inflation or bias
- Defensibility in administrative proceedings

## Use at Your Own Risk

You assume all risks. The developer and sponsoring command assume **no liability** for:
- Your use of the methodology
- Decisions made based on output
- Misuse or unauthorized use of output
- Any claim arising from the methodology

For questions, contact the originating command in PoC-CHARTER.md.`
  };

  /**
   * Simple Markdown to HTML Converter
   * Converts basic markdown syntax to HTML
   */
  function markdownToHtml(markdown) {
    let html = markdown
      // Headers
      .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
      .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
      .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Code
      .replace(/`(.*?)`/g, '<code>$1</code>')
      // Horizontal rules
      .replace(/^---+$/gm, '<hr>')
      // Numbered lists
      .replace(/^\d+\. (.*?)$/gm, '<li>$1</li>')
      // Bullet lists
      .replace(/^- (.*?)$/gm, '<li>$1</li>')
      // Paragraphs
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(?!<[h|l|o|c])(.*?)$/gm, '<p>$1</p>')
      // Fix list wrapping
      .replace(/<\/p><li>/g, '<ul><li>')
      .replace(/<\/li><li>/g, '</li><li>')
      .replace(/<\/li><p>/g, '</li></ul><p>')
      .replace(/<\/li>$/gm, '</li></ul>');

    return html;
  }

  /**
   * Load and Render Legal Document
   * Displays embedded markdown content in the modal
   */
  function loadAndRenderLegalDocument(docKey) {
    const contentElement = document.getElementById(`legal-content-${docKey}`);
    const content = LEGAL_CONTENT[docKey];

    if (!content) {
      contentElement.innerHTML = '<p style="color: #999;">Document not found.</p>';
      return;
    }

    // Convert markdown to HTML
    const html = markdownToHtml(content);
    contentElement.innerHTML = html;

    // Scroll to top
    contentElement.scrollTop = 0;

    console.log('[legalConsent] Rendered legal document:', docKey);
  }

  /**
   * Close a Legal Document Modal
   */
  window.closeLegalDocumentModal = function(docKey) {
    const modalId = `legal-modal-${docKey}`;
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  };

  /**
   * Create Terms of Service Clickwrap Modal
   * Mandatory acceptance checkbox - blocks interaction until checked
   */
  function createTermsClickwrapModal() {
    const modalHtml = `
      <div class="tos-modal-overlay" id="tosModalOverlay">
        <div class="tos-modal" role="alertdialog" aria-labelledby="tosModalTitle" aria-describedby="tosModalBody">
          <div class="tos-modal-content">
            <h2 id="tosModalTitle" class="tos-modal-title">Terms of Service Agreement Required</h2>

            <div id="tosModalBody" class="tos-modal-body">
              <p><strong>Before using the FITREP Evaluator, you must review and agree to our Terms of Service.</strong></p>

              <div class="tos-summary" style="background: #f9f9f9; padding: 12px; border-radius: 4px; margin: 12px 0; font-size: 13px; line-height: 1.5;">
                <p style="margin-top: 0;"><strong>Key Points:</strong></p>
                <ul style="margin: 8px 0; padding-left: 20px;">
                  <li>Use only synthetic data from the provided fixture</li>
                  <li>Do not enter real Marine names, EDIPIs, or PII</li>
                  <li>Output is for methodology evaluation only, not official submission</li>
                  <li>No data persists beyond your session</li>
                  <li>Provided as-is with no warranty</li>
                </ul>
              </div>

              <div class="tos-links" style="margin: 12px 0; padding: 12px; background: #f0f7ff; border-left: 3px solid #2196F3; border-radius: 2px;">
                <p style="margin: 0 0 8px 0; font-size: 12px;">
                  View full documents:
                  <a href="#" class="legal-link-inline" data-doc="terms" onclick="event.preventDefault(); openLegalDocumentModal('terms');">Terms of Service</a> &nbsp;·&nbsp;
                  <a href="#" class="legal-link-inline" data-doc="privacy" onclick="event.preventDefault(); openLegalDocumentModal('privacy');">Privacy Policy</a> &nbsp;·&nbsp;
                  <a href="#" class="legal-link-inline" data-doc="disclaimer" onclick="event.preventDefault(); openLegalDocumentModal('disclaimer');">Disclaimer</a>
                </p>
              </div>
            </div>

            <div class="tos-checkbox-group" style="margin: 16px 0; padding: 12px; background: #fffbf0; border: 1px solid #ffc107; border-radius: 4px;">
              <label style="display: flex; align-items: flex-start; cursor: pointer; font-size: 13px;">
                <input
                  type="checkbox"
                  id="tosCheckbox"
                  class="tos-acceptance-checkbox"
                  style="margin-right: 8px; margin-top: 2px; cursor: pointer;"
                  aria-label="I agree to the Terms of Service"
                />
                <span style="flex: 1; line-height: 1.4;">
                  <strong>I have read and agree to the Terms of Service, Privacy Policy, and As-Is Disclaimer.</strong> I understand that this is a proof-of-concept tool with synthetic data only, and output is not valid for official submission.
                </span>
              </label>
            </div>

            <div class="tos-button-group" style="display: flex; gap: 8px; margin-top: 16px;">
              <button
                type="button"
                class="btn btn-primary"
                id="tosAcceptBtn"
                disabled
                style="flex: 1; opacity: 0.5; cursor: not-allowed;"
              >
                I Accept - Continue to Application
              </button>
            </div>

            <p style="font-size: 11px; color: #666; margin-top: 12px; text-align: center;">
              By clicking "I Accept," you acknowledge you have read the legal documents and agree to operate within PoC constraints.
            </p>
          </div>
        </div>
      </div>
    `;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = modalHtml.trim();
    const modal = wrapper.firstChild;
    document.body.appendChild(modal);

    // Initialize checkbox and button state
    const checkbox = document.getElementById('tosCheckbox');
    const acceptBtn = document.getElementById('tosAcceptBtn');

    checkbox.addEventListener('change', (e) => {
      acceptBtn.disabled = !e.target.checked;
      acceptBtn.style.opacity = e.target.checked ? '1' : '0.5';
      acceptBtn.style.cursor = e.target.checked ? 'pointer' : 'not-allowed';
    });

    acceptBtn.addEventListener('click', () => {
      if (checkbox.checked) {
        acceptTermsOfService();
      }
    });

    return modal;
  }

  /**
   * Accept Terms of Service
   * Records consent in session memory and unlocks the application
   */
  function acceptTermsOfService() {
    CONSENT_STATE.termsAccepted = true;
    CONSENT_STATE.acceptanceTimestamp = new Date().toISOString();
    CONSENT_STATE.acceptanceAcknowledged = true;

    // Tear down through ModalController so the focus trap, body lock, and stack
    // entry are released before the node is removed.
    try { if (window.ModalController) window.ModalController.closeById('tosModalOverlay'); } catch (_) {}
    const overlay = document.getElementById('tosModalOverlay');
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }

    // Show app content if it was hidden
    document.querySelectorAll('.tos-app-hidden').forEach(el => {
      el.classList.remove('tos-app-hidden');
    });

    console.log('[legalConsent] Terms of Service accepted. Consent recorded:', CONSENT_STATE.acceptanceTimestamp);
  }

  /**
   * Initialize Legal Consent System
   * Called on DOMContentLoaded to enforce ToS acceptance before app use
   */
  function initializeLegalConsent() {
    // Only show ToS modal if pocBanner acknowledgment is complete
    // Timing: pocBanner.js runs first and gates the app. After user acknowledges PoC warning,
    // this layer adds Terms of Service acceptance.

    // Wait a moment for pocBanner to complete
    setTimeout(() => {
      // Check if PoC modal is still visible (acknowledgment not yet complete)
      const pocModal = document.getElementById('pocModalOverlay');
      if (pocModal && pocModal.offsetParent !== null) {
        // PoC acknowledgment not complete yet. Retry after a delay.
        console.log('[legalConsent] Waiting for PoC acknowledgment to complete...');
        setTimeout(initializeLegalConsent, 500);
        return;
      }

      // PoC acknowledgment is complete. Now enforce ToS.
      const tosModal = createTermsClickwrapModal();

      // Hide app content behind ToS modal
      document.querySelectorAll('body > *:not(#tosModalOverlay):not(#stickyChrome):not(#pocModalOverlay)').forEach(el => {
        el.classList.add('tos-app-hidden');
      });

      // Route the gate through the app modal system so keyboard focus is
      // trapped within the dialog (Tab cycles, focus starts on the checkbox).
      try {
        if (window.ModalController) {
          window.ModalController.register('tosModalOverlay', {
            labelledBy: 'tosModalTitle',
            describedBy: 'tosModalBody',
            focusFirst: '#tosCheckbox',
            closeOnBackdrop: false
          });
          window.ModalController.openById('tosModalOverlay');
        } else if (window.A11y && typeof window.A11y.openDialog === 'function') {
          window.A11y.openDialog(tosModal, {
            labelledBy: 'tosModalTitle',
            describedBy: 'tosModalBody',
            focusFirst: '#tosCheckbox'
          });
        }
      } catch (_) {}

      console.log('[legalConsent] Terms of Service acceptance required.');
    }, 100);

    // Initialize Legal Hub footer links
    initializeLegalHub();
  }

  /**
   * Public API: Get Consent State
   * Used by other modules to verify consent status
   */
  window.getLegalConsentState = function() {
    return Object.freeze({ ...CONSENT_STATE });
  };

  /**
   * Public API: Re-present the Terms of Service gate.
   * Used by action-level consent guards when consent is missing (e.g. the
   * overlay was dismissed from the console).
   */
  window.showTermsOfServiceGate = function() {
    if (!CONSENT_STATE.termsAccepted && !document.getElementById('tosModalOverlay')) {
      initializeLegalConsent();
    }
  };

  /**
   * Public API: View Legal Document
   * External modules can request a legal document modal
   */
  window.openLegalDocumentModal = openLegalDocumentModal;

  /**
   * Initialization Hook
   */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLegalConsent);
  } else {
    // DOM already loaded (rare but possible if this script loads late)
    setTimeout(initializeLegalConsent, 0);
  }

  console.log('[legalConsent] Legal consent management system loaded.');
})();
