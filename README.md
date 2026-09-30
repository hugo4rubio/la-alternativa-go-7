# La Alternativa Go — web estática (HTML / CSS / JS)

Web de **alquiler de foodtruck y catering para eventos** en Talavera de la Reina y la provincia
de Toledo. HTML, CSS y JavaScript puros, sin frameworks ni compilación: se abre con doble clic
y se sube a cualquier hosting tal cual.

Dominio configurado: **https://www.alternativago.com**

---

## Estructura

```
la-alternativa-go/
├── index.html                  ← página principal (los 8 bloques)
├── robots.txt                  ← indicaciones para buscadores
├── sitemap.xml                 ← mapa del sitio para Google
├── vercel.json                 ← redirecciones y caché de imágenes, CSS y JS
│
├── catering-bodas-talavera/    ← página de servicio: catering para bodas
├── catering-empresas-toledo/   ← página de servicio: catering para empresas
├── alquiler-food-truck/        ← página de servicio: alquiler de food truck
│   (HTML estático: se editan a mano. Si añades otra, enlázala desde el pie
│    de index.html y de las demás páginas, y añádela a sitemap.xml y vercel.json)
│
├── api/
│   └── enviar.js               ← función de Vercel: manda el correo maquetado
│
├── paginas/                    ← páginas legales
│   ├── aviso-legal.html
│   ├── politica-privacidad.html
│   ├── politica-cookies.html
│   └── condiciones-de-reserva.html
│
├── assets/
│   ├── css/
│   │   ├── base.css            ← reset, paleta (blanco/negro/amarillo), tipografía
│   │   ├── layout.css          ← header, navegación, rejillas, secciones, footer
│   │   ├── components.css      ← botones, tarjetas, formulario, WhatsApp, cookies, lightbox
│   │   ├── sections.css        ← estilos propios de cada uno de los 8 bloques
│   │   └── responsive.css      ← media queries (tablet, móvil, impresión)
│   │
│   ├── js/
│   │   ├── data.js             ← CONTENIDO EDITABLE: servicios, carta, eventos, zonas, teléfono
│   │   ├── nav.js              ← menú móvil, header al hacer scroll, enlace activo
│   │   ├── services.js         ← pinta el bloque de servicios
│   │   ├── menu.js             ← pinta la carta, los eventos y las zonas de servicio
│   │   ├── gallery.js          ← galería + visor a pantalla completa
│   │   ├── form.js             ← validación y envío del formulario a tu correo
│   │   ├── whatsapp.js         ← construye todos los enlaces de WhatsApp
│   │   ├── cookies.js          ← banner de consentimiento
│   │   ├── ui.js               ← animaciones, marquesina, año del footer
│   │   └── main.js             ← punto de entrada
│   │
│   └── img/
│       ├── icon-foodtruck.svg  ← iconos vectoriales dibujados para Servicios
│       ├── icon-catering.svg
│       └── icon-celebracion.svg
│
├── tools/
│   ├── descargar-imagenes.sh   ← descarga las fotos y cambia las rutas a locales
│   └── enviar.php              ← alternativa con PHP para recibir el formulario
│
└── README.md
```

---

## Los bloques y su SEO

Cada bloque tiene su propio `<h2>` con palabra clave, texto optimizado y datos estructurados
(`application/ld+json`) que Google lee por separado.

| # | Bloque | H2 / keyword | Datos estructurados |
|---|---|---|---|
| 1 | Inicio | Catering y foodtruck en Talavera de la Reina *(es el H1)* | `WebPage` |
| 2 | Quiénes somos | Foodtruck y catering en Talavera de la Reina | `AboutPage` |
| 3 | Servicios | Alquiler de foodtruck y catering para eventos | `OfferCatalog` + 3 `Service` |
| 4 | Carta | Carta de street food para tu catering | `Menu` + `MenuItem` con precios |
| 5 | Eventos | Catering para bodas, cumpleaños y eventos de empresa | `ItemList` |
| 6 | Galería | Nuestra foodtruck en eventos de Talavera de la Reina | `ImageGallery` |
| 7 | La Alternativa | ¿Conoces La Alternativa? | `Organization` |
| — | Preguntas frecuentes | Catering y foodtruck en Talavera de la Reina: lo que más nos preguntáis | `FAQPage` |
| 8 | Reservas | Pide presupuesto de catering en Talavera de la Reina | `ContactPage` + `ContactPoint` |

