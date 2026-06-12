// Core form validation utilities: pure functions suitable for unit testing
// Provides rule parsing, validators, and error message generation.

// UMD-style export: attach to window and CommonJS for tests
(function(){
  const ValidationRules = {
  required: (value) => {
    const v = String(value ?? '').trim();
    return v.length > 0;
  },
  minLength: (value, len) => {
    const v = String(value ?? '');
    const n = Number(len) || 0;
    return v.trim().length >= n;
  },
  maxLength: (value, len) => {
    const v = String(value ?? '');
    const n = Number(len) || Infinity;
    return v.trim().length <= n;
  },
  pattern: (value, regexSource) => {
    try {
      const re = new RegExp(regexSource);
      return re.test(String(value ?? ''));
    } catch (_) {
      return true; // ignore bad patterns
    }
  },
  username: (value) => {
    const v = String(value ?? '').trim();
    if (v.length < 3 || v.length > 50) return false;
    return /^[a-zA-Z0-9._-]+$/.test(v);
  },
  rankLabel: (value) => {
    const v = String(value ?? '').trim();
    return v.length >= 2 && v.length <= 20;
  },
  nameLabel: (value) => {
    const v = String(value ?? '').trim();
    return v.length >= 2 && v.length <= 100;
  }
  };

  function parseRules(dataRules) {
  // data-rules="required|minLength:2|maxLength:20"
  if (!dataRules) return [];
  return String(dataRules)
    .split('|')
    .map(r => r.trim())
    .filter(Boolean)
    .map(rule => {
      const [name, ...rest] = rule.split(':');
      const params = rest.length ? rest.join(':').split(',') : [];
      return { name, params };
    });
  }

  function validateValue(value, rules = []) {
  let isValid = true;
  let failedRule = null;
  for (const r of rules) {
    const fn = ValidationRules[r.name];
    if (typeof fn === 'function') {
      const ok = fn(value, ...(r.params || []));
      if (!ok) { isValid = false; failedRule = r; break; }
    }
  }
  return { isValid, failedRule };
  }

  function errorMessageFor(fieldLabel, rule) {
  const label = String(fieldLabel || 'Field');
  const name = rule?.name || 'required';
  const p = rule?.params || [];
  // Canonical validation messages (formerly duplicated in js/shared/validation).
  switch (name) {
    case 'required':
      return `${label} is required.`;
    case 'minLength': {
      const n = Number(p[0] || 0);
      return `${label} must be at least ${n} characters.`;
    }
    case 'maxLength': {
      const n = Number(p[0] || 0);
      return `${label} must be at most ${n} characters.`;
    }
    case 'username':
      return `${label} must be 3–50 chars; letters, numbers, . _ - only.`;
    case 'rankLabel':
      return `${label} must be 2–20 characters.`;
    case 'nameLabel':
      return `${label} must be 2–100 characters.`;
    case 'pattern':
      return `${label} has an invalid format.`;
    default:
      return `${label} is invalid.`;
  }
  }

// Validate a single field value with labeled rules
  function validateField({ value, label, dataRules }) {
  const rules = Array.isArray(dataRules) ? dataRules : parseRules(dataRules);
  const { isValid, failedRule } = validateValue(value, rules);
  return {
    valid: isValid,
    message: isValid ? '' : errorMessageFor(label, failedRule)
  };
  }

// Validate all fields in a payload object: { fieldName: { value, label, dataRules } }
  function validateFormPayload(payload) {
  const result = { valid: true, fields: {}, messages: [] };
  for (const [key, meta] of Object.entries(payload || {})) {
    const v = validateField(meta);
    result.fields[key] = v;
    if (!v.valid) { result.valid = false; result.messages.push(v.message); }
  }
  return result;
  }

  // --- Rank-aware occasion-code validation (MCO 1610.7B ch. 3) ---
  // Order of rules below mirrors docs/MCO_1610.7B.md.

  // The thirteen occasion codes for grades Sergeant through Colonel,
  // listed in precedence order (MCO 1610.7B, ch. 3, paras 3b/3c; md:1196-1220).
  const ALL_OCCASIONS = Object.freeze(['GC','DC','CH','TR','CD','TD','FD','EN','CS','AN','AR','SA','RT']);

  // Non-lieutenants (Sgt–Col except 2ndLt/1stLt): SA is lieutenants-only
  // (md:1219,1508-1511) and AN is allowed; SA is excluded.
  const NOT_LT = ALL_OCCASIONS.filter(c => c !== 'SA');

  // Lieutenants (2ndLt/1stLt): SA allowed, AN excluded (md:1460-1461).
  const LT = ALL_OCCASIONS.filter(c => c !== 'AN');

  // Allowed occasion codes per #marineRankSelect option value.
  // Sgt–Col use NOT_LT, lieutenants use LT. General officer rows are
  // auditable per md:1185-1194: MajGen = CH,TR,GC,TD,FD; BGen adds AN;
  // Gen & LtGen receive no evaluations (md:1187-1188).
  const RANK_ALLOWED_OCCASIONS = Object.freeze({
    Sgt: NOT_LT,
    SSgt: NOT_LT,
    GySgt: NOT_LT,
    MSgt: NOT_LT,
    '1stSgt': NOT_LT,
    MGySgt: NOT_LT,
    SgtMaj: NOT_LT,
    WO: NOT_LT,
    CWO2: NOT_LT,
    CWO3: NOT_LT,
    CWO4: NOT_LT,
    CWO5: NOT_LT,
    '2ndLt': LT,
    '1stLt': LT,
    Capt: NOT_LT,
    Maj: NOT_LT,
    LtCol: NOT_LT,
    Col: NOT_LT,
    BGen: Object.freeze(['CH','TR','GC','TD','FD','AN']),
    MajGen: Object.freeze(['CH','TR','GC','TD','FD']),
    LtGen: Object.freeze([]),
    Gen: Object.freeze([])
  });

  /**
   * Return the array of occasion codes allowed for a given rank.
   * @param {string} rank Rank key matching #marineRankSelect option values.
   * @returns {string[]|null} Allowed codes, or null if the rank is unknown.
   */
  function getAllowedOccasions(rank) {
    return Object.prototype.hasOwnProperty.call(RANK_ALLOWED_OCCASIONS, rank)
      ? RANK_ALLOWED_OCCASIONS[rank]
      : null;
  }

  /**
   * Validate a rank/occasion combination per MCO 1610.7B ch. 3.
   * Empty rank or occasion is treated as valid (the required-field check owns
   * that). Unknown ranks fail open (and are logged) so the gate never blocks a
   * legitimate workflow on map drift.
   * @param {string} rank Rank key matching #marineRankSelect option values.
   * @param {string} occasion Occasion code from ALL_OCCASIONS.
   * @returns {{valid: boolean, message?: string}}
   */
  function validateRankOccasion(rank, occasion) {
    if (!rank || !occasion) return { valid: true };
    const allowed = getAllowedOccasions(rank);
    if (allowed === null) {
      if (typeof logError === 'function') logError(new Error('Unknown rank in occasion validation: ' + rank));
      return { valid: true };
    }
    if (allowed.indexOf(occasion) !== -1) return { valid: true };
    // Generals and Lieutenant Generals receive no evaluations (md:1187-1188).
    if (rank === 'Gen' || rank === 'LtGen') {
      return {
        valid: false,
        message: 'Generals and Lieutenant Generals do not receive performance evaluations (MCO 1610.7B, ch. 3, para 3b). Selected rank: ' + rank + '.'
      };
    }
    // SA is for Second and First Lieutenants only (md:1219,1508-1511).
    if (occasion === 'SA') {
      return {
        valid: false,
        message: 'Semiannual (SA) reports are for Second and First Lieutenants only (MCO 1610.7B, ch. 3). Selected rank: ' + rank + '.'
      };
    }
    // AN excludes lieutenants; active-duty lieutenants receive SA (md:1460-1461).
    if (occasion === 'AN') {
      return {
        valid: false,
        message: 'Annual (AN) reports exclude Second and First Lieutenants (MCO 1610.7B, ch. 3); active-duty lieutenants receive Semiannual (SA) reports.'
      };
    }
    // Generic fallback (e.g. a general-officer occasion not on their list).
    return {
      valid: false,
      message: 'Occasion ' + occasion + ' is not authorized for the selected rank ' + rank + ' (MCO 1610.7B, ch. 3).'
    };
  }

  // Export
  try { window.FormValidationCore = { ValidationRules, parseRules, validateValue, errorMessageFor, validateField, validateFormPayload, ALL_OCCASIONS, RANK_ALLOWED_OCCASIONS, getAllowedOccasions, validateRankOccasion }; } catch (_) { if (typeof logError === "function") logError(_); }
  if (typeof module !== 'undefined') {
    module.exports = { ValidationRules, parseRules, validateValue, errorMessageFor, validateField, validateFormPayload, ALL_OCCASIONS, RANK_ALLOWED_OCCASIONS, getAllowedOccasions, validateRankOccasion };
  }
})();
