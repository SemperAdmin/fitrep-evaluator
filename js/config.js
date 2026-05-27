/**
 * FITREP Evaluator - PoC Configuration
 *
 * PROOF OF CONCEPT. NOT A SYSTEM OF RECORD.
 *
 * All cloud, GitHub, Supabase, Render, authentication, and persistence
 * configuration has been removed under Phase 1 of the PoC compliance
 * realignment. See PoC-CHARTER.md, paragraph 4 constraints.
 */
(function () {
  'use strict';

  // Application identity
  const APP_CONFIG = {
    appName: 'FITREP Evaluator (PoC)',
    appVersion: '3.0.0-poc',
    posture: 'proof-of-concept',
    sessionTimeoutMs: 30 * 60 * 1000
  };

  // Input policy - synthetic fixture only
  const INPUT_POLICY = {
    syntheticOnly: true,
    fixtureSource: 'js/syntheticFixture.js',
    realDataPermitted: false,
    bannerAcknowledgmentRequired: true
  };

  // Network policy - hard prohibition on external calls
  const NETWORK_POLICY = {
    fetchAllowed: false,
    xhrAllowed: false,
    webSocketAllowed: false,
    externalEndpoints: []
  };

  // Persistence policy - in-memory only
  const PERSISTENCE_POLICY = {
    localStorage: false,
    sessionStorage: false,
    indexedDB: false,
    cookies: false,
    inMemoryOnly: true
  };

  // Trait grade definitions used by the methodology engine. These are policy
  // text drawn from publicly published FITREP guidance, not personnel data.
  const VALIDATION = {
    syntheticIdPattern: /^MARINE_[A-Z]+_\d{2}$/,
    periodPattern: /^\d{4}-Q[1-4]$/
  };

  // Expose to the rest of the application
  if (typeof window !== 'undefined') {
    window.APP_CONFIG = Object.freeze(APP_CONFIG);
    window.INPUT_POLICY = Object.freeze(INPUT_POLICY);
    window.NETWORK_POLICY = Object.freeze(NETWORK_POLICY);
    window.PERSISTENCE_POLICY = Object.freeze(PERSISTENCE_POLICY);
    window.VALIDATION = Object.freeze(VALIDATION);

    // Defensive guard - if any module attempts to call fetch, log and block
    if (window.fetch && !window.__POC_FETCH_BLOCKED__) {
      const originalFetch = window.fetch;
      window.fetch = function blockedFetch() {
        console.error('[poc-guard] fetch() call blocked. PoC mode prohibits external network I/O. Arguments:', arguments);
        throw new Error('Network I/O is prohibited in PoC mode. See PoC-CHARTER.md paragraph 4.');
      };
      window.__POC_FETCH_BLOCKED__ = true;
    }

    // Defensive guard - block localStorage writes
    try {
      const origSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = function pocBlockedSetItem(key, value) {
        console.error('[poc-guard] Storage.setItem blocked. Key:', key);
        throw new Error('Persistent storage is prohibited in PoC mode. See PoC-CHARTER.md paragraph 4.');
      };
    } catch (e) {
      console.warn('[poc-guard] Could not patch Storage.setItem:', e);
    }
  }

  console.log('[config] FITREP Evaluator PoC configuration loaded.');
  console.log('[config] Posture:', APP_CONFIG.posture);
  console.log('[config] Network policy:', NETWORK_POLICY);
  console.log('[config] Persistence policy:', PERSISTENCE_POLICY);
})();
