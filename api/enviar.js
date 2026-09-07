/* ==========================================================================
   api/enviar.js — Función serverless para Vercel
   ---------------------------------------------------------------------------
   Recibe el formulario y envía el correo MAQUETADO (cabecera negra y amarilla,
   tabla de datos, mensaje destacado y botones de Llamar / Responder).

   Vercel no ejecuta PHP, así que este archivo hace el mismo trabajo que
   tools/enviar.php pero en Node. Vercel detecta solo la carpeta /api: no hay
   que configurar nada, con subir el proyecto basta.

   ─── PUESTA EN MARCHA (5 minutos, una sola vez) ───────────────────────────
   1. Entra en resend.com y crea una cuenta gratuita con hugo4rubio@gmail.com.
      El plan gratis da 3.000 correos al mes, de sobra.
   2. En «API Keys» crea una clave y cópiala (empieza por re_).
   3. En Vercel: tu proyecto → Settings → Environment Variables → Add.
        Name:  RESEND_API_KEY
        Value: la clave que acabas de copiar
      Guarda y vuelve a desplegar (Deployments → ··· → Redeploy).
   4. Listo. No hay correos de confirmación ni activaciones.

   La clave se queda en Vercel, nunca en el código ni a la vista del visitante.

   ¿Y si algún día quieres que el remitente sea tuyo en vez de resend.dev?
   Verifica el dominio alternativago.com dentro de Resend y añade otra variable
   REMITENTE con, por ejemplo:  La Alternativa Go <hola@alternativago.com>
   ========================================================================== */

const DESTINO   = 'hugo4rubio@gmail.com';
const MARCA     = 'La Alternativa Go';
const AMARILLO  = '#ffc300';
const TELEFONO  = '+34 653 79 45 37';
const WHATSAPP  = '34653794537';

/* Mientras no verifiques un dominio propio, Resend deja enviar desde esta
   dirección suya hacia el correo con el que abriste la cuenta. */
const REMITENTE_POR_DEFECTO = 'La Alternativa Go <onboarding@resend.dev>';

/* ---------- Utilidades ---------- */

function esc(valor) {
  return String(valor == null ? '' : valor)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* Quita saltos de línea para que nadie pueda colar cabeceras raras */
function limpiar(valor, max = 500) {
  return String(valor == null ? '' : valor)
    .replace(/[\r\n]+/g, ' ')
    .trim()
    .slice(0, max);
}

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
               'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

function fechaLarga(iso) {
  const p = String(iso || '').split('-');
  if (p.length !== 3) return iso || '—';
  const mes = MESES[Number(p[1]) - 1] || p[1];
  return `${Number(p[2])} de ${mes} de ${p[0]}`;
}

function esEmail(valor) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(valor || ''));
}

/* ---------- Plantilla del correo ----------
   Tablas y estilos en línea: es la única forma de que se vea igual en Gmail,
   en Outlook y en el móvil. Nada de CSS externo ni flexbox. */
