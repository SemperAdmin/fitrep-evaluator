// Minimal UI bindings: progress indicator, step nav, re-evaluation feedback
(function () {
  if (!window.FormStore || !window.FormCore) return;

  function qs(id) { return document.getElementById(id); }
  const progressFill = qs('progressFill');
  const progressText = qs('progressText');
  const autoSaveIndicator = qs('autoSaveIndicator');

  function renderState(state) {
    const percent = FormCore.selectors.getProgressPercent(state);
    if (progressFill) {
      progressFill.style.width = percent + '%';
    }
    if (progressText) {
      const cur = FormCore.selectors.getCurrentStep(state);
      const label = (cur && cur.title) ? cur.title : 'Step';
      progressText.textContent = label + ' - ' + percent + '%';
    }
    if (autoSaveIndicator) {
      // If persistence manages indicator, only update last saved text subtly
      if (autoSaveIndicator.classList && autoSaveIndicator.classList.contains('managed')) {
        const textEl = autoSaveIndicator.querySelector('.text');
        if (textEl && state.lastSavedAt) {
          try {
            const when = new Date(state.lastSavedAt);
            textEl.textContent = 'Saved ' + when.toLocaleTimeString();
            autoSaveIndicator.classList.remove('unsaved', 'saving', 'error');
            autoSaveIndicator.classList.add('saved');
          } catch (_) {}
        }
      } else {
        autoSaveIndicator.style.visibility = state.lastSavedAt ? 'visible' : 'hidden';
        // PoC: auto-save is disabled. Set a static label without emoji glyphs.
        autoSaveIndicator.innerHTML = state.lastSavedAt
          ? '<svg class="icon icon--xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><polyline points="20 6 9 17 4 12"/></svg><span>Auto-saved</span>'
          : '<span>Saving...</span>';
      }
    }
  }

  window.addEventListener('form:state', (e) => {
    renderState(e.detail);
  });

  // Expose navigation helpers for critical confirmations and validation gating
  window.FormNav = {
    canNavigate(targetStepId) {
      const state = FormStore.store.getState();
      const cur = FormCore.selectors.getCurrentStep(state);
      const hasErrors = Object.values(cur.fields || {}).some(f => !!f.error);
      if (hasErrors) {
        if (typeof showToast === 'function') showToast('Please fix errors before navigating.', 'warning');
        return false;
      }
      return true;
    },
    confirmLeave() {
      const state = FormStore.store.getState();
      if (FormCore.selectors.isDirty(state)) {
        return window.confirm('You have unsaved changes. Navigate anyway?');
      }
      return true;
    }
  };

  // Initial render
  renderState(FormStore.store.getState());
})();
