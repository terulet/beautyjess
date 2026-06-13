/* Beauty Jess — interacciones. Sin dependencias. */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header: estado scrolled ---------- */
  var header = document.querySelector('.header');
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menú móvil ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('mobile-menu');

  function setMenu(open) {
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.classList.toggle('menu-open', open);
  }
  toggle.addEventListener('click', function () {
    setMenu(!menu.classList.contains('open'));
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('open')) setMenu(false);
  });

  /* ---------- Material real: fallback elegante si falta un archivo ----------
     Cada .media-slot contiene un <img> o <video> que apunta a
     /assets/instagram/…  Si el archivo no existe todavía, el slot
     muestra el placeholder de marca en lugar de romperse. */
  document.querySelectorAll('.media-slot').forEach(function (slot) {
    var media = slot.querySelectorAll('img, video');
    var pending = media.length;
    if (!pending) return;

    function fail() { slot.classList.add('is-missing'); }

    media.forEach(function (el) {
      if (el.tagName === 'IMG') {
        if (el.complete && el.naturalWidth === 0) fail();
        el.addEventListener('error', fail);
      } else {
        el.addEventListener('error', fail, true);
        var src = el.querySelector('source');
        if (src) src.addEventListener('error', fail);
      }
    });
  });

  /* ---------- Reveal on scroll ---------- */
  var els = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) {
      el.style.transitionDelay = (el.getAttribute('data-d') || 0) + 'ms';
      io.observe(el);
    });
  }

  /* ---------- Filtros de tratamientos ---------- */
  var tabs = document.querySelectorAll('.tab');
  var cards = document.querySelectorAll('.treat-grid .treat');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.setAttribute('aria-pressed', t === tab ? 'true' : 'false'); });
      var f = tab.getAttribute('data-filter');
      cards.forEach(function (card) {
        var cats = card.getAttribute('data-cat') || '';
        var show = f === 'all' || cats.indexOf(f) !== -1;
        if (show) card.removeAttribute('hidden');
        else card.setAttribute('hidden', '');
      });
    });
  });

  /* ---------- Comparador antes/después ---------- */
  document.querySelectorAll('.ba-compare').forEach(function (box) {
    var handle = box.querySelector('.ba-handle');
    if (!handle) return;
    var dragging = false;

    function setPos(clientX) {
      var r = box.getBoundingClientRect();
      var pct = ((clientX - r.left) / r.width) * 100;
      pct = Math.max(4, Math.min(96, pct));
      box.style.setProperty('--pos', pct + '%');
      handle.style.left = pct + '%';
      handle.setAttribute('aria-valuenow', Math.round(pct));
    }

    box.addEventListener('pointerdown', function (e) {
      if (box.closest('.is-missing')) return;
      dragging = true;
      box.setPointerCapture(e.pointerId);
      setPos(e.clientX);
    });
    box.addEventListener('pointermove', function (e) {
      if (dragging) setPos(e.clientX);
    });
    ['pointerup', 'pointercancel'].forEach(function (ev) {
      box.addEventListener(ev, function () { dragging = false; });
    });
    handle.addEventListener('keydown', function (e) {
      var now = parseFloat(handle.getAttribute('aria-valuenow')) || 50;
      var next = null;
      if (e.key === 'ArrowLeft') next = now - 5;
      if (e.key === 'ArrowRight') next = now + 5;
      if (next !== null) {
        e.preventDefault();
        var r = box.getBoundingClientRect();
        setPos(r.left + (Math.max(4, Math.min(96, next)) / 100) * r.width);
      }
    });
  });

  /* ---------- Reels: tocar para reproducir con sonido ---------- */
  document.querySelectorAll('.reel').forEach(function (reel) {
    var video = reel.querySelector('video');
    var btn = reel.querySelector('.reel-play');
    if (!video || !btn) return;

    btn.addEventListener('click', function () {
      if (reel.classList.contains('is-missing')) return;
      if (video.paused) {
        /* pausa los demás reels */
        document.querySelectorAll('.reel video').forEach(function (v) {
          if (v !== video) { v.pause(); v.closest('.reel').classList.remove('playing'); }
        });
        video.muted = false;
        video.play().then(function () {
          reel.classList.add('playing');
        }).catch(function () { /* el fallback ya cubre el slot */ });
      } else {
        video.pause();
        reel.classList.remove('playing');
      }
    });
    video.addEventListener('ended', function () { reel.classList.remove('playing'); });
  });

  /* pausa los reels que salen de pantalla */
  if ('IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target.querySelector('video');
        if (v && !en.isIntersecting && !v.paused) {
          v.pause();
          en.target.classList.remove('playing');
        }
      });
    }, { threshold: 0.2 });
    document.querySelectorAll('.reel').forEach(function (r) { vio.observe(r); });
  }

  /* ---------- Parallax suave de las auroras del hero (solo desktop) ---------- */
  var hero = document.querySelector('.hero');
  if (hero && !reduced && window.matchMedia('(min-width: 960px) and (hover: hover)').matches) {
    var blobs = hero.querySelectorAll('.aurora');
    var raf = null;
    hero.addEventListener('mousemove', function (e) {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        var x = (e.clientX / window.innerWidth - 0.5);
        var y = (e.clientY / window.innerHeight - 0.5);
        blobs.forEach(function (b, i) {
          var depth = (i + 1) * 8;
          b.style.translate = (x * depth) + 'px ' + (y * depth) + 'px';
        });
        raf = null;
      });
    });
  }
})();
