/* ==========================================================================
   main.js — Punto de entrada: arranca todos los módulos en el orden correcto
   ========================================================================== */

(function () {
  'use strict';

  function start() {
    // 1. Contenido generado desde data.js (debe ir antes de las animaciones)
    if (window.LAG_Services) window.LAG_Services.render();
    if (window.LAG_Menu)     window.LAG_Menu.render();
    if (window.LAG_Gallery)  window.LAG_Gallery.render();

    // 2. Comportamiento
    if (window.LAG_Nav)      window.LAG_Nav.init();
    if (window.LAG_Form)     window.LAG_Form.init();
    if (window.LAG_WhatsApp) window.LAG_WhatsApp.init();
    if (window.LAG_Cookies)  window.LAG_Cookies.init();

    // 3. Detalles visuales (observa también el contenido recién generado)
    if (window.LAG_UI) window.LAG_UI.init();
    if (window.LAG_Effects) window.LAG_Effects.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
