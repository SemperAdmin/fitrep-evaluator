// Utility Functions

/**
 * Debug logging utilities - only log when DEBUG_CREDENTIALS flag is enabled
 */
function debugLog(...args) {
    if (typeof window !== 'undefined' && window.DEBUG_CREDENTIALS) {
        console.log(...args);
    }
}

function debugWarn(...args) {
    if (typeof window !== 'undefined' && window.DEBUG_CREDENTIALS) {
        console.warn(...args);
    }
}

/**
 * Get CSRF token for API requests.
 * PoC: There are no API requests in PoC mode. No backend exists.
 * Returns null so any caller short-circuits cleanly.
 *
 * @returns {null} Always null in PoC mode.
 */
function getCsrfToken() {
    return null;
}

function getGradeNumber(grade) {
    const gradeNumbers = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 0 };
    return gradeNumbers[grade];
}

const MIN_OBSERVED_GRADE_VALUE = 1; // A
const MAX_OBSERVED_GRADE_VALUE = 7; // G
/** Whether a numeric grade value represents an observed A-G mark (H=0 excluded per md:7568-7577). */
function isObservedGradeValue(value) {
    const n = Number(value);
    return Number.isFinite(n) && n >= MIN_OBSERVED_GRADE_VALUE && n <= MAX_OBSERVED_GRADE_VALUE;
}

function updateWordCount() {
    const textarea = document.getElementById('justificationText');
    const counter = document.getElementById('wordCount');
    
    if (!textarea || !counter) return;
    
    const words = textarea.value.trim().split(/\s+/).filter(word => word.length > 0);
    const count = words.length;
    
    counter.textContent = `${count} words`;
    counter.className = 'word-count';
    
    if (count < 20) {
        counter.classList.add('error');
    } else if (count < 30) {
        counter.classList.add('warning');
    }
}


function calculateFitrepAverage() {
    // Excel-style aliases for the 13/14 attributes
    const traitAliases = {
        Perf: ['Performance'],
        Prof: ['Proficiency'],
        Courage: ['Courage'],
        Stress: ['Effectiveness Under Stress', 'Stress Tolerance'],
        Initiative: ['Initiative'],
        Leading: ['Leading Subordinates', 'Leading'],
        Develop: ['Developing Subordinates', 'Developing Others'],
        'Set Exp': ['Setting the Example'],
        'Well Being': ['Ensuring Well-being of Subordinates', 'Well-Being/Health', 'Well Being', 'Well-being'],
        'Comm Skill': ['Communication Skills'],
        PME: ['Professional Military Education (PME)', 'Professional Military Education', 'PME'],
        Decision: ['Decision Making Ability', 'Decision Making'],
        Judgement: ['Judgment', 'Judgement'],
        Evals: ['Evaluations'] // Section H
    };

    const items = Object.values(evaluationResults || {});
    // Resolve each alias to its observed numeric value, or null when the
    // attribute is absent or marked non-observed (H/0). Non-observed marks are
    // excluded from BOTH numerator and denominator per md:7568-7577, so a stray
    // H no longer depresses the average.
    const getObservedValue = (aliases) => {
        const found = items.find(t =>
            aliases.some(a => (t.trait || '').trim().toLowerCase() === a.toLowerCase())
        );
        if (!found) return null; // attribute not present (e.g. no Section H)
        return isObservedGradeValue(found.gradeNumber) ? Number(found.gradeNumber) : null;
    };

    const observedValues = Object.keys(traitAliases)
        .map(key => getObservedValue(traitAliases[key]))
        .filter(value => value !== null);

    const denom = observedValues.length;
    const total = observedValues.reduce((sum, value) => sum + value, 0);
    const avg = denom > 0 ? (total / denom) : 0;

    return avg.toFixed(2);
}

// Map of directed-comment keys that render a report adverse to a citation per
// MCO 1610.7B ch. 5. Keys verified against js/directedComments.js. Low averages,
// B/C marks, and decline are deliberately NOT triggers (md:5171-5190).
const ADVERSE_DIRECTED_COMMENT_REASONS = {
    relief_for_cause: 'Relief for cause (MCO 1610.7B ch. 5)',
    not_recommended: 'Not recommended for promotion (ch. 5 par. 3a(1)(c))',
    disciplinary_action: 'Disciplinary action (ch. 5 par. 3a(1)(b))',
    failed_pft_cft: 'PFT/CFT failure (ch. 5 par. 3a(1)(e))',
    bcp: 'Assignment to BCP (ch. 5 par. 3a(1)(f))',
    adverse_material: 'Adverse/derogatory material (ch. 5 par. 3a(1)(a))'
};

