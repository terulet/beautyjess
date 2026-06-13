/* ============================================================
   BeautyJess — Hero interactivo (vanilla JS, sin librerías)
   ------------------------------------------------------------
   · Una sola variable CSS --p (0→1) dirige toda la escena al hacer scroll.
   · Partículas "moléculas de luz" en <canvas> con requestAnimationFrame.
   · Reflejo de luz líquida que sigue al puntero (desktop) o al giro del
     dispositivo (móvil).
   · Slider de revelado tipo antes/después (interacción del usuario;
     NO afirma resultados reales — es un efecto de luz ilustrativo).
   · Degradación: prefers-reduced-motion y dispositivos lentos → escena
     fija sin partículas. Sin JS → el CSS ya muestra todo estático.
   ============================================================ */
(function () {
  'use strict';

  var hero = document.getElementById('inicio');
  if (!hero || !hero.classList.contains('bjhero')) return;

  var stage  = hero.querySelector('.bjhero__stage');
  var canvas = hero.querySelector('.bjhero__particles');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarse = window.matchMedia('(pointer: coarse)').matches;

  /* ---------- Nivel de rendimiento ---------- */
  var cores = navigator.hardwareConcurrency || 4;
  var mem   = navigator.deviceMemory || 4;
  var lowTier = cores <= 4 || mem <= 4;
  var COUNT = reduce ? 0 : (lowTier ? (coarse ? 24 : 34) : 70);

  /* ---------- Modo: live (con scrub+canvas) o estático ---------- */
  if (reduce) {
    hero.classList.add('is-static');
  } else {
    hero.classList.add('bjhero--live');
  }

  /* ---------- Scroll scrub → escribe --p ---------- */
  var ticking = false, lastP = -1;
  function computeP() {
    ticking = false;
    var total = Math.max(1, hero.offsetHeight - stage.offsetHeight);
    var p = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / total));
    if (Math.abs(p - lastP) > 0.001) {
      lastP = p;
      hero.style.setProperty('--p', p.toFixed(4));
    }
  }
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(computeP); }
  }
  if (!reduce) {
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    computeP();
  }

  /* ---------- Reflejo de luz líquida (puntero / tilt) ---------- */
  var mx = 0.5, my = 0.4, tmx = 0.5, tmy = 0.4;
  function applyGlow() {
    hero.style.setProperty('--mx', (mx * 100).toFixed(1) + '%');
    hero.style.setProperty('--my', (my * 100).toFixed(1) + '%');
  }
  applyGlow();

  if (!reduce && !coarse) {
    // Desktop: el ratón mueve el reflejo y desplaza las partículas
    hero.addEventListener('pointermove', function (e) {
      var r = stage.getBoundingClientRect();
      tmx = (e.clientX - r.left) / r.width;
      tmy = (e.clientY - r.top) / r.height;
    }, { passive: true });
  } else if (!reduce && coarse && window.DeviceOrientationEvent) {
    // Móvil: parallax por giro del dispositivo (si el navegador lo permite
    // sin pedir permiso explícito; si no, queda el parallax por scroll).
    window.addEventListener('deviceorientation', function (e) {
      if (e.gamma == null) return;
      tmx = 0.5 + Math.max(-1, Math.min(1, e.gamma / 45)) * 0.4;
      tmy = 0.4 + Math.max(-1, Math.min(1, (e.beta - 45) / 45)) * 0.3;
    }, { passive: true });
  }

  /* ---------- Partículas (canvas) ---------- */
  var ctx, w = 0, h = 0, dpr = 1, parts = [], sprite;
  var running = false, rafId = 0, lastT = 0;
  var fpsFrames = 0, fpsStart = 0, downgraded = false;

  function makeSprite() {
    var s = document.createElement('canvas');
    s.width = s.height = 64;
    var c = s.getContext('2d');
    var g = c.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0,    'rgba(255,247,232,0.95)');
    g.addColorStop(0.35, 'rgba(226,205,161,0.55)');
    g.addColorStop(1,    'rgba(200,168,107,0)');
    c.fillStyle = g;
    c.beginPath(); c.arc(32, 32, 32, 0, Math.PI * 2); c.fill();
    return s;
  }
  function resize() {
    var r = stage.getBoundingClientRect();
    dpr = Math.min(1.5, window.devicePixelRatio || 1);   // cap DPR (perf)
    w = r.width; h = r.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function seed(n) {
    parts = [];
    for (var i = 0; i < n; i++) {
      parts.push({
        x: Math.random() * w, y: Math.random() * h,
        r: 1.4 + Math.random() * 4.4,
        vx: (-0.5 + Math.random()) * 0.18,
        vy: (-0.5 + Math.random()) * 0.18 - 0.05,   // leve deriva ascendente
        a: 0.22 + Math.random() * 0.5,
        ph: Math.random() * 6.28,
        depth: 0.3 + Math.random() * 0.7
      });
    }
  }
  function frame(t) {
    if (!running) return;
    rafId = requestAnimationFrame(frame);
    var dt = Math.min(2, (t - lastT) / 16.67) || 1;
    lastT = t;

    mx += (tmx - mx) * 0.06; my += (tmy - my) * 0.06;  // suavizado
    applyGlow();
    var ox = (mx - 0.5), oy = (my - 0.4);

    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      p.x += p.vx * dt; p.y += p.vy * dt; p.ph += 0.02 * dt;
      if (p.y < -24) p.y = h + 24;
      if (p.x < -24) p.x = w + 24; else if (p.x > w + 24) p.x = -24;
      var px = p.x + ox * 42 * p.depth;
      var py = p.y + oy * 42 * p.depth;
      var size = p.r * 2.4;
      ctx.globalAlpha = p.a * (0.6 + 0.4 * Math.sin(p.ph));
      ctx.drawImage(sprite, px - size, py - size, size * 2, size * 2);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';

    // Vigilancia de FPS: si baja, recorta partículas y desactiva blur una vez
    if (!downgraded) {
      fpsFrames++;
      if (!fpsStart) fpsStart = t;
      if (t - fpsStart > 1100) {
        if (fpsFrames * 1000 / (t - fpsStart) < 45) {
          downgraded = true;
          hero.classList.add('is-lowfx');
          seed(Math.floor(parts.length * 0.5));
        }
      }
    }
  }
  function start() { if (running || COUNT === 0) return; running = true; lastT = performance.now(); rafId = requestAnimationFrame(frame); }
  function stop()  { running = false; if (rafId) cancelAnimationFrame(rafId); }

  if (COUNT > 0 && canvas && canvas.getContext) {
    ctx = canvas.getContext('2d');
    sprite = makeSprite();
    resize(); seed(COUNT);
    window.addEventListener('resize', resize, { passive: true });
    // Pausa el canvas cuando el hero no está en pantalla (ahorra batería/CPU)
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { e.isIntersecting ? start() : stop(); });
      }, { threshold: 0.01 }).observe(stage);
    } else {
      start();
    }
    document.addEventListener('visibilitychange', function () {
      document.hidden ? stop() : start();
    });
  }

  /* ---------- Revelado antes/después (interacción del usuario) ----------
     Efecto de luz ilustrativo: la misma imagen con dos tratamientos de
     color. No representa el resultado de ningún tratamiento real. */
  var media = hero.querySelector('.bjreveal__media');
  if (media) {
    var handle = media.querySelector('.bjreveal__handle');
    var dragging = false;
    function setRV(clientX) {
      var r = media.getBoundingClientRect();
      var v = Math.max(4, Math.min(96, (clientX - r.left) / r.width * 100));
      media.style.setProperty('--rv', v + '%');
      if (handle) handle.setAttribute('aria-valuenow', Math.round(v));
    }
    media.addEventListener('pointerdown', function (e) {
      dragging = true; media.setPointerCapture(e.pointerId); setRV(e.clientX);
    });
    media.addEventListener('pointermove', function (e) { if (dragging) setRV(e.clientX); });
    media.addEventListener('pointerup', function () { dragging = false; });
    media.addEventListener('pointercancel', function () { dragging = false; });
    if (handle) {
      handle.addEventListener('keydown', function (e) {
        var v = parseFloat(handle.getAttribute('aria-valuenow')) || 50, n = null;
        if (e.key === 'ArrowLeft')  n = v - 4;
        if (e.key === 'ArrowRight') n = v + 4;
        if (n != null) {
          e.preventDefault();
          var r = media.getBoundingClientRect();
          setRV(r.left + Math.max(4, Math.min(96, n)) / 100 * r.width);
        }
      });
    }
  }
})();
