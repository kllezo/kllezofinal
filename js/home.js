/* =============================================
   HOMEPAGE — PARALLAX HERO + REAL BRAND ICONS
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─────────────────────────────────────────────
     REAL BRAND ICONS — actual platform colours
     opacity wrapper applied via CSS animation
     ───────────────────────────────────────────── */
  const iconDefs = [

    // INSTAGRAM — gradient fill camera
    { id: 'ig', w: 48, h: 48, svg: `
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="ig-grad" cx="30%" cy="107%" r="120%">
            <stop offset="0%"  stop-color="#ffd879"/>
            <stop offset="20%" stop-color="#f9a13a"/>
            <stop offset="40%" stop-color="#e4405f"/>
            <stop offset="65%" stop-color="#c13584"/>
            <stop offset="85%" stop-color="#833ab4"/>
            <stop offset="100%" stop-color="#405de6"/>
          </radialGradient>
        </defs>
        <rect x="4" y="4" width="40" height="40" rx="13" fill="url(#ig-grad)"/>
        <circle cx="24" cy="24" r="9" stroke="white" stroke-width="2.5" fill="none"/>
        <circle cx="34" cy="14" r="2.5" fill="white"/>
      </svg>` },

    // YOUTUBE — red rounded rect + white play
    { id: 'yt', w: 56, h: 40, svg: `
      <svg width="56" height="40" viewBox="0 0 56 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="56" height="40" rx="10" fill="#FF0000"/>
        <path d="M23 14l16 6-16 6V14z" fill="white"/>
      </svg>` },

    // X / TWITTER — white X on black pill
    { id: 'x', w: 44, h: 44, svg: `
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="44" height="44" rx="12" fill="#000000"/>
        <path d="M11 11h8l6 8.5L31 11h3L26 21l9.5 12h-8L21 24l-7.5 9H10l8-10.5L11 11z" fill="white"/>
      </svg>` },

    // HEART — red filled
    { id: 'heart', w: 46, h: 42, svg: `
      <svg width="46" height="42" viewBox="0 0 46 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M23 38S4 26 4 13.5A10 10 0 0123 9.5 10 10 0 0142 13.5C42 26 23 38 23 38Z" fill="#E8304A"/>
        <path d="M23 38S4 26 4 13.5A10 10 0 0123 9.5 10 10 0 0142 13.5C42 26 23 38 23 38Z" stroke="#c9213c" stroke-width="1"/>
      </svg>` },

    // COMMENT BUBBLE — Instagram-DM style gradient
    { id: 'chat', w: 46, h: 44, svg: `
      <svg width="46" height="44" viewBox="0 0 46 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="chat-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#833ab4"/>
            <stop offset="50%" stop-color="#e4405f"/>
            <stop offset="100%" stop-color="#f9a13a"/>
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="42" height="34" rx="10" fill="url(#chat-grad)"/>
        <path d="M10 36l4-8h20" stroke="none"/>
        <polygon points="10,44 14,34 22,38" fill="url(#chat-grad)"/>
        <circle cx="15" cy="19" r="2.5" fill="white"/>
        <circle cx="23" cy="19" r="2.5" fill="white"/>
        <circle cx="31" cy="19" r="2.5" fill="white"/>
      </svg>` },

    // VIDEO CAMERA — TikTok-style dark
    { id: 'video', w: 52, h: 38, svg: `
      <svg width="52" height="38" viewBox="0 0 52 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="5" width="34" height="28" rx="5" fill="#1a1a2e"/>
        <rect x="2" y="5" width="34" height="28" rx="5" stroke="#6c63ff" stroke-width="1.5" fill="none"/>
        <path d="M36 13l13-7v26l-13-7V13z" fill="#6c63ff"/>
        <circle cx="13" cy="19" r="5" fill="#6c63ff" opacity="0.6"/>
        <path d="M11 17l6 2-6 2v-4z" fill="white"/>
      </svg>` },

    // GLOBE / WEBSITE — blue sphere
    { id: 'globe', w: 46, h: 46, svg: `
      <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="23" cy="23" r="20" fill="#1877F2"/>
        <ellipse cx="23" cy="23" rx="8" ry="20" stroke="rgba(255,255,255,0.5)" stroke-width="1.5" fill="none"/>
        <line x1="3" y1="23" x2="43" y2="23" stroke="rgba(255,255,255,0.5)" stroke-width="1.5"/>
        <line x1="7"  y1="14" x2="39" y2="14" stroke="rgba(255,255,255,0.35)" stroke-width="1.2"/>
        <line x1="7"  y1="32" x2="39" y2="32" stroke="rgba(255,255,255,0.35)" stroke-width="1.2"/>
      </svg>` },

    // SEND / PAPER PLANE — Telegram blue
    { id: 'send', w: 46, h: 46, svg: `
      <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="23" cy="23" r="20" fill="#2AABEE"/>
        <path d="M12 23l22-10-8 22-5-8z" fill="white"/>
        <path d="M19 27l2.5-3.5 5.5 2-8 1.5z" fill="#c9e9f7"/>
      </svg>` },

    // INSTAGRAM STORY — ring gradient
    { id: 'ig-story', w: 52, h: 52, svg: `
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="story-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%"  stop-color="#f9a13a"/>
            <stop offset="40%" stop-color="#e4405f"/>
            <stop offset="80%" stop-color="#c13584"/>
            <stop offset="100%" stop-color="#833ab4"/>
          </linearGradient>
        </defs>
        <circle cx="26" cy="26" r="24" stroke="url(#story-grad)" stroke-width="3" fill="none"/>
        <circle cx="26" cy="26" r="18" fill="#1a1a2e" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
        <circle cx="26" cy="26" r="7" stroke="white" stroke-width="2" fill="none"/>
      </svg>` },

    // PLAY BUTTON — generic reels / shorts
    { id: 'play', w: 44, h: 44, svg: `
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="22" cy="22" r="20" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>
        <path d="M18 14l16 8-16 8V14z" fill="white"/>
      </svg>` },

    // THUMBS UP / LIKE
    { id: 'like', w: 44, h: 44, svg: `
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="22" cy="22" r="20" fill="#1877F2"/>
        <path d="M14 22h4V32h-4V22zM20 32V19l3-6c1.5 0 3 1.5 3 3v4h6l-1.5 12H20z" fill="white"/>
      </svg>` },

    // SPARKLE / STAR — for content
    { id: 'star', w: 40, h: 40, svg: `
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 4l3.5 9.5L33 17l-9.5 3.5L20 30l-3.5-9.5L7 17l9.5-3.5z" fill="#FFD700" stroke="#FFA500" stroke-width="1"/>
        <path d="M32 6l1.5 4 4 1.5-4 1.5L32 17l-1.5-4-4-1.5 4-1.5z" fill="#FFD700" opacity="0.7"/>
        <path d="M8 26l1 2.5 2.5 1-2.5 1L8 33l-1-2.5-2.5-1 2.5-1z" fill="#FFD700" opacity="0.5"/>
      </svg>` },
  ];

  // Layout: [left%, top%, rotation, animDuration(s), animDelay(s), opacity(0-1)]
  // Carefully scattered — avoid 35-65% horizontal / 30-70% vertical (text zone)
  // layer 1 = slowest (0.2x), layer 2 = medium (0.5x), layer 3 = fastest (0.8x)
  const iconLayout = [
    { id: 'ig',       left:  4,  top: 10, rot: -8,  dur: 8.5,  delay: 0.0, opacity: 0.85, layer: 1 },
    { id: 'yt',       left: 82,  top:  8, rot:  6,  dur: 9.2,  delay: 1.3, opacity: 0.82, layer: 3 },
    { id: 'heart',    left: 90,  top: 55, rot: -12, dur: 7.8,  delay: 0.6, opacity: 0.88, layer: 2 },
    { id: 'chat',     left:  3,  top: 68, rot:  10, dur: 9.8,  delay: 2.2, opacity: 0.80, layer: 1 },
    { id: 'x',        left: 80,  top: 78, rot: -5,  dur: 8.0,  delay: 0.9, opacity: 0.75, layer: 3 },
    { id: 'video',    left: 11,  top: 38, rot:  4,  dur: 10.5, delay: 1.7, opacity: 0.78, layer: 2 },
    { id: 'globe',    left: 85,  top: 34, rot: -10, dur: 9.0,  delay: 0.3, opacity: 0.82, layer: 1 },
    { id: 'send',     left: 52,  top: 88, rot:  18, dur: 7.5,  delay: 3.1, opacity: 0.72, layer: 2 },
    { id: 'ig-story', left: 65,  top:  6, rot: -4,  dur: 11.0, delay: 1.0, opacity: 0.80, layer: 3 },
    { id: 'play',     left: 18,  top:  7, rot:  14, dur: 8.8,  delay: 0.8, opacity: 0.75, layer: 2 },
    { id: 'like',     left: 72,  top: 90, rot: -18, dur: 9.5,  delay: 2.5, opacity: 0.70, layer: 1 },
    { id: 'star',     left:  7,  top: 86, rot:  8,  dur: 10.2, delay: 1.5, opacity: 0.78, layer: 3 },
  ];

  // Speed multiplier per layer
  const LAYER_SPEED = { 1: 0.20, 2: 0.50, 3: 0.80 };

  function injectFloatingIcons() {
    const heroSticky = document.querySelector('.hero-sticky');
    if (!heroSticky) return;

    // Inject base styles once
    if (!document.getElementById('brandIconStyles')) {
      const style = document.createElement('style');
      style.id = 'brandIconStyles';
      style.textContent = `
        .brand-icon-layer {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: visible;
        }
        .brand-icon {
          position: absolute;
          transform-origin: center center;
          will-change: transform;
          /* CSS transition handles the smooth parallax response */
          transition: transform 0.12s ease-out;
          /* Fade in on load */
          animation: brandIconFadeIn 1.6s ease forwards;
          opacity: 0;
        }
        @keyframes brandIconFadeIn {
          0%   { opacity: 0; }
          100% { opacity: var(--fi-opacity); }
        }
      `;
      document.head.appendChild(style);
    }

    const layer = document.createElement('div');
    layer.className = 'brand-icon-layer';
    layer.setAttribute('aria-hidden', 'true');

    iconLayout.forEach((cfg, i) => {
      const def = iconDefs.find(d => d.id === cfg.id);
      if (!def) return;

      const el = document.createElement('div');
      el.className = 'brand-icon';
      el.dataset.layer = cfg.layer;
      el.dataset.rot   = cfg.rot;
      el.style.cssText = `
        left: ${cfg.left}%;
        top:  ${cfg.top}%;
        --fi-opacity: ${cfg.opacity};
        transform: rotate(${cfg.rot}deg);
        animation-delay: ${cfg.delay}s;
      `;
      el.innerHTML = def.svg;
      layer.appendChild(el);
    });

    const canvas = heroSticky.querySelector('.hero-canvas');
    heroSticky.insertBefore(layer, canvas || heroSticky.firstChild);
  }

  /* ─── FULL PARALLAX: MOUSE + SCROLL + ROTATION ─── */
  function initParallax() {
    const heroSticky  = document.querySelector('.hero-sticky');
    const heroWrapper = document.querySelector('.hero-wrapper');
    if (!heroSticky || prefersReducedMotion) return;

    // Speed per layer
    const MOUSE_SPEED  = { 1: 0.02, 2: 0.05, 3: 0.08 };
    const SCROLL_SPEED = { 1: 0.06, 2: 0.14, 3: 0.22 };

    // Viewport centre (updates on resize)
    let cW = window.innerWidth  / 2;
    let cH = window.innerHeight / 2;
    window.addEventListener('resize', () => {
      cW = window.innerWidth  / 2;
      cH = window.innerHeight / 2;
    });

    // Current smoothed mouse offset
    let rawMX = 0, rawMY = 0;
    let smMX  = 0, smMY  = 0;

    document.addEventListener('mousemove', e => {
      rawMX = e.clientX - cW;
      rawMY = e.clientY - cH;
    });

    function getHeroScrollY() {
      if (!heroWrapper) return 0;
      return Math.max(0, -heroWrapper.getBoundingClientRect().top);
    }

    function tick() {
      // Smooth mouse lerp (no snapping)
      smMX += (rawMX - smMX) * 0.08;
      smMY += (rawMY - smMY) * 0.08;

      const scrollY = getHeroScrollY();

      const icons = heroSticky.querySelectorAll('.brand-icon');
      icons.forEach(el => {
        const layer = parseInt(el.dataset.layer, 10) || 1;
        const baseRot = parseFloat(el.dataset.rot) || 0;

        const ms = MOUSE_SPEED[layer]  || 0.03;
        const ss = SCROLL_SPEED[layer] || 0.10;

        // A) Mouse translate
        const tx = smMX * ms;
        const ty = smMY * ms;

        // B) Scroll vertical offset (icon drifts up as hero scrolls)
        const sy = -(scrollY * ss);

        // C) Slow clockwise rotation tied to scroll (0.05 deg per px)
        const rot = baseRot + scrollY * 0.05;

        // Apply — NO scale, NO size change, just translate + rotate
        el.style.transform = `translate(${tx}px, ${ty + sy}px) rotate(${rot}deg)`;
      });

      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  /* ─── CANVAS AMBIENT PARTICLES ────────────── */
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initParticles();
  });

  class Particle {
    constructor(index, total) {
      this.index = index;
      this.total = total;
      this.reset();
      this.x = Math.random() * W;
      this.y = Math.random() * H;
    }

    reset() {
      this.chaos_x  = Math.random() * W;
      this.chaos_y  = Math.random() * H;
      this.chaos_vx = (Math.random() - 0.5) * 0.28;
      this.chaos_vy = (Math.random() - 0.5) * 0.28;

      const cols  = Math.ceil(Math.sqrt(this.total));
      const rows  = Math.ceil(this.total / cols);
      const col   = this.index % cols;
      const row   = Math.floor(this.index / cols);
      const padX  = (W - cols * 80) / 2;
      const padY  = (H - rows * 70) / 2;
      this.grid_x = padX + col * 80 + 40;
      this.grid_y = padY + row * 70 + 35;
      this.size   = Math.random() * 1.2 + 0.4;
      this.alpha  = Math.random() * 0.22 + 0.06;
      this.phase  = Math.random() * Math.PI * 2;
    }

    draw(t, progress) {
      const p1 = Math.min(progress * 2, 1);
      const p2 = Math.max((progress - 0.5) * 2, 0);

      this.x = this.chaos_x * (1 - p1) + this.grid_x * p1;
      this.y = this.chaos_y * (1 - p1) + this.grid_y * p1;

      if (p1 < 1) {
        this.chaos_x += this.chaos_vx;
        this.chaos_y += this.chaos_vy;
        if (this.chaos_x < 0 || this.chaos_x > W) this.chaos_vx *= -1;
        if (this.chaos_y < 0 || this.chaos_y > H) this.chaos_vy *= -1;
      }

      const pulse = Math.sin(t * 0.0007 + this.phase) * 0.1 + 0.9;
      ctx.save();
      ctx.globalAlpha = this.alpha * pulse * (1 - p2 * 0.5);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(104,123,117,0.7)';
      ctx.fill();
      ctx.restore();
    }
  }

  let particles = [];
  function initParticles() {
    particles = [];
    const count = Math.min(Math.floor((W * H) / 22000), 32);
    for (let i = 0; i < count; i++) particles.push(new Particle(i, count));
  }

  function drawBgGlow(progress) {
    const p2 = Math.max((progress - 0.5) * 2, 0);
    if (p2 <= 0) return;
    const grad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.5);
    grad.addColorStop(0, `rgba(9,69,62,${p2 * 0.10})`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }

  /* ─── SCROLL SCENES ──────────────────────── */
  const heroWrapper  = document.querySelector('.hero-wrapper');
  const scenes       = document.querySelectorAll('.hero-scene');
  const dots         = document.querySelectorAll('.hero-dot');
  let   currentScene = 0;

  function setScene(idx) {
    if (idx === currentScene) return;
    scenes[currentScene].classList.remove('active');
    scenes[currentScene].classList.add('exiting');
    setTimeout(() => scenes[currentScene].classList.remove('exiting'), 900);
    currentScene = idx;
    scenes[currentScene].classList.add('active');
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  function getScrollProgress() {
    if (!heroWrapper) return 0;
    const rect    = heroWrapper.getBoundingClientRect();
    const total   = heroWrapper.offsetHeight - window.innerHeight;
    const scrolled = -rect.top;
    return Math.max(0, Math.min(1, scrolled / total));
  }

  initParticles();

  function loop(timestamp) {
    ctx.clearRect(0, 0, W, H);
    const prog = getScrollProgress();
    drawBgGlow(prog);
    particles.forEach(p => p.draw(timestamp, prog));
    const zone = prog < 0.33 ? 0 : prog < 0.66 ? 1 : 2;
    if (zone !== currentScene) setScene(zone);
    requestAnimationFrame(loop);
  }

  if (!prefersReducedMotion) {
    scenes[0].classList.add('active');
    dots[0].classList.add('active');
    injectFloatingIcons();
    initParallax();
    requestAnimationFrame(loop);
  } else {
    scenes[2].classList.add('active');
    dots[2].classList.add('active');
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      if (!heroWrapper) return;
      const total  = heroWrapper.offsetHeight - window.innerHeight;
      const target = heroWrapper.offsetTop + total * (i / 2.5);
      window.scrollTo({ top: target, behavior: 'smooth' });
    });
  });
});