/**
 * Recompute, from current state, whether this report is adverse per
 * MCO 1610.7B ch. 5. In-scope triggers: any attribute marked "A" (sections
 * D-H; md:5169, 5954, 3193-3195) and user-selected adverse directed comments.
 * Body-composition is adverse only when the failing option is selected
 * (md:6646). Low averages / B-C marks / decline are NOT triggers (md:5171-5190).
 * No stored flag — caller recomputes on every render/export.
 * @returns {{isAdverse: boolean, aTraits: string[], reasons: string[]}}
 */
function getAdverseFindings() {
    const aTraits = [];
    const reasons = [];
    try {
        if (typeof evaluationResults === 'object' && evaluationResults) {
            Object.keys(evaluationResults).forEach(key => {
                const r = evaluationResults[key] || {};
                if (r.grade === 'A' || Number(r.gradeNumber) === 1) {
                    const section = String(r.section || '').trim();
                    const trait = String(r.trait || '').trim();
                    aTraits.push(section ? `${section}: ${trait}` : trait);
                }
            });
        }
        if (typeof selectedDirectedComments !== 'undefined'
            && Array.isArray(selectedDirectedComments)) {
            selectedDirectedComments.forEach(key => {
                if (Object.prototype.hasOwnProperty.call(ADVERSE_DIRECTED_COMMENT_REASONS, key)) {
                    reasons.push(ADVERSE_DIRECTED_COMMENT_REASONS[key]);
                } else if (key === 'body_composition') {
                    const data = (typeof directedCommentsData === 'object' && directedCommentsData)
                        ? (directedCommentsData[key] || {}) : {};
                    if (data.selectedOption === 'exceeds_whtr_and_body_fat') {
                        reasons.push('Body composition failure — exceeds WHtR and body fat standards (ch. 5 par. 3a(1)(f))');
                    }
                }
            });
        }
    } catch (_) { if (typeof logError === 'function') logError(_); }
    return { isAdverse: aTraits.length > 0 || reasons.length > 0, aTraits, reasons };
}

/**
 * Build the single plain-text paragraph that designates an adverse report and
 * states the notification requirement (detect/designate/state only — the MRO
 * acknowledgment/statement/rebuttal workflow is out of charter).
 * @param {{isAdverse: boolean, aTraits: string[], reasons: string[]}} findings
 * @returns {string} The adverse-notice paragraph.
 */
function buildAdverseNoticeText(findings) {
    const f = findings || { aTraits: [], reasons: [] };
    const aTraits = Array.isArray(f.aTraits) ? f.aTraits : [];
    const reasons = Array.isArray(f.reasons) ? f.reasons : [];
    return 'ADVERSE REPORT. One or more conditions render this report adverse per MCO 1610.7B ch. 5. '
        + (aTraits.length ? 'Attribute(s) marked "A": ' + aTraits.join('; ') + '. ' : '')
        + (reasons.length ? reasons.join('; ') + '. ' : '')
        + 'Required: notify the MRO when the report is routed and refer the adverse report to the MRO, '
        + 'who must be afforded the opportunity to make a statement (ch. 5). A third officer sighter must '
        + 'sight all adverse reports. Each "A" mark requires specific written justification (ch. 4 par. 7e).';
}

/**
 * Build the plain-text FITREP evaluation summary from current globals.
 * References evaluationMeta / evaluationResults at call time (kept bare,
 * matching the rest of utils.js). Output format is intentionally stable.
 * @returns {string} The full plain-text summary.
 */
