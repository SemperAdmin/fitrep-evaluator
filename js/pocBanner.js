/**
 * FITREP Evaluator - PoC Banner and Forced Acknowledgment
 *
 * Enforces paragraph 4.g of the PoC Charter Memo. Every page load presents
 * a modal acknowledgment gate. The user cannot interact with the methodology
 * aid until the acknowledgment is signed in-session.
 *
 * The persistent top-of-page banner remains visible after acknowledgment.
 * Acknowledgment does NOT persist across reloads, by design.
 *
 * Layout: Banner injects as the FIRST CHILD of #stickyChrome so it stacks
 * with the app header inside a single sticky block. If #stickyChrome is
 * missing, banner falls back to body.firstChild for safe degradation.
 */
(function () {
  'use strict';

  const ACK_HTML = `
    <div class="poc-modal-overlay" id="pocModalOverlay">
      <div class="poc-modal" role="alertdialog" aria-labelledby="pocModalTitle" aria-describedby="pocModalBody">
        <h2 id="pocModalTitle">Proof of Concept - Acknowledgment Required</h2>
        <div id="pocModalBody">
          <p>This tool is a methodology Proof of Concept. It is not a system of record. It is not authorized to process Personally Identifiable Information or Controlled Unclassified Information.</p>
          <p>By proceeding, you acknowledge the following constraints under the signed PoC Charter Memo:</p>
          <ul>
            <li>No real Marine names, EDIPIs, ranks tied to identifiable individuals, or evaluation periods.</li>
            <li>No real performance narratives, comments, or directed remarks.</li>
            <li>Use only the synthetic data fixture loaded with this application.</li>
            <li>Outputs are not submitted up the chain of command and are not attached to any authorized Fitness Report.</li>
            <li>Violation converts this PoC into an unauthorized live system and triggers incident handling.</li>
          </ul>
          <p><strong>If you cannot operate within these constraints, close this page now.</strong></p>
        </div>
        <button class="poc-accept" id="pocAcceptBtn" type="button">I acknowledge and will operate within these constraints</button>
      </div>
    </div>
  `;

  const BANNER_HTML = `
    <div class="poc-banner" role="banner" aria-label="Proof of Concept Warning">
      <span class="poc-banner__title">UNCLASSIFIED &middot; PROOF OF CONCEPT &middot; METHODOLOGY AID ONLY &middot; SYNTHETIC DATA ONLY</span>
    </div>
  `;

  function hideApp() {
    // Hide every direct child of body EXCEPT the modal overlay AND the sticky
    // chrome. The chrome contains the banner and the header, which both stay
    // visible during acknowledgment so the user sees the warning in context.
    document.querySelectorAll('body > *:not(#pocModalOverlay):not(#stickyChrome)').forEach(el => {
      el.classList.add('poc-app-hidden');
    });
  }

  function showApp() {
    document.querySelectorAll('.poc-app-hidden').forEach(el => {
      el.classList.remove('poc-app-hidden');
    });
  }

  function injectBanner() {
    const wrap = document.createElement('div');
    wrap.innerHTML = BANNER_HTML.trim();
    const bannerEl = wrap.firstChild;

    const stickyChrome = document.getElementById('stickyChrome');
    if (stickyChrome) {
      // Preferred path: banner stacks above the app header inside the chrome.
      stickyChrome.insertBefore(bannerEl, stickyChrome.firstChild);
    } else {
      // Fallback: banner sits at the top of body. Used only if the HTML
      // structure has drifted from what this PoC ships with.
      console.warn('[poc-banner] #stickyChrome not found. Banner injected at body root.');
      document.body.insertBefore(bannerEl, document.body.firstChild);
    }
  }

  function injectAckModal() {
    const wrap = document.createElement('div');
    wrap.innerHTML = ACK_HTML.trim();
    document.body.appendChild(wrap.firstChild);
    document.getElementById('pocAcceptBtn').addEventListener('click', () => {
      const overlay = document.getElementById('pocModalOverlay');
      if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
      showApp();
      console.log('[poc-banner] Acknowledgment accepted. Methodology aid unlocked for this session.');
    });
  }

  function init() {
    injectBanner();
    hideApp();
    injectAckModal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
