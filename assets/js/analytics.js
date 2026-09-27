/* ==========================================================================
   analytics.js — Google Analytics 4, solo con consentimiento
   ---------------------------------------------------------------------------
   · El ID está en data.js → site.ga4Id.
   · GA4 NO se carga hasta que el visitante pulsa «Aceptar todas» en el banner
     (o ya lo había aceptado antes). Con «Solo las necesarias» no se carga nada.
   · Si después retira el consentimiento desde «Configurar cookies», se desactiva
     la medición y se borran las cookies _ga.
   · Conversiones medidas: clic en teléfono, clic en WhatsApp y envío del
     formulario de presupuesto (evento generate_lead).
   ========================================================================== */

window.LAG_Analytics = (function () {
  'use strict';

  var site = (window.LAG_DATA && window.LAG_DATA.site) || {};
  var ID = site.ga4Id;
  var loaded = false;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  function track(name, params) {
    if (loaded && !window['ga-disable-' + ID]) gtag('event', name, params || {});
  }

  function load() {
    if (!ID) return;
    window['ga-disable-' + ID] = false;

    if (loaded) {
      gtag('consent', 'update', { analytics_storage: 'granted' });
      return;
    }
    loaded = true;

    // Solo medición: nada de publicidad ni personalización
    gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    gtag('js', new Date());
    gtag('config', ID);

    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ID);
    document.head.appendChild(s);
  }

  /* Borra _ga y _ga_XXXX en el dominio actual y en el dominio padre */
  function deleteCookies() {
    var host = location.hostname;
    var domains = ['', host, '.' + host.replace(/^www\./, '')];
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name !== '_ga' && name.indexOf('_ga_') !== 0) return;
      domains.forEach(function (d) {
        document.cookie = name + '=; Max-Age=0; path=/' + (d ? '; domain=' + d : '');
      });
    });
  }

  function revoke() {
    if (!ID) return;
    window['ga-disable-' + ID] = true;
    if (loaded) gtag('consent', 'update', { analytics_storage: 'denied' });
    deleteCookies();
  }

  /* Clics de contacto (delegado: sirve también para enlaces generados por JS) */
  function trackContactClicks() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a) return;
      var href = a.getAttribute('href') || '';
      var where = a.id || (a.closest('section, footer, header') || {}).id || 'web';
      if (href.indexOf('tel:') === 0) track('click_phone', { link_location: where });
      else if (href.indexOf('wa.me') !== -1) track('click_whatsapp', { link_location: where });
    });

    // form.js lanza este evento cuando la solicitud se envía correctamente
    document.addEventListener('lag:lead', function (e) {
      track('generate_lead', {
        form_name: 'presupuesto',
        service: (e.detail && e.detail.service) || '',
        event_type: (e.detail && e.detail.eventType) || ''
      });
    });
  }

  function init() {
    if (!ID || !window.LAG_Cookies) return;
    window.LAG_Cookies.onAccept(load);
    if (window.LAG_Cookies.onReject) window.LAG_Cookies.onReject(revoke);
    trackContactClicks();
  }

  return { init: init, track: track };
})();
