/* ==========================================================================
   social.js — Enlaces de reseñas de Google
   El enlace está en data.js → site.googleReviews. Mientras esté vacío,
   los elementos [data-review] siguen ocultos.
   ========================================================================== */

window.LAG_Social = (function () {
  'use strict';

  var site = (window.LAG_DATA && window.LAG_DATA.site) || {};

  function init() {
    if (!site.googleReviews) return;

    document.querySelectorAll('.js-review-link').forEach(function (link) {
      link.href = site.googleReviews;
    });
    document.querySelectorAll('[data-review]').forEach(function (el) {
      el.hidden = false;
    });
  }

  return { init: init };
})();
