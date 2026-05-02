document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('applyForm');
  if (!form) return;

  /* ─── SERVICE CARDS (multi-select) ─── */
  const serviceCards = document.querySelectorAll('.service-card');
  const purposeHidden = document.getElementById('purposeHidden');
  const selectedServices = new Set();

  serviceCards.forEach(card => {
    function toggleCard(c) {
      const val = c.dataset.value;
      if (c.classList.contains('selected')) {
        c.classList.remove('selected');
        c.setAttribute('aria-checked', 'false');
        selectedServices.delete(val);
      } else {
        c.classList.add('selected');
        c.setAttribute('aria-checked', 'true');
        selectedServices.add(val);
      }
      if (purposeHidden) purposeHidden.value = Array.from(selectedServices).join(',');
      // Clear error
      const err = document.getElementById('purposeError');
      if (err) { err.textContent = ''; err.classList.remove('show'); }
      const grp = document.getElementById('purposeGroup');
      if (grp) grp.classList.remove('error');
    }

    card.addEventListener('click', () => toggleCard(card));
    card.addEventListener('keydown', e => {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggleCard(card); }
    });
  });

  /* ─── STAGE PILLS (single-select) ─── */
  const stagePills = document.querySelectorAll('.stage-pill');
  const stageHidden = document.getElementById('stageHidden');

  stagePills.forEach(pill => {
    function selectPill(p) {
      stagePills.forEach(sp => { sp.classList.remove('selected'); sp.setAttribute('aria-checked', 'false'); });
      p.classList.add('selected');
      p.setAttribute('aria-checked', 'true');
      if (stageHidden) stageHidden.value = p.dataset.value;
      // Clear error
      const err = document.getElementById('stageError');
      if (err) { err.textContent = ''; err.classList.remove('show'); }
      const grp = document.getElementById('stageGroup');
      if (grp) grp.classList.remove('error');
    }

    pill.addEventListener('click', () => selectPill(pill));
    pill.addEventListener('keydown', e => {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); selectPill(pill); }
    });
  });

  /* ─── STANDARD FIELD VALIDATION ─── */
  const requiredFields = form.querySelectorAll('input[required], textarea[required]');

  function validateField(field) {
    const group = field.closest('.form-group');
    const error = group ? group.querySelector('.form-error') : null;
    let valid = true;

    if (!field.value.trim()) {
      valid = false;
      if (error) { error.textContent = 'This field is required.'; error.classList.add('show'); }
      if (group) group.classList.add('error');
    } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
      valid = false;
      if (error) { error.textContent = 'Please enter a valid email.'; error.classList.add('show'); }
      if (group) group.classList.add('error');
    } else if (field.type === 'tel' && field.value.trim().length < 7) {
      valid = false;
      if (error) { error.textContent = 'Please enter a valid phone number.'; error.classList.add('show'); }
      if (group) group.classList.add('error');
    } else {
      if (error) { error.textContent = ''; error.classList.remove('show'); }
      if (group) group.classList.remove('error');
    }
    return valid;
  }

  requiredFields.forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      const group = field.closest('.form-group');
      if (group && group.classList.contains('error')) validateField(field);
    });
  });

  /* ─── FORM SUBMIT ─── */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;

    // Validate standard fields
    requiredFields.forEach(f => { if (!validateField(f)) valid = false; });

    // Validate purpose (at least 1 card selected)
    if (selectedServices.size === 0) {
      valid = false;
      const err = document.getElementById('purposeError');
      if (err) { err.textContent = 'Please select at least one option.'; err.classList.add('show'); }
      const grp = document.getElementById('purposeGroup');
      if (grp) grp.classList.add('error');
    }

    // Validate stage (1 pill selected)
    if (!stageHidden || !stageHidden.value) {
      valid = false;
      const err = document.getElementById('stageError');
      if (err) { err.textContent = 'Please select your business stage.'; err.classList.add('show'); }
      const grp = document.getElementById('stageGroup');
      if (grp) grp.classList.add('error');
    }

    if (!valid) return;

    const btn = form.querySelector('[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Sending\u2026';
    btn.disabled = true;

    const action = form.getAttribute('action') || '#';

    try {
      if (action === '#') {
        await new Promise(r => setTimeout(r, 1200));
        showSuccess();
      } else {
        const res = await fetch(action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (res.ok) showSuccess();
        else throw new Error('Server error');
      }
    } catch {
      btn.textContent = 'Try again';
      btn.disabled = false;
    }

    function showSuccess() {
      form.innerHTML = `
        <div style="text-align:center; padding: 80px 40px;">
          <div style="font-size:32px; margin-bottom:24px;">✓</div>
          <p style="font-family:var(--font-display); font-size:28px; color:var(--beige); margin-bottom:16px;">Application received.</p>
          <p style="font-size:14px; color:var(--muted); line-height:1.7;">
            We review every application manually.<br>
            If it's a fit, we'll reach out within 48 hours.
          </p>
        </div>
      `;
    }
  });
});
