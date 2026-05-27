// Form store wiring using a minimal in-memory state container under PoC mode.
// Redux dependency removed because the CDN script tag is gone.
// localStorage and sessionStorage are prohibited under the PoC charter.
(function () {
  // In-memory state lives only for the current session. Page reload resets.
  let __pocMemoryState = null;

  function safeShowToast(msg, type) {
    try { if (typeof window.showToast === 'function') window.showToast(msg, type || 'info'); } catch (_) {}
  }

  function getRedux() {
    if (typeof Redux !== 'undefined' && Redux && typeof Redux.createStore === 'function') return Redux;
    return null;
  }

  function loadPersisted() {
    // PoC: no persistence. Always start fresh, unless an in-memory state was
    // hydrated during this same session.
    return __pocMemoryState;
  }

  function serialize(state) {
    try { return FormCore.serializeState(state); } catch (_) { return JSON.stringify(state); }
  }

  function persistState(state) {
    // PoC: write only to in-memory cache. No localStorage, no sessionStorage.
    __pocMemoryState = state;
    return true;
  }

  function createStore() {
    const redux = getRedux();
    if (!redux || !FormCore) return null;
    const preloaded = loadPersisted();
    const store = redux.createStore(FormCore.reducer, preloaded || FormCore.createInitialState());
    let saveTimer = null;
    store.subscribe(() => {
      const state = store.getState();
      // Update UI and autosave throttled
      if (state.dirty) {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(() => {
          if (persistState(state)) {
            store.dispatch({ type: FormCore.types.SAVE_STATE });
            safeShowToast('Progress saved', 'success');
          }
        }, 1200);
      }
      // Broadcast for UI layer
      try { window.dispatchEvent(new CustomEvent('form:state', { detail: state })); } catch (_) {}
    });
    // Expose helpers
    const api = {
      store,
      updateField(stepId, fieldId, value, deps) {
        store.dispatch({ type: FormCore.types.UPDATE_FIELD, payload: { stepId, fieldId, value } });
        store.dispatch({ type: FormCore.types.APPLY_DEPENDENCIES, payload: { dependencies: deps || {} } });
      },
      validateStep(stepId, rules) {
        store.dispatch({ type: FormCore.types.VALIDATE_STEP, payload: { stepId, rules: rules || [] } });
      },
      goToStep(stepId) {
        store.dispatch({ type: FormCore.types.GO_TO_STEP, payload: { stepId } });
      },
      restore() {
        const loaded = loadPersisted();
        if (loaded) {
          store.dispatch({ type: FormCore.types.LOAD_STATE, payload: loaded });
          safeShowToast('Restored previous progress', 'info');
        }
      }
    };
    return api;
  }

  // Initialize immediately
  window.FormStore = createStore();
})();

