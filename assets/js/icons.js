/* ==========================================================================
   icons.js — Set de iconos de línea, uno solo para toda la web
   ---------------------------------------------------------------------------
   Todos comparten la misma rejilla (24×24), el mismo grosor de trazo y los
   mismos remates redondeados, que es lo que hace que un set parezca
   profesional: la coherencia, no el detalle.

   Heredan el color del texto (`currentColor`), así el mismo icono sirve
   sobre fondo blanco, negro o amarillo sin tocar nada.
   ========================================================================== */

window.LAG_ICONS = (function () {
  'use strict';

  function svg(paths) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
           'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" ' +
           'aria-hidden="true" focusable="false">' + paths + '</svg>';
  }

  return {
    /* --- Servicios --- */
    truck: svg(
      '<path d="M14 17V6.5a1 1 0 0 0-1-1H3.5a1 1 0 0 0-1 1V17a1 1 0 0 0 1 1H5"/>' +
      '<path d="M14 9h3.6a1 1 0 0 1 .77.36L21.3 13a1 1 0 0 1 .23.64V17a1 1 0 0 1-1 1h-1.2"/>' +
      '<path d="M10 18h4"/>' +
      '<circle cx="7.4" cy="18" r="2.2"/>' +
      '<circle cx="17.1" cy="18" r="2.2"/>'
    ),

    cloche: svg(
      '<path d="M3 18h18"/>' +
      '<path d="M4.5 18a7.5 7.5 0 0 1 15 0"/>' +
      '<path d="M12 10.5V8.6"/>' +
      '<circle cx="12" cy="7" r="1.3"/>'
    ),

    confetti: svg(
      '<path d="M3.5 20.5 8 9.4l6.6 6.6-11.1 4.5Z"/>' +
      '<path d="m8 9.4 6.6 6.6"/>' +
      '<path d="M15.2 6.4c.6-1.2 1.7-1.6 3-1.2"/>' +
      '<path d="M18.6 2.9v1.9"/>' +
      '<path d="M21.5 7.2h-1.9"/>' +
      '<path d="M20 12.4a2.6 2.6 0 0 1-2.6-2.6"/>'
    ),

    /* --- Quiénes somos --- */
    flame: svg(
      '<path d="M12 21c3.1 0 5.6-2.3 5.6-5.2 0-3.4-2.8-5.1-3.8-8-.7 1.5-1.9 2.2-2.8 3.3-1 1.1-1.5 2.2-1.5 3.4 0-1.3-.6-2.5-1.3-3.3-1.3 1.6-1.8 2.9-1.8 4.6C6.4 18.7 8.9 21 12 21Z"/>'
    ),

    sparkles: svg(
      '<path d="m11 3 1.7 4.1L16.8 8.8l-4.1 1.7L11 14.6l-1.7-4.1L5.2 8.8l4.1-1.7L11 3Z"/>' +
      '<path d="m18 14.4.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1Z"/>'
    ),

    pin: svg(
      '<path d="M12 21.2s6.8-5.6 6.8-10.6a6.8 6.8 0 1 0-13.6 0c0 5 6.8 10.6 6.8 10.6Z"/>' +
      '<circle cx="12" cy="10.4" r="2.5"/>'
    ),

    /* --- Eventos --- */
    cake: svg(
      '<path d="M3 20.5h18"/>' +
      '<path d="M4.6 20.5v-5.9a2 2 0 0 1 2-2h10.8a2 2 0 0 1 2 2v5.9"/>' +
      '<path d="M4.6 16.6c1.5 1.1 3 1.1 4.5 0s3-1.1 4.5 0 3 1.1 4.5 0"/>' +
      '<path d="M12 12.6V9.9"/>' +
      '<path d="M12 8.1c.9-.9.9-1.7 0-2.6-.9.9-.9 1.7 0 2.6Z"/>'
    ),

    music: svg(
      '<path d="M9 17.5V5.2l10-2v12.1"/>' +
      '<circle cx="6.4" cy="18" r="2.6"/>' +
      '<circle cx="16.4" cy="15.9" r="2.6"/>'
    ),

    heart: svg(
      '<path d="M12 20.4s-7.3-4.6-7.3-9.8a3.9 3.9 0 0 1 7.3-2 3.9 3.9 0 0 1 7.3 2c0 5.2-7.3 9.8-7.3 9.8Z"/>'
    ),

    briefcase: svg(
      '<rect x="2.6" y="7" width="18.8" height="13" rx="2"/>' +
      '<path d="M8.4 7V5.4a2 2 0 0 1 2-2h3.2a2 2 0 0 1 2 2V7"/>' +
      '<path d="M2.6 12.4h18.8"/>'
    ),

    tent: svg(
      '<path d="M3 20.4 12 3.6l9 16.8"/>' +
      '<path d="M12 3.6v16.8"/>' +
      '<path d="M8 20.4 12 12.6l4 7.8"/>'
    ),

    flag: svg(
      '<path d="M5 21V3.6"/>' +
      '<path d="M5 3.6h13.2l-3 4.6 3 4.6H5"/>'
    ),

    /* --- Interfaz --- */
    phone: svg(
      '<path d="M20.5 16.9v2.6a1.7 1.7 0 0 1-1.9 1.7 17.4 17.4 0 0 1-7.6-2.7 17.1 17.1 0 0 1-5.3-5.3A17.4 17.4 0 0 1 3 5.5 1.7 1.7 0 0 1 4.7 3.6h2.6a1.7 1.7 0 0 1 1.7 1.5c.1.9.3 1.7.6 2.5a1.7 1.7 0 0 1-.4 1.8l-1.1 1.1a14 14 0 0 0 5.3 5.3l1.1-1.1a1.7 1.7 0 0 1 1.8-.4c.8.3 1.6.5 2.5.6a1.7 1.7 0 0 1 1.5 1.7Z"/>'
    ),

    globe: svg(
      '<circle cx="12" cy="12" r="9"/>' +
      '<path d="M3.2 12h17.6"/>' +
      '<path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z"/>'
    ),

    arrowDown: svg(
      '<path d="M12 4.8v14.4"/><path d="m6.4 13.6 5.6 5.6 5.6-5.6"/>'
    )
  };
})();
