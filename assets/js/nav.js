/* ==========================================================================
   nav.js — Menú móvil, header al hacer scroll y enlace activo
   ========================================================================== */

window.LAG_Nav = (function () {
  'use strict';

  function init() {
    var header = document.getElementById('header');
    var nav = document.getElementById('nav');
    var toggle = document.getElementById('navToggle');
    if (!header || !nav || !toggle) return;

    /* ---- Abrir / cerrar menú móvil ---- */
    function setOpen(open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      document.body.style.overflow = open ? 'hidden' : '';
    }

    toggle.addEventListener('click', function () {
      setOpen(!nav.classList.contains('is-open'));
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 880) setOpen(false);
    });

    /* ---- Header sólido al hacer scroll ---- */
    function onScroll() {
      header.classList.toggle('is-stuck', window.scrollY > 40);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ---- Marcar el enlace de la sección visible ---- */
    var links = Array.prototype.slice.call(nav.querySelectorAll('.nav__link'));
    var sections = links
      .map(function (link) {
        var id = link.getAttribute('href');
        return id && id.charAt(0) === '#' ? document.querySelector(id) : null;
      })
      .filter(Boolean);

    if (!('IntersectionObserver' in window) || !sections.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) {
          link.classList.toggle(
            'is-active',
            link.getAttribute('href') === '#' + entry.target.id
          );
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (section) { observer.observe(section); });
  }

  return { init: init };
})();
