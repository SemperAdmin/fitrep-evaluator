// Centralized error sink. Replaces silent empty catch blocks: every caught
// error is logged to the console and surfaced once via a throttled, dismissible
// banner. The banner is self-styled (no CSS dependency) and never throws.
(function () {
  'use strict';

  let lastBannerAt = 0;
  const BANNER_COOLDOWN_MS = 8000;
  const BANNER_AUTOHIDE_MS = 6000;

  function showBanner(message) {
    // Never throw from the error sink itself.
    try {
      if (typeof document === 'undefined' || !document.body) return;
      const now = Date.now();
      if (now - lastBannerAt < BANNER_COOLDOWN_MS) return; // avoid spam
      lastBannerAt = now;

      let banner = document.getElementById('appErrorBanner');
      if (!banner) {
        banner = document.createElement('div');
        banner.id = 'appErrorBanner';
        banner.setAttribute('role', 'alert');
        banner.setAttribute('aria-live', 'assertive');
        banner.style.cssText = [
          'position:fixed', 'left:50%', 'bottom:16px', 'transform:translateX(-50%)',
          'max-width:90%', 'z-index:2147483647', 'background:#b00020', 'color:#fff',
          'padding:10px 14px', 'border-radius:6px', 'font:13px/1.4 Arial, sans-serif',
          'box-shadow:0 2px 8px rgba(0,0,0,0.3)', 'display:flex', 'align-items:center',
          'gap:12px'
        ].join(';');

        const text = document.createElement('span');
        text.className = 'app-error-banner-text';

        const close = document.createElement('button');
        close.type = 'button';
        close.setAttribute('aria-label', 'Dismiss');
        close.textContent = '×';
        close.style.cssText = 'background:none;border:none;color:#fff;font-size:18px;line-height:1;cursor:pointer;padding:0;';
        close.addEventListener('click', function () {
          if (banner && banner.parentNode) banner.parentNode.removeChild(banner);
        });

        banner.appendChild(text);
        banner.appendChild(close);
        document.body.appendChild(banner);
      }

      const textEl = banner.querySelector('.app-error-banner-text');
      if (textEl) textEl.textContent = message;

      window.setTimeout(function () {
        if (banner && banner.parentNode) banner.parentNode.removeChild(banner);
      }, BANNER_AUTOHIDE_MS);
    } catch (_) { /* error sink must not throw */ }
  }

  /**
   * Log a caught error to the console and surface a throttled banner.
   * @param {*} error The caught error.
   * @param {string} [context] Optional context label.
   */
  function logError(error, context) {
    try { console.warn('[fitrep]', context || 'Unexpected error', error); } catch (_) { /* noop */ }
    showBanner('Something went wrong. Your draft is unaffected — see the console for details.');
  }

  try { window.logError = logError; } catch (_) { /* noop */ }
})();
