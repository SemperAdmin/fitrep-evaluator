// Centralized event delegation. Replaces inline on-event HTML attributes with a
// single document-level dispatcher keyed by data-action. Loaded LAST so every
// global handler it references is already defined. No modules, no deps.
(function () {
  'use strict';

  /**
   * Report a caught error through the central sink if present.
   * @param {*} err The caught error.
   */
  function report(err) {
    if (typeof window.logError === 'function') window.logError(err);
  }

  /**
   * Invoke a globally-exported function by name, if it exists.
   * @param {string} name The global function name on window.
   * @param {Array} [args] Arguments to apply.
   * @returns {*} The function's return value, or undefined if not callable.
   */
  function callGlobal(name, args) {
    var fn = window[name];
    if (typeof fn === 'function') return fn.apply(null, args || []);
    return undefined;
  }

  // data-action -> handler(el, event). Each handler runs inside try/catch.
  var CLICK_ACTIONS = {
    'open-help': function () { callGlobal('openHelpModal'); },
    'close-help': function () { callGlobal('closeHelpModal'); },
    'toggle-theme': function () { callGlobal('toggleTheme'); },
    'start-evaluation': function () { callGlobal('startEvaluation'); },
    'proceed-directed-comments': function () { callGlobal('proceedToDirectedComments'); },
    'generate-section-i': function () { callGlobal('generateSectionIComment'); },
    'regenerate-style': function (el) { callGlobal('regenerateWithStyle', [el.dataset.style]); },
    'finalize-section-i': function () { callGlobal('finalizeSectionI'); },
    'finalize-directed-comments': function () { callGlobal('finalizeDirectedComments'); },
    'print': function () { window.print(); },
    'export-copy': function () { callGlobal('exportToClipboard'); },
    'export-download': function () { callGlobal('downloadExportFile'); },
    'reset-evaluation': function () { callGlobal('resetEvaluation'); },
    'close-modal': function (el) {
      var mc = window.ModalController;
      if (mc && typeof mc.closeById === 'function') mc.closeById(el.dataset.modalId);
    },
    'open-legal-doc': function (el, e) {
      e.preventDefault();
      callGlobal('openLegalDocumentModal', [el.dataset.doc]);
    },
    'close-legal-doc': function (el) { callGlobal('closeLegalDocumentModal', [el.dataset.doc]); },
    'cancel-justification': function () { callGlobal('cancelJustification'); },
    'save-justification': function () { callGlobal('saveJustification'); },
    'cancel-reevaluation': function () { callGlobal('cancelReevaluation'); },
    'start-reevaluation': function () { callGlobal('startReevaluation'); },
    'start-standalone': function () { callGlobal('startStandaloneMode'); },
    'grade-action': function (el) { callGlobal('handleGradeAction', [el.dataset.grade]); },
    'edit-trait': function (el) { callGlobal('editTrait', [el.dataset.traitKey]); }
  };

  function updateDirectedComment(el) {
    callGlobal('updateDirectedCommentData', [el.dataset.commentKey, el.dataset.fieldKey, el.value]);
  }

  var CHANGE_ACTIONS = {
    'update-dynamic-comment': function (el) {
      callGlobal('updateDynamicComment', [el.dataset.commentKey, el.value]);
    },
    'update-directed-comment': updateDirectedComment,
    'accordion-toggle': function (el) {
      if (el.nextElementSibling) el.nextElementSibling.setAttribute('aria-expanded', el.checked);
      callGlobal('saveAccordionState', [el.dataset.accordionTitle, el.checked]);
    }
  };

  var INPUT_ACTIONS = {
    'update-directed-comment': updateDirectedComment
  };

  /**
   * Resolve the nearest [data-action] ancestor and run its mapped handler.
   * @param {Object} table The action table to look the handler up in.
   * @param {Event} event The DOM event.
   */
  function dispatch(table, event) {
    var el = event.target && event.target.closest ? event.target.closest('[data-action]') : null;
    if (!el) return;
    var handler = table[el.dataset.action];
    if (typeof handler !== 'function') return;
    try {
      handler(el, event);
    } catch (err) {
      report(err);
    }
  }

  document.addEventListener('click', function (e) {
    // Legal-modal backdrop close: only when the overlay element itself is clicked,
    // so clicks inside the content do not dismiss the modal.
    if (e.target && e.target.dataset && e.target.dataset.legalOverlay) {
      try {
        callGlobal('closeLegalDocumentModal', [e.target.dataset.legalOverlay]);
      } catch (err) {
        report(err);
      }
      return;
    }
    dispatch(CLICK_ACTIONS, e);
  });

  document.addEventListener('change', function (e) {
    dispatch(CHANGE_ACTIONS, e);
  });

  document.addEventListener('input', function (e) {
    dispatch(INPUT_ACTIONS, e);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var el = e.target && e.target.closest ? e.target.closest('[data-keyactivate]') : null;
    if (!el) return;
    e.preventDefault();
    el.click();
  });

  // Hide images flagged data-hide-on-error when they fail to load. Uses a
  // capturing listener because error events do not bubble.
  document.addEventListener('error', function (e) {
    var t = e.target;
    if (t && typeof t.matches === 'function' && t.matches('img[data-hide-on-error]')) {
      t.style.display = 'none';
    }
  }, true);

  /**
   * Hide flagged images that already failed to load before this script ran.
   */
  function sweepBrokenImages() {
    try {
      var imgs = document.querySelectorAll('img[data-hide-on-error]');
      for (var i = 0; i < imgs.length; i++) {
        var img = imgs[i];
        if (img.complete && img.naturalWidth === 0) img.style.display = 'none';
      }
    } catch (err) {
      report(err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', sweepBrokenImages);
  } else {
    sweepBrokenImages();
  }
})();
