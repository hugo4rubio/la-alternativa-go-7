/* ==========================================================================
   effects.js — Efectos de interfaz "premium": halo de cursor, botones
   magnéticos y tarjetas con inclinación 3D al pasar el ratón.
   Sólo se activan con ratón real (no táctil) y si el usuario no ha pedido
   reducir el movimiento. Sin JS, o en móvil, la web se ve exactamente igual
   pero sin estos detalles: no son necesarios para usarla.
   ========================================================================== */

window.LAG_Effects = (function () {
  'use strict';

  var canHover = window.matchMedia &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Halo dorado que sigue al cursor ---- */
  function initSpotlight() {
    if (!canHover || reduceMotion) return;

    var spot = document.createElement('div');
    spot.className = 'cursor-spot';
    spot.setAttribute('aria-hidden', 'true');
    document.body.appendChild(spot);

    var raf = null, x = 0, y = 0, shown = false;

    function apply() {
      spot.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      raf = null;
    }

    window.addEventListener('pointermove', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      x = e.clientX; y = e.clientY;
      if (!shown) { spot.classList.add('is-active'); shown = true; }
      if (!raf) raf = window.requestAnimationFrame(apply);
    }, { passive: true });

    document.addEventListener('mouseleave', function () {
      spot.classList.remove('is-active');
      shown = false;
    });
  }

  /* ---- Botones magnéticos: el botón se desplaza levemente hacia el cursor ---- */
  function initMagnetic() {
    if (!canHover) return;

    var els = document.querySelectorAll('.btn:not(.btn--block)');
    Array.prototype.forEach.call(els, function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var mx = e.clientX - r.left - r.width / 2;
        var my = e.clientY - r.top - r.height / 2;
        btn.style.transform = 'translate(' + (mx * .22).toFixed(1) + 'px,' + (my * .32).toFixed(1) + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

  /* ---- Inclinación 3D suave en tarjetas, platos, galería y foto ---- */
  function initTilt() {
    if (!canHover || reduceMotion) return;

    var els = document.querySelectorAll('.card, .dish, .gallery__item, .about__frame');
    Array.prototype.forEach.call(els, function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        var ry = (px - .5) * 9;
        var rx = (.5 - py) * 9;
        el.style.setProperty('--ry', ry.toFixed(2) + 'deg');
        el.style.setProperty('--rx', rx.toFixed(2) + 'deg');
      });
      el.addEventListener('mouseleave', function () {
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
      });
    });
  }

  function init() {
    initSpotlight();
    initMagnetic();
    initTilt();
  }

  return { init: init };
})();
