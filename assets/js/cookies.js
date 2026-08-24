/* ==========================================================================
   cookies.js — Banner de consentimiento de cookies
   ---------------------------------------------------------------------------
   Cómo funciona:
   · La primera visita muestra el banner. La elección se guarda en el navegador
     durante 12 meses (localStorage, con respaldo en memoria si está bloqueado).
   · "Aceptar todas"  → ejecuta las funciones registradas en onAccept().
   · "Solo las necesarias" → no se carga nada opcional.
   · El enlace "Configurar cookies" del pie vuelve a abrir el banner.

   IMPORTANTE: si algún día añades Google Analytics, Meta Pixel o similar,
   NO lo pongas en el HTML. Regístralo aquí dentro con:
       LAG_Cookies.onAccept(function () { ...cargar el script... });
   Así sólo se cargará cuando el visitante lo haya aceptado, como exige la ley.
   ========================================================================== */

window.LAG_Cookies = (function () {
  'use strict';

  var KEY = 'lag_cookie_consent';
  var MAX_AGE_DAYS = 365;
  var memoryStore = null;          // respaldo si localStorage está bloqueado
  var callbacks = [];

  /* ---- Lectura y escritura tolerantes a fallos ---- */
  function read() {
    try {
      var raw = window.localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* modo privado o cookies bloqueadas */ }
    return memoryStore;
  }

  function write(value) {
    memoryStore = value;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(value));
    } catch (e) { /* seguimos con el respaldo en memoria */ }
  }

  function isExpired(record) {
    if (!record || !record.date) return true;
    var days = (Date.now() - record.date) / 86400000;
    return days > MAX_AGE_DAYS;
  }

  /* ---- API pública para cargar scripts sólo con consentimiento ---- */
  function onAccept(fn) {
    if (typeof fn !== 'function') return;
    callbacks.push(fn);
    var record = read();
    if (record && record.analytics && !isExpired(record)) fn();
  }

  function runCallbacks() {
    callbacks.forEach(function (fn) {
      try { fn(); } catch (e) { /* un fallo no debe romper la página */ }
    });
  }

  /* ---- Banner ---- */
  function init() {
    var banner = document.getElementById('cookieBanner');
    if (!banner) return;

    var accept = document.getElementById('cookieAccept');
    var reject = document.getElementById('cookieReject');
    var reset = document.getElementById('cookieReset');

    function open() {
      banner.hidden = false;
      // Pequeño retardo para que la transición se vea
      window.setTimeout(function () { banner.classList.add('is-open'); }, 50);
    }

    function close() {
      banner.classList.remove('is-open');
      window.setTimeout(function () { banner.hidden = true; }, 400);
    }

    function decide(analytics) {
      write({ analytics: analytics, necessary: true, date: Date.now() });
      if (analytics) runCallbacks();
      close();
    }

    if (accept) accept.addEventListener('click', function () { decide(true); });
    if (reject) reject.addEventListener('click', function () { decide(false); });
    if (reset) reset.addEventListener('click', function (e) {
      e.preventDefault();
      open();
    });

    var record = read();
    if (!record || isExpired(record)) {
      window.setTimeout(open, 900);
    } else if (record.analytics) {
      runCallbacks();
    }
  }

  return { init: init, onAccept: onAccept };
})();
