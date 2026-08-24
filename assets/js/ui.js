/* ==========================================================================
   ui.js — Detalles de interfaz: animaciones al hacer scroll, marquesina y año
   ========================================================================== */

window.LAG_UI = (function () {
  'use strict';

  /* ---- Aparición progresiva de los elementos [data-reveal] ---- */
  function initReveal() {
    var items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(items, function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        entry.target.style.transitionDelay = (i * 70) + 'ms';
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    Array.prototype.forEach.call(items, function (el) { observer.observe(el); });

    /* Red de seguridad: si algo impide que el observador dispare,
       mostramos todo pasados 3 segundos. */
    window.setTimeout(function () {
      Array.prototype.forEach.call(items, function (el) { el.classList.add('is-visible'); });
    }, 3000);
  }

  /* ---- Marquesina amarilla (texto duplicado para bucle continuo) ---- */
  function initMarquee() {
    var track = document.getElementById('marquee');
    var words = (window.LAG_DATA && window.LAG_DATA.marquee) || [];
    if (!track || !words.length) return;

    var once = words.map(function (w) { return '<span>' + w + ' ✦</span>'; }).join('');
    track.innerHTML = once + once;   // duplicado = animación sin saltos
  }

  /* ---- Año actual en el footer ---- */
  function initYear() {
    var el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---- Barra de progreso de lectura bajo el header ---- */
  function initProgress() {
    var bar = document.getElementById('headerProgress');
    if (!bar) return;

    function update() {
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      var ratio = max > 0 ? doc.scrollTop / max : 0;
      bar.style.transform = 'scaleX(' + ratio.toFixed(4) + ')';
    }

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }

  function init() {
    initReveal();
    initMarquee();
    initYear();
    initProgress();
  }

  return { init: init, initReveal: initReveal };
})();
