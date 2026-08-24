/* ==========================================================================
   form.js — Validación y envío del formulario de presupuesto
   ---------------------------------------------------------------------------
   DESTINO: hugo4rubio@gmail.com

   El visitante rellena, pulsa «Solicitar presupuesto» y el mensaje sale solo.
   No se abre Gmail ni ningún programa de correo.

   DÓNDE SE ENVÍA — elige según dónde alojes la web (CONFIG.endpoint):

   · Vercel, Netlify o similar  →  '/api/enviar'
       Usa api/enviar.js. El correo llega MAQUETADO con los colores de la
       marca. Necesita crear una cuenta gratuita en resend.com y pegar la
       clave en Vercel como variable RESEND_API_KEY. Instrucciones dentro
       de api/enviar.js.

   · Hosting clásico con PHP    →  'enviar.php'
       Sube tools/enviar.php a la raíz. Mismo correo maquetado, sin terceros.

   · Nada de lo anterior         →  la URL de formsubmit.co
       No hay que configurar nada, pero el correo llega con la plantilla
       genérica del servicio, no con la nuestra, y exige pulsar un botón de
       activación la primera vez.
   ========================================================================== */

window.LAG_Form = (function () {
  'use strict';

  var site = (window.LAG_DATA && window.LAG_DATA.site) || {};

  var CONFIG = {
    /* 'endpoint' → envío directo (el que está activo)
       'whatsapp' → abre WhatsApp con el mensaje escrito                     */
    mode: 'endpoint',

    /* ⬇⬇ ESTA ES LA LÍNEA QUE HAY QUE CAMBIAR SEGÚN DÓNDE ALOJES LA WEB ⬇⬇
       '/api/enviar'  → Vercel / Netlify  (correo maquetado)
       'enviar.php'   → hosting con PHP   (correo maquetado)
       la URL de formsubmit.co            (correo genérico, sin configurar) */
    endpoint: '/api/enviar',

    email: 'hugo4rubio@gmail.com',

    /* Si el envío falla (sin conexión, servicio caído), se ofrece WhatsApp
       para no perder al cliente. */
    fallbackWhatsApp: true
  };

  var MESSAGES = {
    required: 'Este campo es obligatorio.',
    email: 'Introduce un email válido.',
    tel: 'Introduce un teléfono válido.',
    consent: 'Necesitamos tu consentimiento para poder responderte.',
    review: 'Revisa los campos marcados.',
    sending: 'Enviando tu solicitud…',
    ok: '¡Solicitud enviada! Te contactamos lo antes posible.',
    error: 'No hemos podido enviar la solicitud. Inténtalo de nuevo o escríbenos por aquí:',
    pendiente: 'El formulario todavía no está activado. Revisa tu correo (y el spam) y pulsa el botón de activación de FormSubmit.',
    copiado: 'Datos copiados al portapapeles.'
  };

  var RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var RE_TEL = /^[+()\d\s.-]{6,}$/;

  /* ================= Validación ================= */
  function setError(field, message) {
    var slot = document.querySelector('[data-error-for="' + field.id + '"]');
    if (slot) slot.textContent = message || '';
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  function validateField(field) {
    if (field.type === 'hidden' || field.name === '_honey') return true;

    if (field.type === 'checkbox') {
      if (field.required && !field.checked) { setError(field, MESSAGES.consent); return false; }
      setError(field, '');
      return true;
    }

    var value = (field.value || '').trim();

    if (field.required && !value) { setError(field, MESSAGES.required); return false; }
    if (field.type === 'email' && value && !RE_EMAIL.test(value)) { setError(field, MESSAGES.email); return false; }
    if (field.type === 'tel' && value && !RE_TEL.test(value)) { setError(field, MESSAGES.tel); return false; }

    setError(field, '');
    return true;
  }

  function validateForm(form) {
    var fields = form.querySelectorAll('input, select, textarea');
    var valid = true;
    var first = null;

    Array.prototype.forEach.call(fields, function (field) {
      if (!validateField(field)) {
        valid = false;
        if (!first) first = field;
      }
    });

    if (first) first.focus();
    return valid;
  }

  /* ================= Datos de la solicitud ================= */

  /* Fecha de 2026-10-10 a «sábado, 10 de octubre de 2026» */
  function formatDate(iso) {
    if (!iso) return '';
    var parts = iso.split('-');
    if (parts.length !== 3) return iso;
    var d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    try {
      return d.toLocaleDateString('es-ES', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      });
    } catch (e) {
      return parts[2] + '/' + parts[1] + '/' + parts[0];
    }
  }

  function readFields(form) {
    var d = new FormData(form);
    var nombre = ((d.get('nombre') || '') + ' ' + (d.get('apellidos') || '')).trim();

    return {
      nombre: nombre,
      telefono: (d.get('telefono') || '').trim(),
      email: (d.get('email') || '').trim(),
      servicio: d.get('servicio') || '',
      tipoEvento: d.get('tipoEvento') || '',
      fechaIso: d.get('fecha') || '',
      fecha: formatDate(d.get('fecha')),
      localidad: (d.get('localidad') || '').trim(),
      personas: (d.get('personas') || '').trim(),
      mensaje: (d.get('mensaje') || '').trim()
    };
  }

  /* Asunto útil: se lee de un vistazo en la bandeja, sin abrir el correo.
     «Presupuesto · Boda · 10/10/2026 · Talavera de la Reina» */
  function buildSubject(f) {
    var partes = ['Presupuesto'];
    if (f.tipoEvento) partes.push(f.tipoEvento);
    if (f.fechaIso) {
      var p = f.fechaIso.split('-');
      partes.push(p[2] + '/' + p[1] + '/' + p[0]);
    }
    if (f.localidad) partes.push(f.localidad);
    return partes.join(' · ');
  }

  /* Lo que se envía. Se manda como JSON, que lo entienden los tres destinos:
     nuestra función de Vercel, el PHP y también FormSubmit.

     Las claves con mayúscula son las que FormSubmit usa como etiquetas del
     correo; las de minúscula las lee nuestro propio código. Van las dos cosas
     para que el mismo envío funcione con cualquiera de los tres. */
  function buildPayload(f) {
    return {
      /* Ajustes de FormSubmit (se ignoran en los otros destinos) */
      _subject: buildSubject(f),
      _template: 'table',
      _captcha: 'false',
      _replyto: f.email,

      /* Etiquetas legibles, por si el correo lo compone FormSubmit */
      'Cliente': f.nombre,
      'Teléfono': f.telefono,
      'Email': f.email,
      'Servicio solicitado': f.servicio,
      'Tipo de evento': f.tipoEvento,
      'Fecha del evento': f.fecha,
      'Localidad': f.localidad,
      'Personas (aprox.)': f.personas || 'Sin especificar',
      'Mensaje': f.mensaje || '—',

      /* Campos que lee nuestra función y el PHP para maquetar el correo */
      nombre: f.nombre,
      telefono: f.telefono,
      email: f.email,
      servicio: f.servicio,
      tipoEvento: f.tipoEvento,
      fecha: f.fechaIso,
      localidad: f.localidad,
      personas: f.personas,
      mensaje: f.mensaje
    };
  }

  /* Versión en texto plano, para WhatsApp y para el botón de copiar */
  function buildText(f) {
    return [
      'Nueva solicitud de presupuesto — La Alternativa Go',
      '',
      'Cliente: ' + f.nombre,
      'Teléfono: ' + f.telefono,
      'Email: ' + f.email,
      'Servicio: ' + f.servicio,
      'Tipo de evento: ' + f.tipoEvento,
      'Fecha: ' + f.fecha,
      'Localidad: ' + f.localidad,
      'Personas: ' + (f.personas || 'Sin especificar'),
      '',
      'Mensaje:',
      (f.mensaje || '—')
    ].join('\n');
  }

  function whatsappUrl(text) {
    return window.LAG_WhatsApp
      ? window.LAG_WhatsApp.buildUrl(text)
      : 'https://wa.me/' + (site.whatsapp || '') + '?text=' + encodeURIComponent(text);
  }

  /* ================= Interfaz ================= */
  function setStatus(status, text, kind) {
    status.className = 'form__status' + (kind ? ' is-' + kind : '');
    status.textContent = text;
  }

  function clearPanel(form) {
    var old = form.querySelector('.form__send');
    if (old) old.remove();
  }

  /* Sólo aparece si el envío automático falla */
  function buildFallback(form, text) {
    clearPanel(form);

    var panel = document.createElement('div');
    panel.className = 'form__send';
    panel.innerHTML =
      '<div class="form__send-actions">' +
        '<a class="btn btn--primary btn--sm" href="' + whatsappUrl(text) + '" ' +
           'target="_blank" rel="noopener noreferrer">Enviar por WhatsApp</a>' +
        '<button class="btn btn--ghost btn--sm" type="button" data-act="copy">Copiar datos</button>' +
      '</div>' +
      '<p class="form__send-hint" data-hint></p>';

    form.appendChild(panel);

    panel.querySelector('[data-act="copy"]').addEventListener('click', function () {
      var hint = panel.querySelector('[data-hint]');
      function ok() { hint.textContent = MESSAGES.copiado; }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(ok, fallback);
      } else { fallback(); }

      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;opacity:0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); ok(); }
        catch (e) { hint.textContent = 'Copia el texto a mano desde el formulario.'; }
        document.body.removeChild(ta);
      }
    });

    return panel;
  }

  /* ================= Arranque ================= */
  function init() {
    var form = document.getElementById('bookingForm');
    var status = document.getElementById('formStatus');
    if (!form) return;

    var submitBtn = form.querySelector('button[type="submit"]');
    var submitText = submitBtn ? submitBtn.textContent : '';

    form.addEventListener('blur', function (e) {
      if (e.target.matches('input, select, textarea')) validateField(e.target);
    }, true);

    form.addEventListener('input', function (e) {
      if (e.target.getAttribute('aria-invalid') === 'true') validateField(e.target);
    });

    form.addEventListener('change', function (e) {
      if (e.target.type === 'checkbox') validateField(e.target);
    });

    /* No permitir fechas pasadas */
    var fecha = form.querySelector('#fecha');
    if (fecha) fecha.min = new Date().toISOString().split('T')[0];

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      /* Trampa antispam: si está rellena, es un robot. Fingimos éxito. */
      var honey = form.querySelector('[name="_honey"]');
      if (honey && honey.value) { setStatus(status, MESSAGES.ok, 'ok'); return; }

      if (!validateForm(form)) {
        setStatus(status, MESSAGES.review, 'error');
        return;
      }

      var f = readFields(form);
      var text = buildText(f);
      clearPanel(form);

      /* ---- Sólo WhatsApp ---- */
      if (CONFIG.mode === 'whatsapp') {
        window.open(whatsappUrl(text), '_blank', 'noopener');
        setStatus(status, 'Se ha abierto WhatsApp con tu solicitud lista para enviar.', 'ok');
        return;
      }

      /* ---- Envío directo ---- */
      setStatus(status, MESSAGES.sending);
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Enviando…'; }

      fetch(CONFIG.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(buildPayload(f))
      })
        .then(function (res) {
          return res.text().then(function (raw) {
            return { ok: res.ok, status: res.status, raw: raw };
          });
        })
        .then(function (res) {
          /* Dejamos la respuesta cruda en la consola del navegador (F12).
             Si algún día no llega un correo, ahí se ve qué contestó
             el servicio en lugar de tener que adivinarlo. */
          console.log('[La Alternativa Go] Respuesta del envío:', res.status, res.raw);

          if (!res.ok) throw new Error('respuesta ' + res.status);

          /* FormSubmit responde 200 aunque el formulario esté SIN ACTIVAR.
             En ese caso no manda la solicitud: manda un correo de activación
             al dueño. Lo detectamos para no cantar victoria en falso. */
          var texto = (res.raw || '').toLowerCase();
          var usaFormsubmit = CONFIG.endpoint.indexOf('formsubmit') !== -1;
          var pendiente = usaFormsubmit && (
                          texto.indexOf('confirm') !== -1 ||
                          texto.indexOf('activat') !== -1 ||
                          texto.indexOf('activac') !== -1);

          if (pendiente) {
            setStatus(status, MESSAGES.pendiente, 'error');
            console.warn('[La Alternativa Go] El formulario aún NO está activado. ' +
                         'Revisa la bandeja de ' + CONFIG.email +
                         ' (y la carpeta de spam): busca un correo de FormSubmit ' +
                         'y pulsa su botón de activación. Sólo hay que hacerlo una vez.');
            return;
          }

          form.reset();
          setStatus(status, MESSAGES.ok, 'ok');
        })
        .catch(function () {
          setStatus(status, MESSAGES.error, 'error');
          if (CONFIG.fallbackWhatsApp) buildFallback(form, text);
        })
        .then(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = submitText; }
        });
    });
  }

  return { init: init, config: CONFIG };
})();