En el `<head>` va además la ficha del negocio (`LocalBusiness` + `FoodEstablishment`) con teléfono,
coordenadas de Talavera de la Reina y área de servicio (ciudad + provincia de Toledo), más las
etiquetas `geo.*`, Open Graph, Twitter Card y el canonical.

### Palabras clave objetivo

1. **catering en Talavera de la Reina**
2. **foodtruck / food truck en Talavera de la Reina**

Están en el `<title>`, la meta descripción, el H1, la sección de preguntas frecuentes y la ficha
del negocio (`LocalBusiness`, con los pueblos donde se da servicio, `knowsAbout` e Instagram en
`sameAs`). El `sitemap.xml` incluye las fotos de la galería para Google Imágenes.

### Qué falta para posicionar de verdad (fuera del código)

La web ya está preparada; lo que más pesa en una búsqueda local se hace fuera de ella:

1. **Google Business Profile** — crea o reclama la ficha. Categoría principal *Servicio de catering*,
   secundaria *Food truck*, zona de servicio Talavera de la Reina + provincia de Toledo, fotos,
   teléfono `+34 653 79 45 37` y la web. Es lo que más mueve la aguja.
2. **Reseñas** — en la ficha, *Pedir reseñas* → copia el enlace y pégalo en `assets/js/data.js`
   → `site.googleReviews`. Aparecerá solo el enlace «Déjanos tu reseña en Google» en la tarjeta de
   contacto y en el pie. Pide una reseña después de cada evento.
3. **Google Search Console** — añade la propiedad `https://www.alternativago.com/`, elige
   verificación por *Etiqueta HTML*, pega el código en la línea comentada
   `google-site-verification` del `<head>` de `index.html`, publica y envía `sitemap.xml`.
4. **Mismos datos en todas partes** — nombre «La Alternativa Go», teléfono y «Talavera de la Reina»
   igual en Instagram, Facebook, laalternativa.es y directorios (Bodas.net, Páginas Amarillas…).
5. **Enlace desde laalternativa.es** — pega el fragmento de `tools/enlace-para-laalternativa.html`
   en la web del gastro-bar.
6. **Instagram** — comprueba que `https://www.instagram.com/la_alternativa_go/` es la cuenta
   correcta (está en `data.js`, en el `<head>` y en el pie) y pon el enlace a la web en la bio.

### ⚠️ Después de cambiar `data.js`, ejecuta el prerender

Servicios, carta, eventos, galería y zonas se generan desde `data.js`, pero además están
**escritos en el HTML** (entre `<!-- prerender -->` … `<!-- /prerender -->`) para que los lean
todos los buscadores, las vistas previas de redes y las extensiones de SEO, no solo Google.
Si cambias `data.js`, actualiza ese HTML con:

```bash
node tools/prerender.js
```

### URL limpia

Los enlaces del menú desplazan la página sin añadir `#seccion` a la URL (`nav.js`), así la
dirección coincide siempre con la canónica `https://www.alternativago.com/`.

---

## Cómo verlo

**Opción rápida:** doble clic en `index.html`.

**Con servidor local** (recomendado, se comporta como en producción):

```bash
cd la-alternativa-go
python3 -m http.server 8000
# → http://localhost:8000
```

---

## Qué tocar para personalizar

| Quiero cambiar… | Archivo |
|---|---|
| Servicios, carta, precios, eventos, zonas de servicio | `assets/js/data.js` |
| Teléfono y WhatsApp (un solo sitio para toda la web) | `site.whatsapp` en `assets/js/data.js` |
| Textos de las secciones y el SEO | `index.html` |
| Colores, tipografías, espaciados | variables `:root` en `assets/css/base.css` |
| A dónde llega el formulario | `CONFIG` al inicio de `assets/js/form.js` |
| Dominio en canonical, sitemap y JSON-LD | `index.html`, `sitemap.xml`, `robots.txt` |

### Paleta

Solo se usan tres colores, definidos en `assets/css/base.css`:

```css
--c-yellow: #ffc300;
--c-black:  #000000;
--c-white:  #ffffff;
```

Los grises que ves son negro con transparencia (`rgba(0,0,0,.70)`), no un color aparte.

---

