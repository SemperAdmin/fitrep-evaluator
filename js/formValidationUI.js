// Form validation UI module: wires blur/input/submit, updates ARIA and inline messages
// Depends on window.FormValidationCore

(function(){
  function debounce(fn, wait){
    let t = null;
    return function(...args){
      if (t) clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }
  function ensureMessageEl(field){
    const group = field.closest('.form-group') || field.parentElement;
    if (!group) return null;
    let el = group.querySelector('.input-error');
    if (!el) {
      el = document.createElement('div');
      el.className = 'input-error';
      el.setAttribute('role', 'alert');
      el.setAttribute('aria-live', 'polite');
      group.appendChild(el);
    }
    return el;
  }
  function ensureSuccessIcon(field){
    const group = field.closest('.form-group') || field.parentElement;
    if (!group) return null;
    let icon = group.querySelector('.valid-indicator');
    if (!icon) {
      icon = document.createElement('span');
      icon.className = 'valid-indicator';
      icon.innerHTML = '<svg class="icon icon--sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><polyline points="20 6 9 17 4 12"/></svg>';
      group.appendChild(icon);
    }
    return icon;
  }

  function updateFieldUI(field, state){
    const msgEl = ensureMessageEl(field);
    const iconEl = ensureSuccessIcon(field);
    const isValid = !!state.valid;
    const message = String(state.message || '');

    field.classList.toggle('is-invalid', !isValid);
    field.classList.toggle('is-valid', isValid);
    field.classList.toggle('is-neutral', field.dataset.touched !== 'true');
    field.setAttribute('aria-invalid', String(!isValid));

    if (msgEl) {
      const id = field.id ? field.id + 'Error' : ''+Date.now();
      msgEl.id = id;
      field.setAttribute('aria-describedby', id);
      msgEl.textContent = message;
      msgEl.classList.toggle('show', !isValid);
    }
    if (iconEl) {
      iconEl.classList.toggle('show', isValid);
    }
  }

  function getFieldLabel(field){
    const label = (field.getAttribute('aria-label')
      || (field.id && document.querySelector(`label[for="${field.id}"]`)?.textContent)
      || field.name || 'Field');
    return String(label).trim();
  }

  function validateField(field){
    const core = window.FormValidationCore;
    if (!core) return { valid: true, message: '' };
    const rules = core.parseRules(field.dataset.rules || '');
    const res = core.validateField({ value: field.value, label: getFieldLabel(field), dataRules: rules });
    updateFieldUI(field, res);
    return res;
  }

  function attachFieldListeners(field, opts){
    const wait = Number(opts?.debounceMs || 300);

    // Client-only validation. Server validation removed: the PoC has no backend.
    const validate = () => {
      const res = validateField(field);
      if (opts?.onFieldValidated) opts.onFieldValidated(field, res);
    };

    const onInputDebounced = debounce(validate, wait);

    field.addEventListener('blur', () => {
      field.dataset.touched = 'true';
      validate();
    });
    field.addEventListener('input', () => {
      if (field.dataset.touched !== 'true') return; // only after user interacts
      onInputDebounced();
    });
  }

  function validateForm(container){
    const fields = container.querySelectorAll('input.form-input, textarea.form-input, select.form-input');
    let allValid = true;
    fields.forEach(f => {
      const res = validateField(f);
      if (!res.valid) allValid = false;
    });
    return allValid;
  }

  function attachToContainer(container, options = {}){
    const fields = container.querySelectorAll('input.form-input, textarea.form-input, select.form-input');
    fields.forEach(f => attachFieldListeners(f, options));

    const btn = options.submitButtonSelector ? container.querySelector(options.submitButtonSelector) : null;
    const updateSubmitState = () => {
      const ok = validateForm(container);
      if (btn) {
        btn.disabled = !ok;
        btn.setAttribute('aria-disabled', String(!ok));
      }
    };
    // Initial state
    updateSubmitState();
    // Recompute on blur events to keep submit accurate
    fields.forEach(f => f.addEventListener('blur', updateSubmitState));

    if (btn) {
      btn.addEventListener('click', (e) => {
        const ok = validateForm(container);
        if (!ok) {
          e.preventDefault();
          e.stopPropagation();
        }
      });
    }
  }

  function showSuccessBanner(container, message){
    try {
      const msg = String(message || container?.dataset?.successMessage || 'Saved successfully.');
      const banner = document.createElement('div');
      banner.className = 'form-success-banner';
      banner.setAttribute('role','status');
      banner.setAttribute('aria-live','polite');
      banner.textContent = msg;
      document.body.appendChild(banner);
      // animate in
      requestAnimationFrame(() => banner.classList.add('show'));
      // auto-hide after 2.4s
      setTimeout(() => {
        banner.classList.remove('show');
        setTimeout(() => banner.remove(), 220);
      }, 2400);
    } catch (_) { /* noop */ }
  }

  // Export
  try { window.FormValidationUI = { attachToContainer, validateField, validateForm, showSuccessBanner }; } catch (_) { if (typeof logError === "function") logError(_); }
})();
