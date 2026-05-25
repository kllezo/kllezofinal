/* ═══════════════════════════════════════════════════════════════════════════
   KLLEZO — apply.js
   Handles the application form: validation + Supabase submission
   ═══════════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('applyForm');
  if (!form) return;

  /* ─── INIT SUPABASE CLIENT ──────────────────────────────────────────────── */
  // supabase global is provided by the CDN script loaded in apply.html
  // Config values come from js/supabase-config.js (anon key only — safe for browser)
  if (!window.supabase) {
    console.error('[Kllezo] Supabase CDN script failed to load. window.supabase is undefined.');
    showInitError();
    return;
  }

  const { createClient } = window.supabase
  const db = createClient(
    window.KLLEZO_SUPABASE_URL,
    window.KLLEZO_SUPABASE_ANON_KEY
  )

  function showInitError() {
    let notice = document.getElementById('submitError')
    if (!notice) {
      notice = document.createElement('p')
      notice.id = 'submitError'
      notice.style.cssText = 'color:#e05a5a;font-size:13px;margin-bottom:16px;text-align:center;'
      form.insertBefore(notice, form.firstChild)
    }
    notice.textContent = 'Connection error: Supabase could not be loaded. Please reload the page or contact us.'
  }

  /* ─── SERVICE CARDS (multi-select) ─────────────────────────────────────── */
  const serviceCards    = document.querySelectorAll('.service-card');
  const purposeHidden   = document.getElementById('purposeHidden');
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
      clearError('purposeError', 'purposeGroup');
    }

    card.addEventListener('click', () => toggleCard(card));
    card.addEventListener('keydown', e => {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggleCard(card); }
    });
  });

  /* ─── STAGE PILLS (single-select) ──────────────────────────────────────── */
  const stagePills  = document.querySelectorAll('.stage-pill');
  const stageHidden = document.getElementById('stageHidden');

  stagePills.forEach(pill => {
    function selectPill(p) {
      stagePills.forEach(sp => {
        sp.classList.remove('selected');
        sp.setAttribute('aria-checked', 'false');
      });
      p.classList.add('selected');
      p.setAttribute('aria-checked', 'true');
      if (stageHidden) stageHidden.value = p.dataset.value;
      clearError('stageError', 'stageGroup');
    }

    pill.addEventListener('click', () => selectPill(pill));
    pill.addEventListener('keydown', e => {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); selectPill(pill); }
    });
  });

  /* ─── HELPERS ───────────────────────────────────────────────────────────── */
  function clearError(errId, grpId) {
    const err = document.getElementById(errId);
    if (err) { err.textContent = ''; err.classList.remove('show'); }
    const grp = document.getElementById(grpId);
    if (grp) grp.classList.remove('error');
  }

  function showError(errId, grpId, msg) {
    const err = document.getElementById(errId);
    if (err) { err.textContent = msg; err.classList.add('show'); }
    const grp = document.getElementById(grpId);
    if (grp) grp.classList.add('error');
  }

  /* ─── STANDARD FIELD VALIDATION ────────────────────────────────────────── */
  const requiredFields = form.querySelectorAll('input[required], textarea[required], select[required]');

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

  /* ─── FORM SUBMIT ───────────────────────────────────────────────────────── */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;

    // Validate standard fields
    requiredFields.forEach(f => { if (!validateField(f)) valid = false; });

    // Validate purpose (at least 1 card selected)
    if (selectedServices.size === 0) {
      valid = false;
      showError('purposeError', 'purposeGroup', 'Please select at least one option.');
    }

    // Validate stage (1 pill selected)
    if (!stageHidden || !stageHidden.value) {
      valid = false;
      showError('stageError', 'stageGroup', 'Please select your business stage.');
    }

    if (!valid) return;

    const btn  = form.querySelector('[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled    = true;

    /* ─── COLLECT FORM DATA ─────────────────────────────────────────────── */
    const payload = {
      full_name:     form.querySelector('#fullName')?.value.trim()     || '',
      business_name: form.querySelector('#businessName')?.value.trim() || '',
      email:         form.querySelector('#email')?.value.trim()        || '',
      phone:         form.querySelector('#phone')?.value.trim()        || '',
      purpose:       purposeHidden?.value                              || '',
      stage:         stageHidden?.value                                || '',
      bottleneck:    form.querySelector('#bottleneck')?.value          || '',
      details:       form.querySelector('#details')?.value.trim()      || '',
      source:        'website',
    }

    /* ─── SUBMIT TO SUPABASE ────────────────────────────────────────────── */
    try {
      console.log("SUPABASE INSERT PAYLOAD:", payload)
      const { error } = await db
        .from('applications')
        .insert([payload])

      if (error) {
        console.error('[Kllezo] Supabase insert error:', error)
        throw new Error(error.message || 'Submission failed')
      }

      showSuccess()
    } catch (err) {
      console.error('[Kllezo] Form submission error:', err)
      btn.textContent = 'Try again ↑';
      btn.disabled    = false;

      // Show a friendly inline error at the top of the form
      let notice = document.getElementById('submitError')
      if (!notice) {
        notice = document.createElement('p')
        notice.id = 'submitError'
        notice.style.cssText = 'color:#e05a5a;font-size:13px;margin-bottom:16px;text-align:center;'
        form.insertBefore(notice, form.firstChild)
      }
      const errMsg = err.message || (typeof err === 'object' ? JSON.stringify(err) : err);
      notice.textContent = `Submission failed: ${errMsg}. Please try again or email us directly.`
    }

    function showSuccess() {
      form.innerHTML = `
        <div style="text-align:center; padding: 80px 40px;">
          <div style="font-size:48px; margin-bottom:24px;">✓</div>
          <p style="font-family:var(--font-display); font-size:28px; color:var(--beige); margin-bottom:16px;">Application received.</p>
          <p style="font-size:14px; color:var(--muted); line-height:1.7;">
            We review every application manually.<br>
            If it's a fit, we'll reach out within 48 hours.
          </p>
        </div>
      `
    }
  })
})