## WhatsApp

Número configurado: **+34 653 79 45 37**.

Aparece en cuatro sitios: botón flotante, tarjeta de contacto, bloque de servicios y pie. Todos se
generan desde `assets/js/whatsapp.js` a partir de `site.whatsapp` en `data.js`, así que para
cambiar el número basta con tocar esa línea.

---

## Formulario → hugo4rubio@gmail.com

El visitante rellena, pulsa «Solicitar presupuesto» y el mensaje sale solo. No se abre Gmail
ni ningún programa de correo.

**Dónde se envía se decide en una sola línea** de `assets/js/form.js`:

```js
endpoint: '/api/enviar',
```

| Dónde alojas la web | Pon aquí | Cómo llega el correo |
|---|---|---|
| **Vercel / Netlify** *(configurado)* | `'/api/enviar'` | Maquetado con los colores de la marca |
| Hosting con PHP | `'enviar.php'` | Maquetado igual |
| Cualquier sitio, sin configurar | la URL de `formsubmit.co` | Plantilla genérica del servicio |

### Vercel: puesta en marcha (5 minutos, una vez)

Vercel no ejecuta PHP, así que el correo lo manda `api/enviar.js`. Vercel detecta la carpeta
`/api` solo: no hay que configurar rutas ni nada.

1. Entra en **resend.com** y crea una cuenta gratuita con `hugo4rubio@gmail.com`
   (3.000 correos al mes en el plan gratis).
2. En **API Keys**, crea una clave y cópiala (empieza por `re_`).
3. En Vercel: proyecto → **Settings → Environment Variables → Add**
   - Name: `RESEND_API_KEY`
   - Value: la clave
4. Vuelve a desplegar: **Deployments → ··· → Redeploy**.

La clave se queda guardada en Vercel: nunca está en el código ni la ve el visitante.

Cada envío manda **dos correos**:

- **A ti**, con la solicitud completa. Sale desde `onboarding@resend.dev`, y el botón Responder
  va directo al cliente.
- **Al cliente**, confirmando que la hemos recibido, con un resumen y los botones WhatsApp y
  Llamar. Sale desde `hola@alternativago.com`, y si contesta, te llega a ti. Para eso
  `alternativago.com` tiene que estar verificado en Resend (**Domains**). Si esta copia falla,
  tu correo llega igual y el error queda en los logs de Vercel.

Para usar otro remitente en los dos, añade la variable `REMITENTE`, por ejemplo
`La Alternativa Go <reservas@alternativago.com>`.

### Cómo llega el correo

- **Asunto:** `Presupuesto · Boda o celebración · 10/10/2026 · Talavera de la Reina`
- **Cuerpo:** cabecera negra y amarilla, tabla con los datos, el mensaje del cliente destacado
  y dos botones, **Llamar** y **Responder**.
- **Fecha** en largo: «10 de octubre de 2026», no `2026-10-10`.
- **Responder** va directo al cliente.

`api/enviar.js` y `tools/enviar.php` generan exactamente el mismo correo, así que da igual por
cuál de los dos acabes yendo.

### Si algo falla

Si el envío no sale (sin conexión, servicio caído, falta la clave), aparece un botón para
mandar la misma solicitud por WhatsApp y otro para copiar los datos, y **los campos no se
borran**. En la consola del navegador (F12) queda escrita la respuesta literal del servidor.

Y recuerda: **abrir `index.html` con doble clic no sirve para probar el envío**. El navegador
bloquea la petición al venir de un archivo local. Hay que servirlo por `http://`.

---

## Banner de cookies

Aparece en la primera visita, guarda la elección 12 meses y se puede reabrir desde «Configurar
cookies» en el pie. Ahora mismo la web no lleva analítica, así que el banner es informativo.

**Si algún día añades Google Analytics o un píxel de Meta, no lo pongas en el HTML.** Regístralo en
`assets/js/cookies.js` para que solo se cargue con consentimiento, como exige la ley:

```js
LAG_Cookies.onAccept(function () {
  // aquí dentro va el script de analítica
});
```

Y actualiza la tabla de cookies en `paginas/politica-cookies.html`.

---

## Imágenes