function buildExportText() {
    const fitrepAverage = calculateFitrepAverage();
    let exportText = "USMC FITREP Evaluation Results\n";
    exportText += "================================\n\n";
    exportText += `Marine: ${evaluationMeta.marineName}\n`;
    exportText += `Period: ${evaluationMeta.fromDate} to ${evaluationMeta.toDate}\n`;
    exportText += `Reporting Senior: ${evaluationMeta.evaluatorName}\n`;
    exportText += `Completed: ${new Date().toLocaleDateString()}\n\n`;
    exportText += "FITREP Average: " + fitrepAverage + "\n";
    exportText += "Note: Raw 1-7 average of observed attribute marks (A=1 ... G=7).\n";
    exportText += "This is NOT the relative value; relative value is computed by HQMC\n";
    exportText += "against the Reporting Senior's profile (MCO 1610.7B, ch. 8).\n\n";

    const adverse = getAdverseFindings();
    if (adverse.isAdverse) {
        exportText += "ADVERSE REPORT DESIGNATION:\n";
        exportText += "===========================\n";
        exportText += buildAdverseNoticeText(adverse) + "\n\n";
    }

    exportText += "TRAIT EVALUATIONS:\n";
    exportText += "==================\n";
    Object.keys(evaluationResults).forEach(key => {
        const result = evaluationResults[key];
        exportText += `${result.section}: ${result.trait}\n`;
        exportText += `Grade: ${result.grade} (Value: ${result.gradeNumber})\n`;
        exportText += `Justification: ${result.justification}\n\n`;
    });

    if (evaluationMeta.sectionIComments && evaluationMeta.sectionIComments.trim()) {
        exportText += "SECTION I - NARRATIVE COMMENTS:\n";
        exportText += "===============================\n";
        exportText += `${evaluationMeta.sectionIComments}\n\n`;
    }

    if (evaluationMeta.directedComments && evaluationMeta.directedComments.trim()) {
        exportText += "SECTION I - DIRECTED COMMENTS:\n";
        exportText += "==============================\n";
        exportText += `${evaluationMeta.directedComments}\n\n`;
    }

    return exportText;
}

/**
 * Build a filesystem-safe export filename from the evaluation metadata.
 * Uses marineName / fromDate / toDate (dates are YYYY-MM-DD). Empty
 * segments are dropped; if all are empty, falls back to a generic name.
 * @returns {string} A sanitized .txt filename (basename capped ~80 chars).
 */
function buildExportFilename() {
    const meta = (typeof evaluationMeta === 'object' && evaluationMeta) ? evaluationMeta : {};
    /**
     * Sanitize a single filename segment to safe characters.
     * @param {*} v The raw value.
     * @returns {string} The sanitized segment (may be empty).
     */
    function sanitize(v) {
        return String(v || '').trim().replace(/[^A-Za-z0-9._-]+/g, '_').replace(/^_+|_+$/g, '');
    }
    const marine = sanitize(meta.marineName);
    const from = sanitize(meta.fromDate);
    const to = sanitize(meta.toDate);

    let basename;
    if (!marine && !from && !to) {
        basename = 'FITREP_Evaluation';
    } else {
        let parts = 'FITREP';
        if (marine) parts += '_' + marine;
        if (from) parts += '_' + from;
        if (to) parts += '_to_' + to;
        basename = parts;
    }
    if (basename.length > 80) basename = basename.slice(0, 80);
    return basename + '.txt';
}

/**
 * Show a toast if the global helper exists, otherwise fall back to alert().
 * @param {string} message The message to display.
 * @param {string} [type] The toast type (success/warning/error/info).
 * @returns {void}
 */
function notifyUser(message, type) {
    if (typeof window !== 'undefined' && typeof window.showToast === 'function') {
        window.showToast(message, type);
    } else {
        alert(message);
    }
}

/**
 * Download the current evaluation summary as a .txt file. No-op (with a
 * toast) when there is nothing to export. Uses a Blob + object URL +
 * temporary anchor; revocation is deferred so Safari does not abort.
 * @returns {void}
 */
function downloadExportFile() {
    if (Object.keys(evaluationResults).length === 0) {
        notifyUser('Nothing to export yet', 'warning');
        return;
    }
    try {
        const text = buildExportText();
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const name = buildExportFilename();
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        a.remove();
        // Defer revoke: a synchronous revoke can abort the download in Safari.
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        notifyUser('Download started: ' + name, 'success');
    } catch (err) {
        if (typeof logError === 'function') logError(err, 'downloadExportFile');
        notifyUser('Could not start the download.', 'error');
    }
}

/**
 * Fallback when the clipboard write fails or is unavailable: log, warn the
 * user, and download a .txt file instead.
 * @param {*} err The originating error.
 * @returns {void}
 */
function handleClipboardFailure(err) {
    if (typeof logError === 'function') logError(err, 'exportToClipboard');
    notifyUser('Clipboard unavailable — downloading a .txt file instead.', 'warning');
    downloadExportFile();
}

/**
 * Copy the current evaluation summary to the clipboard, falling back to a
 * .txt download if the clipboard API is unavailable or the write fails.
 * No-op (with a toast) when there is nothing to export.
 * @returns {void}
 */
