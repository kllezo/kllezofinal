document.addEventListener('DOMContentLoaded', () => {

  /* ─── NAVBAR SCROLL STATE ─────────────────── */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ─── MOBILE MENU ─────────────────────────── */
  const hamburger = document.querySelector('.navbar__hamburger');
  const overlay   = document.querySelector('.navbar__overlay');
  if (hamburger && overlay) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      overlay.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    overlay.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ─── SCROLL PROGRESS ─────────────────────── */
  const progressBar = document.getElementById('scrollProgress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (window.scrollY / h * 100) + '%';
    }, { passive: true });
  }

  /* ─── INTERSECTION OBSERVER (REVEAL) ──────── */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    const revealEls = document.querySelectorAll('.reveal, .line-reveal');
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          o.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
    revealEls.forEach(el => obs.observe(el));

    /* ─── SERVICE CARDS: Apple-style blur focus ─── */
    const cards = Array.from(document.querySelectorAll('.service-intro__card'));
    if (cards.length) {
      // Step 1: reveal cards as they enter viewport
      const cardRevealObs = new IntersectionObserver((entries, o) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, { rootMargin: '0px 0px -5% 0px', threshold: 0.12 });
      cards.forEach(card => cardRevealObs.observe(card));

      // Step 2: track which card is most in-view and set card-active
      const cardFocusObs = new IntersectionObserver((entries) => {
        // Find the card with the highest intersection ratio
        let best = null, bestRatio = 0;
        cards.forEach(card => {
          const ratio = card._intersectRatio || 0;
          if (ratio > bestRatio) { bestRatio = ratio; best = card; }
        });
        if (best && bestRatio > 0.3) {
          cards.forEach(c => c.classList.remove('card-active'));
          best.classList.add('card-active');
        }
      }, { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0] });

      cards.forEach(card => {
        card._intersectRatio = 0;
        cardFocusObs.observe(card);
        new IntersectionObserver((entries) => {
          entries.forEach(e => { card._intersectRatio = e.intersectionRatio; });
          // Trigger re-evaluation
          let best = null, bestRatio = 0;
          cards.forEach(c => {
            if ((c._intersectRatio || 0) > bestRatio) {
              bestRatio = c._intersectRatio || 0;
              best = c;
            }
          });
          if (best && bestRatio > 0.25) {
            cards.forEach(c => c.classList.remove('card-active'));
            best.classList.add('card-active');
          }
        }, { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0] }).observe(card);
      });
    }

  } else {
    document.querySelectorAll('.reveal, .line-reveal, .service-intro__card').forEach(el => el.classList.add('visible'));
  }

  /* ─── MAGNETIC BUTTONS ────────────────────── */
  document.querySelectorAll('.btn-magnetic').forEach(wrapper => {
    const btn = wrapper.querySelector('a, button') || wrapper;
    let raf;

    wrapper.addEventListener('mousemove', e => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r  = wrapper.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width  / 2) * 0.28;
        const dy = (e.clientY - r.top  - r.height / 2) * 0.28;
        wrapper.style.transform = `translate(${dx}px, ${dy}px)`;
      });
    });

    wrapper.addEventListener('mouseleave', () => {
      cancelAnimationFrame(raf);
      wrapper.style.transition = 'transform 600ms cubic-bezier(0.16,1,0.3,1)';
      wrapper.style.transform  = 'translate(0,0)';
      setTimeout(() => { wrapper.style.transition = ''; }, 650);
    });
  });

  /* ─── CTA GLOW ON HOVER ───────────────────── */
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const x  = e.clientX - r.left;
      const y  = e.clientY - r.top;
      btn.style.setProperty('--mx', x + 'px');
      btn.style.setProperty('--my', y + 'px');
    });
  });

  /* ─── SERVICE IMAGE: CURSOR-REACTIVE LIGHT (Level 3) ─── */
  document.querySelectorAll('.service-block__img-wrap').forEach(container => {
    let raf;
    container.addEventListener('mousemove', e => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        container.style.setProperty('--x', `${x}px`);
        container.style.setProperty('--y', `${y}px`);
      });
    });
    container.addEventListener('mouseleave', () => {
      cancelAnimationFrame(raf);
      /* Reset to center so ::before fades cleanly */
      container.style.setProperty('--x', '50%');
      container.style.setProperty('--y', '50%');
    });
  });

  /* ─── COOKIE BANNER ───────────────────────── */
  const banner     = document.getElementById('cookieBanner');
  const acceptBtn  = document.getElementById('acceptCookies');
  if (banner && acceptBtn) {
    if (!localStorage.getItem('kllezo_cookies')) {
      setTimeout(() => banner.classList.add('visible'), 2500);
    }
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('kllezo_cookies', '1');
      banner.classList.remove('visible');
    });
  }

  /* ─── WHATSAPP FLOAT ──────────────────────── */
  // Show after 3 seconds
  const wa = document.querySelector('.whatsapp-float');
  if (wa) {
    wa.style.opacity = '0';
    wa.style.transform = 'translateY(20px)';
    wa.style.transition = 'opacity 500ms ease, transform 500ms ease';
    setTimeout(() => {
      wa.style.opacity  = '1';
      wa.style.transform = 'translateY(0)';
    }, 3000);
  }

  /* ─── SMOOTH SECTION ANCHORS ──────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ─── THEME TOGGLE ────────────────────────── */
  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    // Apply saved theme on load
    if (localStorage.getItem('kllezo_theme') === 'light') {
      document.body.classList.add('light');
      themeBtn.textContent = '🌙';
    }
    themeBtn.addEventListener('click', () => {
      const isLight = document.body.classList.toggle('light');
      themeBtn.textContent = isLight ? '🌙' : '☀️';
      localStorage.setItem('kllezo_theme', isLight ? 'light' : 'dark');
    });
  }
});