✅ **Ya hecho:** todas las imágenes están en `assets/img/` y la web no depende de Lovable.
`foodtruck.jpg` y `logo.png` están recomprimidas, y `favicon.png` / `apple-touch-icon.png` se
generaron a partir del logo. **No vuelvas a lanzar el script**: sobrescribiría esas versiones
optimizadas con las originales (mucho más pesadas).

Las fotos de la galería están en `assets/img/galeria/` (WebP, `-sm` de 1000px para la cuadrícula
y 2048px para el visor), y `og-foodtruck-catering-talavera.jpg` (1200×630) es la imagen al
compartir en redes.

Script original, por referencia:

```bash
bash tools/descargar-imagenes.sh
```

Descarga todo a `assets/img/` y reescribe las rutas en `index.html`, `paginas/*.html` y
`assets/js/data.js`. Si no tienes `curl`, copia las imágenes a mano en `assets/img/` con estos
nombres: `logo.png`, `foodtruck.jpg`, `molletes.jpg`, `raciones.jpg`, `patatas.jpg`, `pincho.jpg`.

### Los iconos de Servicios

El bloque de Servicios no usa fotos, sino tres iconos vectoriales dibujados a medida (foodtruck,
bandeja y confeti). Están en `assets/img/icon-*.svg` y también en línea dentro de `data.js`, en la
constante `ICONS`, para que hereden el color de cada sección.

Si más adelante consigues fotos reales de cada servicio y prefieres usarlas, se sustituye el icono
por una imagen en `assets/js/services.js`.

---

## Pendiente antes de publicar

- [ ] **Datos del titular** en las cuatro páginas legales — están resaltados en amarillo
      (`[NOMBRE O RAZÓN SOCIAL]`, `[NIF / CIF]`, `[DIRECCIÓN COMPLETA]`, `[EMAIL DE CONTACTO]`…)
- [ ] **Revisar los textos de Servicios** en `data.js`: describen lo que ofrecéis y deben coincidir
      con la realidad (montaje, personal, menaje, horarios). Ajusta o borra lo que no aplique.
- [ ] **Condiciones de reserva**: señal, formas de pago y plazos de cancelación
- [ ] Email de contacto, cuando lo tengas
- [x] Imágenes locales (ya no depende de Lovable)
- [ ] Subir el dominio, verificar Google Search Console y enviar `sitemap.xml`
- [ ] Crear la ficha de Google Business Profile y pegar el enlace de reseñas en `data.js`

---

## Efectos y detalles

- **Botones:** una capa de color entra deslizándose desde la izquierda al pasar el ratón
- **Tarjetas:** se elevan y una barra amarilla crece de izquierda a derecha en el borde superior
- **Platos:** la foto hace zoom y el precio se inclina ligeramente
- **Galería:** velo amarillo con un «+» al pasar por encima; se abre a pantalla completa
- **Hero:** zoom lentísimo del fondo y una guía de «desliza» que late abajo
- **Quiénes somos (siempre en marcha):** la foto hace zoom continuo, un marco amarillo
  desplazado flota detrás, un brillo la recorre cada pocos segundos, el cartel «Nuestra
  foodtruck» levita con su punto parpadeando y los tres iconos laterales respiran por turnos
- **La Alternativa:** foco de luz amarillo que late, aro punteado girando alrededor del
  logotipo, logotipo levitando y botón con halo
- **Header:** barra amarilla de progreso de lectura en el borde inferior
- **WhatsApp:** halo que late para atraer la mirada, se detiene al pasar el ratón
- **Marquesina:** se pausa al pasar el ratón por encima

Todo se desactiva automáticamente si el sistema del visitante pide `prefers-reduced-motion`.

---

## Detalles incluidos

- Paleta estricta blanco / negro / amarillo
- Diseño responsive (móvil, tablet, escritorio) y estilos de impresión
- Botón flotante de WhatsApp, redondo en móvil para no tapar contenido
- Banner de cookies con aceptar / rechazar, caducidad de 12 meses y reapertura desde el pie
- Menú hamburguesa accesible con `aria-expanded` y cierre con `Esc`
- Enlace de navegación activo según la sección visible
- Animaciones de aparición al hacer scroll, desactivadas con `prefers-reduced-motion`
- Galería con visor a pantalla completa (ratón y teclado)
- Formulario con validación en español, casilla de privacidad obligatoria y bloqueo de fechas pasadas
- `skip-link`, textos alternativos descriptivos y foco visible