function exportToClipboard() {
    if (Object.keys(evaluationResults).length === 0) {
        notifyUser('Nothing to export yet', 'warning');
        return;
    }
    const text = buildExportText();
    if (!navigator.clipboard
        || typeof navigator.clipboard.writeText !== 'function'
        || (typeof window.isSecureContext === 'boolean' && !window.isSecureContext)) {
        handleClipboardFailure(new Error('clipboard unavailable'));
        return;
    }
    try {
        navigator.clipboard.writeText(text)
            .then(() => notifyUser('Results copied to clipboard!', 'success'))
            .catch(handleClipboardFailure);
    } catch (err) {
        handleClipboardFailure(err);
    }
}

function resetEvaluation() {
    if (confirm('Are you sure you want to start over? All progress will be lost.')) {
        // Reset all state variables (clear objects/arrays without reassigning to preserve references)
        currentTraitIndex = 0;
        currentEvaluationLevel = 'B';
        // Clear objects by deleting properties instead of reassigning
        for (const key in evaluationResults) delete evaluationResults[key];
        allTraits.length = 0;
        isReportingSenior = false;
        pendingEvaluation = null;
        for (const key in evaluationMeta) delete evaluationMeta[key];
        selectedDirectedComments = [];
        directedCommentsData = {};
        generatedSectionI = '';
        currentGenerationStyle = 'comprehensive';

        location.reload();
    }
}

// --- Accessibility Helpers ---
// Lightweight utilities to support WCAG-compliant dialogs, focus, and announcements
const A11y = (function() {
    let liveRegionEl = null;
    function ensureLiveRegion() {
        if (liveRegionEl) return liveRegionEl;
        liveRegionEl = document.getElementById('srAnnouncements');
        if (!liveRegionEl) {
            liveRegionEl = document.createElement('div');
            liveRegionEl.id = 'srAnnouncements';
            liveRegionEl.setAttribute('aria-live', 'polite');
            liveRegionEl.setAttribute('role', 'status');
            liveRegionEl.style.position = 'absolute';
            liveRegionEl.style.width = '1px';
            liveRegionEl.style.height = '1px';
            liveRegionEl.style.padding = '0';
            liveRegionEl.style.margin = '-1px';
            liveRegionEl.style.overflow = 'hidden';
            liveRegionEl.style.clip = 'rect(0 0 0 0)';
            liveRegionEl.style.whiteSpace = 'nowrap';
            liveRegionEl.style.border = '0';
            document.body.appendChild(liveRegionEl);
        }
        return liveRegionEl;
    }

    function announce(message, politeness) {
        try {
            const el = ensureLiveRegion();
            if (politeness) el.setAttribute('aria-live', politeness);
            el.textContent = String(message || '');
        } catch (_) { if (typeof logError === "function") logError(_); }
    }

    function getFocusable(container) {
        const selectors = [
            'a[href]', 'button:not([disabled])', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])'
        ];
        return Array.from(container.querySelectorAll(selectors.join(',')))
            .filter(el => !el.hasAttribute('disabled') && el.tabIndex !== -1 && el.offsetParent !== null);
    }

    function trapFocus(modalEl) {
        function onKeyDown(e) {
            if (e.key !== 'Tab') return;
            const focusables = getFocusable(modalEl);
            if (!focusables.length) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            const active = document.activeElement;
            if (e.shiftKey) {
                if (active === first || !modalEl.contains(active)) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (active === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        }
        modalEl.__a11yTrap = onKeyDown;
        modalEl.addEventListener('keydown', onKeyDown);
    }

    function untrapFocus(modalEl) {
        const handler = modalEl.__a11yTrap;
        if (handler) modalEl.removeEventListener('keydown', handler);
        modalEl.__a11yTrap = null;
    }

    function openDialog(modalEl, opts = {}) {
        if (!modalEl) return;
        const { labelledBy, describedBy, focusFirst } = opts;
        // Dialog semantics
        modalEl.setAttribute('role', 'dialog');
        modalEl.setAttribute('aria-modal', 'true');
        if (labelledBy) modalEl.setAttribute('aria-labelledby', labelledBy);
        if (describedBy) modalEl.setAttribute('aria-describedby', describedBy);
        // Focus management
        modalEl.__lastFocused = document.activeElement;
        const target = focusFirst ? modalEl.querySelector(focusFirst) : getFocusable(modalEl)[0];
        try { if (target) target.focus(); } catch (_) { /* benign: focus is best-effort */ }
        trapFocus(modalEl);
        announce('Dialog opened');
    }

    function closeDialog(modalEl) {
        if (!modalEl) return;
        untrapFocus(modalEl);
        const last = modalEl.__lastFocused;
        modalEl.__lastFocused = null;
        try { if (last && typeof last.focus === 'function') last.focus(); } catch (_) { /* benign: focus is best-effort */ }
        announce('Dialog closed');
    }

    return { ensureLiveRegion, announce, openDialog, closeDialog };
})();

