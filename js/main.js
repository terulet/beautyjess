(function(){
  document.documentElement.classList.add('js');

  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  toggle.addEventListener('click', function(){
    var open = header.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });

  nav.addEventListener('click', function(e){
    var t = e.target;
    while (t && t !== nav && t.tagName !== 'A') { t = t.parentNode; }
    if (t && t.tagName === 'A') {
      header.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  window.addEventListener('scroll', function(){
    header.classList.toggle('scrolled', window.scrollY > 8);
  }, { passive: true });

  /* Filtros de tratamientos */
  var tabs = document.querySelectorAll('.tab');
  var cards = document.querySelectorAll('.cards .card');
  tabs.forEach(function(tab){
    tab.addEventListener('click', function(){
      tabs.forEach(function(t){ t.setAttribute('aria-pressed', t === tab ? 'true' : 'false'); });
      var f = tab.getAttribute('data-filter');
      cards.forEach(function(card){
        var cats = card.getAttribute('data-cat') || '';
        var show = (f === 'all') || (cats.indexOf(f) !== -1);
        if (show) { card.removeAttribute('hidden'); }
        else { card.setAttribute('hidden', ''); }
      });
    });
  });

  /* Reveals al hacer scroll */
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    els.forEach(function(el){ el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function(el){
      el.style.transitionDelay = (el.getAttribute('data-d') || 0) + 'ms';
      io.observe(el);
    });
  }
})();
