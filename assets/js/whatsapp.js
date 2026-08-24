/* ==========================================================================
   whatsapp.js — Construye todos los enlaces de WhatsApp desde un único sitio
   El número está en data.js → site.whatsapp (cámbialo ahí y cambia en toda la web)
   ========================================================================== */

window.LAG_WhatsApp = (function () {
  'use strict';

  var site = (window.LAG_DATA && window.LAG_DATA.site) || {};

  /* Enlaces que hay que rellenar: id del elemento → mensaje prerrellenado */
  var LINKS = {
    waFab:       null,   // null = usa el mensaje por defecto de data.js
    waCard:      null,
    waContacto:  null,
    waFooter:    null,
    waServicios: 'Hola, quería información sobre el alquiler de la foodtruck con catering para un evento.'
  };

  function buildUrl(message) {
    var number = site.whatsapp || '';
    var text = message || site.waMessage || '';
    return 'https://wa.me/' + number + '?text=' + encodeURIComponent(text);
  }

  function init() {
    if (!site.whatsapp) return;

    Object.keys(LINKS).forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.href = buildUrl(LINKS[id]);
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
    });
  }

  return { init: init, buildUrl: buildUrl };
})();