try { window.A11y = A11y; } catch (_) { if (typeof logError === "function") logError(_); }

function openHelpModal() {
    const modal = document.getElementById('helpModal');
    const trigger = document.getElementById('helpButton');
    if (!modal) return;
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    try {
        if (window.ModalController && typeof window.ModalController.openById === 'function') {
            window.ModalController.register('helpModal', { labelledBy: 'helpModalTitle', focusFirst: '.help-close' });
            window.ModalController.openById('helpModal');
            return;
        }
    } catch (_) { if (typeof logError === "function") logError(_); }
    // Fallback to previous behavior
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    A11y.openDialog(modal, { labelledBy: 'helpModalTitle', focusFirst: '.help-close' });
}

function closeHelpModal() {
    const modal = document.getElementById('helpModal');
    const trigger = document.getElementById('helpButton');
    if (!modal) return;
    try {
        if (window.ModalController && typeof window.ModalController.closeById === 'function') {
            window.ModalController.closeById('helpModal');
        } else {
            A11y.closeDialog(modal);
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
        }
    } catch (_) {
        A11y.closeDialog(modal);
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    }
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
}

// Global HTML escaping utilities for XSS safety
// Escapes special characters to prevent HTML injection when rendering user-provided content
function escapeHtml(str) {
    const s = String(str == null ? '' : str);
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Converts newlines to <br> tags after escaping, preserving line breaks safely
function nl2br(str) {
    const s = escapeHtml(str);
    return s.replace(/\r\n|\n|\r/g, '<br>');
}

// Expose globally for use across modules loaded via script tags
try {
    window.escapeHtml = escapeHtml;
    window.nl2br = nl2br;
    window.getAdverseFindings = getAdverseFindings;
    window.buildAdverseNoticeText = buildAdverseNoticeText;
    // Global toast helper for user-facing messages across the app
    window.showToast = window.showToast || function(message, type) {
        try {
            let container = document.getElementById('toastContainer');
            if (!container) {
                container = document.createElement('div');
                container.id = 'toastContainer';
                // Minimal inline styles to avoid CSS dependency
                container.style.position = 'fixed';
                container.style.right = '16px';
                // Position at top-right (instead of bottom-right)
                container.style.top = '16px';
                container.style.display = 'flex';
                container.style.flexDirection = 'column';
                container.style.gap = '8px';
                container.style.zIndex = '9999';
                document.body.appendChild(container);
            } else {
                // Ensure existing container is anchored top-right if previously bottom-right
                try {
                    container.style.top = '16px';
                    container.style.bottom = '';
                    container.style.right = '16px';
                } catch (_) { /* ignore */ }
            }

            const el = document.createElement('div');
            // Basic styling; match dark theme softly
            el.style.background = '#10141b';
            el.style.color = '#e5e7eb';
            el.style.border = '1px solid #2b3440';
            el.style.borderLeft = '4px solid ' + (type === 'success' ? '#16a34a' : (type === 'error' ? '#dc2626' : (type === 'warning' ? '#f59e0b' : '#3b82f6')));
            el.style.borderRadius = '6px';
            el.style.padding = '10px 12px';
            el.style.minWidth = '240px';
            el.style.boxShadow = '0 6px 14px rgba(0,0,0,0.3)';
            el.style.opacity = '0';
            el.style.transform = 'translateY(10px)';
            el.style.transition = 'opacity 150ms ease, transform 150ms ease';
            el.textContent = String(message || '');

            container.appendChild(el);
            // Force paint then show for transition
            requestAnimationFrame(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
            setTimeout(() => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(10px)';
                setTimeout(() => { try { el.remove(); } catch (_) { if (typeof logError === "function") logError(_); } }, 200);
            }, 4000);
        } catch (_) { /* ignore */ }
    };
 } catch (_) { /* ignore if window is not available */ }
