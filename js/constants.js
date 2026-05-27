// Centralized constants module to eliminate magic numbers and hardcoded strings
// Provides a single source of truth for configuration, UI values, routes, and messages
// Exposes globals for browser via window.CONSTANTS and CommonJS exports for Node
(function(){
  /**
   * UI display values
   * @typedef {{ BLOCK: string, NONE: string, FLEX?: string, INLINE_BLOCK?: string, SHOW?: string, HIDE?: string }} DisplayValues
   */
  /**
   * Common CSS class names used across UI components
   * @typedef {{ ACTIVE: string, ONLINE: string, OFFLINE: string }} CssClasses
   */
  /**
   * API paths used by the client and server
   * @typedef {{
   *   ACCOUNT_CREATE: string,
   *   ACCOUNT_LOGIN: string,
   *   ACCOUNT_LOGOUT?: string,
   *   ACCOUNT_AVAILABLE?: string,
   *   GITHUB_TOKEN: string,
   *   SAVE_EVALUATION?: string,
   *   SAVE_USER_DATA?: string,
   *   USER_SAVE?: string,
   *   USER_LOAD?: string,
   *   EVALUATIONS_LIST?: string,
   *   EVALUATION_SAVE?: string,
   *   FEEDBACK?: string,
   *   ADMIN_BASE?: string
   * }} ApiPaths
   */
  /**
   * Human-facing status messages shown in the UI
   * @typedef {{ ONLINE: string, OFFLINE: string }} StatusMessages
   */
  /**
   * Modal configuration values
   * @typedef {{ ACTIVE_CLASS: string, Z_INDEX_BASE: number }} ModalConfig
   */

  /**
   * API configuration constants.
   * Purpose: Phase 1 stripped all external API endpoints. PoC mode has no backend.
   * If a future module attempts to read API_CONFIG.RENDER_URL, the lookup fails
   * loud and that module needs review.
   */
  const API_CONFIG = {};

  /**
   * Canonical API route paths.
   * Purpose: Prevent typos and drift between client and server route definitions.
   */
  const ROUTES = {
    API: /** @type {ApiPaths} */({
      ACCOUNT_CREATE: '/api/account/create',
      ACCOUNT_LOGIN: '/api/account/login',
      ACCOUNT_LOGOUT: '/api/account/logout',
      ACCOUNT_AVAILABLE: '/api/account/available',
      GITHUB_TOKEN: '/api/github-token',
      SAVE_EVALUATION: '/api/save-evaluation',
      SAVE_USER_DATA: '/api/save-user-data',
      USER_SAVE: '/api/user/save',
      USER_LOAD: '/api/user/load',
      EVALUATIONS_LIST: '/api/evaluations/list',
      EVALUATION_SAVE: '/api/evaluation/save',
      FEEDBACK: '/api/feedback',
      ADMIN_BASE: '/api/admin'
    })
  };

  /**
   * UI settings and common values.
   * Purpose: Ensure consistent use of display values and class names.
   */
  const UI_SETTINGS = {
    DISPLAY: /** @type {DisplayValues} */({
      BLOCK: 'block',
      NONE: 'none',
      FLEX: 'flex',
      INLINE_BLOCK: 'inline-block',
      SHOW: 'block', // Alias for app.js compatibility
      HIDE: 'none'   // Alias for app.js compatibility
    }),
    CSS: /** @type {CssClasses} */({
      ACTIVE: 'active',
      ONLINE: 'online',
      OFFLINE: 'offline'
    }),
    TIMINGS: {
      /** Base z-index for modal stack (higher numbers are above) */
      MODAL_Z_INDEX_BASE: 1000,
      /** Default modal animation duration in milliseconds */
      MODAL_ANIMATION_MS: 200
    }
  };

  /**
   * Standard error messages for common failure conditions.
   * Purpose: Keep messages consistent across modules.
   */
  const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Connection lost. Retrying...',
    VALIDATION_ERROR: 'Please check your input and try again.',
    AUTHENTICATION_ERROR: 'Session expired. Please log in again.'
  };

  /**
   * Standard status messages for connectivity state shown to users.
   * Purpose: Unify online/offline UI text across screens.
   */
  const STATUS_MESSAGES = /** @type {StatusMessages} */({
    ONLINE: 'Connected - Sync available',
    OFFLINE: 'Offline - Changes saved locally'
  });

  /**
   * Modal configuration values for consistent behavior.
   * Purpose: Align modal class names and layering.
   */
  const MODAL_CONFIG = /** @type {ModalConfig} */({
    ACTIVE_CLASS: UI_SETTINGS.CSS.ACTIVE,
    Z_INDEX_BASE: UI_SETTINGS.TIMINGS.MODAL_Z_INDEX_BASE
  });

  const CONSTANTS = { API_CONFIG, ROUTES, UI_SETTINGS, ERROR_MESSAGES, STATUS_MESSAGES, MODAL_CONFIG };

  try { window.CONSTANTS = CONSTANTS; } catch (_) {}
  if (typeof module !== 'undefined') {
    module.exports = CONSTANTS;
  }
})();