function construirHtml({ filas, mensaje, telefono, email, asunto, dominio }) {
  const filasHtml = filas.map(([etiqueta, valor]) => `
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #eeeeee;font-size:13px;
                   color:#666666;white-space:nowrap;vertical-align:top;">${esc(etiqueta)}</td>
        <td style="padding:12px 16px;border-bottom:1px solid #eeeeee;font-size:15px;
                   color:#111111;font-weight:600;">${esc(valor)}</td>
      </tr>`).join('');

  const mensajeHtml = mensaje
    ? esc(mensaje).replace(/\n/g, '<br>')
    : '<span style="color:#999999;">Sin mensaje</span>';

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>${esc(asunto)}</title></head>
<body style="margin:0;padding:24px 12px;background:#f4f4f4;
             font-family:Arial,Helvetica,sans-serif;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
         style="max-width:580px;margin:0 auto;">

    <tr>
      <td style="background:#000000;padding:24px;border-radius:10px 10px 0 0;">
        <div style="color:${AMARILLO};font-size:12px;letter-spacing:2px;
                    text-transform:uppercase;font-weight:bold;">${MARCA}</div>
        <div style="color:#ffffff;font-size:22px;font-weight:bold;margin-top:6px;">
          Nueva solicitud de presupuesto
        </div>
      </td>
    </tr>

    <tr>
      <td style="background:#ffffff;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${filasHtml}
        </table>
      </td>
    </tr>

    <tr>
      <td style="background:#ffffff;padding:16px;">
        <div style="font-size:13px;color:#666666;margin-bottom:8px;">Mensaje</div>
        <div style="background:#fafafa;border-left:4px solid ${AMARILLO};padding:14px;
                    font-size:15px;color:#111111;line-height:1.6;">${mensajeHtml}</div>
      </td>
    </tr>

    <tr>
      <td style="background:#ffffff;padding:8px 16px 24px;">
        <a href="tel:${esc(telefono)}"
           style="display:inline-block;background:${AMARILLO};color:#000000;
                  text-decoration:none;font-weight:bold;font-size:14px;
                  padding:12px 22px;border-radius:999px;margin-right:8px;">Llamar</a>
        <a href="mailto:${esc(email)}?subject=${encodeURIComponent('Re: ' + asunto)}"
           style="display:inline-block;background:#000000;color:#ffffff;
                  text-decoration:none;font-weight:bold;font-size:14px;
                  padding:12px 22px;border-radius:999px;">Responder</a>
      </td>
    </tr>

    <tr>
      <td style="background:#000000;padding:16px;border-radius:0 0 10px 10px;
                 text-align:center;font-size:12px;color:#999999;">
        Enviado desde el formulario de ${esc(dominio)}
      </td>
    </tr>

  </table>
</body>
</html>`;
}

/* Copia para el cliente: mismo formato, tono de confirmación en vez de aviso interno. */
function construirHtmlCliente({ nombre, filas, mensaje, asunto }) {
  const filasHtml = filas.map(([etiqueta, valor]) => `
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #eeeeee;font-size:13px;
                   color:#666666;white-space:nowrap;vertical-align:top;">${esc(etiqueta)}</td>
        <td style="padding:12px 16px;border-bottom:1px solid #eeeeee;font-size:15px;
                   color:#111111;font-weight:600;">${esc(valor)}</td>
      </tr>`).join('');

  const mensajeHtml = mensaje
    ? esc(mensaje).replace(/\n/g, '<br>')
    : '<span style="color:#999999;">Sin mensaje</span>';

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>${esc(asunto)}</title></head>
<body style="margin:0;padding:24px 12px;background:#f4f4f4;
             font-family:Arial,Helvetica,sans-serif;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
         style="max-width:580px;margin:0 auto;">

    <tr>
      <td style="background:#000000;padding:24px;border-radius:10px 10px 0 0;">
        <div style="color:${AMARILLO};font-size:12px;letter-spacing:2px;
                    text-transform:uppercase;font-weight:bold;">${MARCA}</div>
        <div style="color:#ffffff;font-size:22px;font-weight:bold;margin-top:6px;">
          Hemos recibido tu solicitud
        </div>
      </td>
    </tr>

    <tr>
      <td style="background:#ffffff;padding:16px;">
        <div style="font-size:15px;color:#111111;line-height:1.6;">
          Hola ${esc(nombre)}, gracias por escribirnos. Hemos recibido tu solicitud de
          presupuesto y te contestaremos lo antes posible. Aquí tienes un resumen de lo
          que nos has enviado:
        </div>
      </td>
    </tr>

    <tr>
      <td style="background:#ffffff;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${filasHtml}
        </table>
      </td>
    </tr>

    <tr>
      <td style="background:#ffffff;padding:16px;">
        <div style="font-size:13px;color:#666666;margin-bottom:8px;">Tu mensaje</div>
        <div style="background:#fafafa;border-left:4px solid ${AMARILLO};padding:14px;
                    font-size:15px;color:#111111;line-height:1.6;">${mensajeHtml}</div>
      </td>
    </tr>

    <tr>
      <td style="background:#ffffff;padding:8px 16px 24px;">
        <div style="font-size:13px;color:#666666;margin-bottom:10px;">
          ¿Alguna urgencia o quieres contarnos algo más? Escríbenos por WhatsApp o llámanos.
        </div>
        <a href="https://wa.me/${WHATSAPP}"
           style="display:inline-block;background:${AMARILLO};color:#000000;
                  text-decoration:none;font-weight:bold;font-size:14px;
                  padding:12px 22px;border-radius:999px;margin-right:8px;">WhatsApp</a>
        <a href="tel:${esc(TELEFONO)}"
           style="display:inline-block;background:#000000;color:#ffffff;
                  text-decoration:none;font-weight:bold;font-size:14px;
                  padding:12px 22px;border-radius:999px;">Llamar</a>
      </td>
    </tr>

    <tr>
      <td style="background:#000000;padding:16px;border-radius:0 0 10px 10px;
                 text-align:center;font-size:12px;color:#999999;">
        ${esc(MARCA)} · ${esc(TELEFONO)}
      </td>
    </tr>

  </table>
</body>
</html>`;
}

