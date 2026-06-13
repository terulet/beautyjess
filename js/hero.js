/* ============================================================
   BeautyJess — Hero editorial: parallax sutil (vanilla, sin canvas)
   ------------------------------------------------------------
   · Escribe variables CSS --px/--py (puntero) y --sy (scroll) que el
     CSS usa para mover halos, paneles glass y la imagen con suavidad.
   · Sólo transform vía custom properties → 60fps, sin layout shift.
   · prefers-reduced-motion o dispositivos sin puntero fino → desactivado.
   ============================================================ */
(function () {
  'use strict';

  var hero = document.getElementById('inicio');
  if (!hero || !hero.classList.contains('bjhero')) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine   = window.matchMedia('(pointer: fine)').matches;

  var px = 0, py = 0, tpx = 0, tpy = 0, sy = 0;
  var rafPointer = false, rafScroll = false;

  /* ---------- Parallax de puntero (solo desktop con puntero fino) ---------- */
  function applyPointer() {
    rafPointer = false;
    px += (tpx - px) * 0.08;
    py += (tpy - py) * 0.08;
    hero.style.setProperty('--px', px.toFixed(3));
    hero.style.setProperty('--py', py.toFixed(3));
    if (Math.abs(tpx - px) > 0.001 || Math.abs(tpy - py) > 0.001) {
      rafPointer = true; requestAnimationFrame(applyPointer);
    }
  }
  if (!reduce && fine) {
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      tpx = ((e.clientX - r.left) / r.width - 0.5) * 2;   // -1..1
      tpy = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!rafPointer) { rafPointer = true; requestAnimationFrame(applyPointer); }
    }, { passive: true });
    hero.addEventListener('pointerleave', function () {
      tpx = 0; tpy = 0;
      if (!rafPointer) { rafPointer = true; requestAnimationFrame(applyPointer); }
    });
  }

  /* ---------- Parallax de scroll (suave, mientras el hero es visible) ---------- */
  function applyScroll() {
    rafScroll = false;
    var rect = hero.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    // 0 arriba del todo → ~1 cuando el hero sale por arriba
    var prog = Math.min(1, Math.max(0, -rect.top / (hero.offsetHeight || 1)));
    sy = prog;
    hero.style.setProperty('--sy', sy.toFixed(3));
  }
  if (!reduce) {
    window.addEventListener('scroll', function () {
      if (!rafScroll) { rafScroll = true; requestAnimationFrame(applyScroll); }
    }, { passive: true });
    applyScroll();
  }
})();
