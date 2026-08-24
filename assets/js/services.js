/* ==========================================================================
   services.js — BLOQUE 3: genera las tarjetas de servicios
   (alquiler de foodtruck, catering y servicio completo) desde data.js
   ========================================================================== */

window.LAG_Services = (function () {
  'use strict';

  var data = window.LAG_DATA || {};

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* El icono es SVG escrito por nosotros en data.js, por eso no se escapa.
     Todo lo que escribe el cliente sí pasa por esc(). */
  function card(service) {
    var points = (service.points || [])
      .map(function (p) { return '<li>' + esc(p) + '</li>'; })
      .join('');

    return '' +
      '<article class="card" data-reveal>' +
        '<span class="card__icon" aria-hidden="true">' + service.icon + '</span>' +
        '<h3 class="card__title">' + esc(service.title) + '</h3>' +
        '<p class="card__text">' + esc(service.text) + '</p>' +
        (points ? '<ul class="card__list">' + points + '</ul>' : '') +
      '</article>';
  }

  function render() {
    var host = document.getElementById('servicesGrid');
    if (!host || !data.services) return;
    host.innerHTML = data.services.map(card).join('');
  }

  return { render: render };
})();