/* ---------- Función ---------- */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Método no permitido' });
  }

  let datos = req.body;
  if (typeof datos === 'string') {
    try { datos = JSON.parse(datos); } catch (e) { datos = {}; }
  }
  datos = datos || {};

  /* Trampa antispam: los robots rellenan los campos ocultos */
  if (datos._honey) return res.status(200).json({ ok: true });

  const nombre    = limpiar(datos.nombre, 200);
  const telefono  = limpiar(datos.telefono, 40);
  const email     = limpiar(datos.email, 120);
  const servicio  = limpiar(datos.servicio, 80);
  const evento    = limpiar(datos.tipoEvento, 80);
  const fechaIso  = limpiar(datos.fecha, 20);
  const localidad = limpiar(datos.localidad, 120);
  const personas  = limpiar(datos.personas, 10);
  const mensaje   = String(datos.mensaje || '').trim().slice(0, 3000);

  /* Validación en servidor: nunca confíes sólo en la del navegador */
  if (!nombre || !telefono || !esEmail(email)) {
    return res.status(422).json({ ok: false, error: 'Faltan datos obligatorios' });
  }

  const clave = process.env.RESEND_API_KEY;
  if (!clave) {
    console.error('Falta la variable de entorno RESEND_API_KEY en Vercel.');
    return res.status(500).json({ ok: false, error: 'El envío no está configurado' });
  }

  /* Asunto legible de un vistazo en la bandeja */
  const partes = ['Presupuesto'];
  if (evento) partes.push(evento);
  if (fechaIso) {
    const p = fechaIso.split('-');
    if (p.length === 3) partes.push(`${p[2]}/${p[1]}/${p[0]}`);
  }
  if (localidad) partes.push(localidad);
  const asunto = partes.join(' · ');

  const filas = [
    ['Cliente', nombre],
    ['Teléfono', telefono],
    ['Email', email],
    ['Servicio solicitado', servicio || '—'],
    ['Tipo de evento', evento || '—'],
    ['Fecha del evento', fechaIso ? fechaLarga(fechaIso) : '—'],
    ['Localidad', localidad || '—'],
    ['Personas (aprox.)', personas || 'Sin especificar'],
  ];

  const dominio = req.headers['x-forwarded-host'] || req.headers.host || 'la web';

  /* Versión en texto plano, para gestores que no muestran HTML */
  const texto = [
    `Nueva solicitud de presupuesto — ${MARCA}`, '',
    ...filas.map(([k, v]) => `${k}: ${v}`), '',
    'Mensaje:', mensaje || '—',
  ].join('\n');

  const html = construirHtml({ filas, mensaje, telefono, email, asunto, dominio });

  try {
    const respuesta = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${clave}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.REMITENTE || REMITENTE_POR_DEFECTO,
        to: [DESTINO],
        subject: asunto,
        html,
        text: texto,
        reply_to: email,        // responder va directo al cliente
      }),
    });

    if (!respuesta.ok) {
      const detalle = await respuesta.text();
      console.error('Resend ha devuelto un error:', respuesta.status, detalle);
      return res.status(502).json({ ok: false, error: 'El servicio de correo ha fallado' });
    }

    /* Copia de confirmación para el cliente. Si falla no rompemos la
       respuesta: la solicitud ya ha llegado al negocio, que es lo esencial.
       Nota: con el remitente de pruebas de Resend (onboarding@resend.dev)
       solo se puede enviar a la cuenta con la que te diste de alta, así que
       esta copia no llegará al cliente hasta que verifiques tu propio
       dominio en Resend (ver cabecera de este archivo). */
    try {
      const htmlCliente = construirHtmlCliente({ nombre, filas, mensaje, asunto });
      const textoCliente = [
        `Hemos recibido tu solicitud — ${MARCA}`, '',
        ...filas.map(([k, v]) => `${k}: ${v}`), '',
        'Tu mensaje:', mensaje || '—',
      ].join('\n');

      const copia = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${clave}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.REMITENTE || REMITENTE_POR_DEFECTO,
          to: [email],
          subject: `Hemos recibido tu solicitud · ${MARCA}`,
          html: htmlCliente,
          text: textoCliente,
          reply_to: DESTINO,     // si el cliente responde, va directo al negocio
        }),
      });

      if (!copia.ok) {
        console.error('No se pudo enviar la copia al cliente:', copia.status, await copia.text());
      }
    } catch (e) {
      console.error('No se pudo enviar la copia al cliente:', e);
    }

    return res.status(200).json({ ok: true, success: 'true' });
  } catch (e) {
    console.error('No se ha podido contactar con el servicio de correo:', e);
    return res.status(500).json({ ok: false, error: 'No se pudo enviar el correo' });
  }
}
