/* ==========================================================================
   data.js — Contenido editable del sitio
   Cambia aquí textos, precios, servicios e imágenes: el HTML se genera solo.
   ========================================================================== */

window.LAG_DATA = (function () {
  'use strict';

  /* ---------- Datos del negocio (se usan en varios sitios) ---------- */
  var site = {
    name: 'La Alternativa Go',
    domain: 'https://www.alternativago.com',
    city: 'Talavera de la Reina',
    province: 'Toledo',
    whatsapp: '34653794537',                 // sin + ni espacios, para wa.me
    phoneDisplay: '+34 653 79 45 37',
    phoneLink: '+34653794537',
    waMessage: 'Hola, me gustaría pedir presupuesto para alquilar la foodtruck con catering.',
    instagram: 'https://www.instagram.com/la_alternativa_go/',
    // Enlace para pedir reseñas de Google Business Profile
    // (en la ficha: "Pedir reseñas" → copiar enlace, tipo https://g.page/r/XXXX/review).
    // Mientras esté vacío, los enlaces de reseñas no se muestran.
    googleReviews: '',
    // Google Analytics 4: solo se carga si el visitante acepta las cookies
    ga4Id: 'G-7920N6SBF6'
  };

  /* Base de las imágenes.
     Si descargas las fotos a assets/img (ver tools/descargar-imagenes.sh),
     el script cambia estas rutas automáticamente. */
  var IMG = {
    molletes:  'assets/img/molletes.jpg',
    raciones:  'assets/img/raciones.jpg',
    patatas:   'assets/img/patatas.jpg',
    pincho:    'assets/img/pincho.jpg',
    foodtruck: 'assets/img/foodtruck.jpg'
  };


  /* Los iconos viven en assets/js/icons.js (un único set para toda la web) */
  var I = window.LAG_ICONS || {};

  /* ---------- BLOQUE 3 · Servicios ----------
     REVISA ESTOS TEXTOS: describen lo que ofrecéis y deben coincidir con la
     realidad del servicio. Ajusta o borra los puntos que no correspondan. */
  var services = [
    {
      icon: I.truck,
      title: 'Alquiler de foodtruck',
      text: 'Llevamos la foodtruck hasta tu evento en Talavera de la Reina y la provincia de Toledo, montada y lista para servir.',
      points: [
        'Montaje y desmontaje incluidos',
        'Cocina propia dentro de la foodtruck',
        'Personal de servicio durante el evento',
        'Nos adaptamos al espacio disponible'
      ]
    },
    {
      icon: I.cloche,
      title: 'Catering para eventos',
      text: 'Catering de street food adaptado a tu celebración: elegimos contigo las raciones y ajustamos las cantidades a tus invitados.',
      points: [
        'Menús a medida según el evento',
        'Cantidades calculadas por número de personas',
        'Opciones para grupos grandes y pequeños',
        'Servicio continuo o por pases'
      ]
    },
    {
      icon: I.confetti,
      title: 'Servicio completo para celebraciones',
      text: 'Nos encargamos de la comida, el personal y el montaje para que tú solo tengas que disfrutar de tu evento.',
      points: [
        'Coordinación con el lugar de la celebración',
        'Menaje desechable y recogida',
        'Horarios flexibles, también de noche',
        'Festivales, ferias y fiestas populares'
      ]
    }
  ];

  /* ---------- BLOQUE 2 · Quiénes somos ---------- */
  var pillars = [
    { icon: I.flame,    title: 'Sabor',                    text: 'Comida callejera hecha para disfrutar.' },
    { icon: I.truck,    title: 'Nos movemos',              text: 'Llevamos la foodtruck hasta tu evento.' },
    { icon: I.sparkles, title: 'Tu evento, nuestra fiesta', text: 'Nos adaptamos al ambiente y al tipo de celebración.' }
  ];

  /* ---------- BLOQUE 4 · Carta ---------- */
  var dishes = [
    {
      name: 'Molletes',
      price: '6 €',
      featured: true,
      flag: 'El más pedido',
      image: IMG.molletes,
      alt: 'Molletes recién tostados de la foodtruck',
      description: 'Molletes tostados y rellenos, listos para comer con las manos.',
      tags: ['oreja', 'calamares', 'bacon', 'lomo', 'chorizo']
    },
    {
      name: 'Raciones',
      price: '10 €',
      image: IMG.raciones,
      alt: 'Ración de street food para compartir',
      description: 'Raciones generosas para compartir en cualquier celebración.',
      tags: ['oreja', 'calamares', 'fingers']
    },
    {
      name: 'Patatas',
      price: '5 €',
      image: IMG.patatas,
      alt: 'Patatas fritas crujientes recién hechas',
      description: 'Crujientes y recién hechas.',
      tags: []
    },
    {
      name: 'Pincho Moruno',
      price: '3,50 €',
      image: IMG.pincho,
      alt: 'Pincho moruno especiado a la plancha',
      description: 'Especiado y a la plancha.',
      tags: []
    }
  ];

  /* ---------- BLOQUE 5 · Eventos ---------- */
  var events = [
    { icon: I.cake,      title: 'Cumpleaños',            text: 'Celebra a lo grande con comida para todos.' },
    { icon: I.music,     title: 'Fiestas privadas',      text: 'Ambiente, música y street food sin límites.' },
    { icon: I.heart,     title: 'Bodas y celebraciones', text: 'El toque diferente que nadie olvida.' },
    { icon: I.briefcase, title: 'Eventos de empresa',    text: 'Comidas informales, afterworks y ferias.' },
    { icon: I.tent,      title: 'Festivales',            text: 'Servicio rápido para mucho público.' },
    { icon: I.flag,      title: 'Fiestas populares',     text: 'Ferias, verbenas y fiestas de barrio.' }
  ];

  /* ---------- BLOQUE 6 · Galería ---------- */
  /* Fotos locales optimizadas (WebP): "-sm" (1000px) para la cuadrícula y la
     versión grande (2048px) para pantallas retina y el visor a pantalla completa.
     La primera foto se muestra destacada, en grande. */
  var GAL = 'assets/img/galeria/';
  function gal(file, title, alt) {
    return { src: GAL + file + '-sm.webp', full: GAL + file + '.webp', title: title, alt: alt };
  }
  var gallery = [
    gal('16-equipo-foodtruck-evento', 'Nuestro equipo, listo para servir',
        'Equipo de camareros de La Alternativa Go junto a la foodtruck en un evento en Talavera de la Reina'),
    gal('04-ensaladas-langostinos',   'Ensaladas de langostinos',
        'Ensaladas con langostinos emplatadas para un catering de celebración'),
    gal('13-cortador-jamon',          'Cortador de jamón a cuchillo',
        'Cortador de jamón a cuchillo en un catering al aire libre en Toledo'),
    gal('03-foodtruck-roll-up',       'La foodtruck en un evento',
        'Foodtruck amarilla de La Alternativa Go montada para un evento en la provincia de Toledo'),
    gal('07-canapes-variados',        'Canapés variados',
        'Canapés variados de salmón, paté y membrillo para catering de eventos'),
    gal('15-tablas-queso-jamon',      'Tablas de queso y jamón',
        'Tablas de queso curado y jamón para un cóctel de empresa'),
    gal('11-desayuno-bolleria',       'Desayunos de empresa',
        'Desayuno de catering con croissants de jamón y queso y bollería variada'),
    gal('06-vino-men-de-mencia',      'Vino D.O. Bierzo',
        'Vino tinto D.O. Bierzo servido en mesa alta durante un evento al aire libre'),
    gal('12-cafe-y-zumos',            'Estación de café y zumos',
        'Estación de café, zumos y bollería para un desayuno de empresa')
  ];

  /* ---------- BLOQUE 8 · Zonas de servicio (SEO local) ---------- */
  var areas = [
    'Talavera de la Reina', 'Toledo', 'Oropesa', 'Calera y Chozas', 'Cebolla',
    'Velada', 'Alcaudete de la Jara', 'La Pueblanueva', 'Torrijos', 'Illescas',
    'Consuegra', 'Quintanar de la Orden', 'Provincia de Toledo'
  ];

  /* ---------- BLOQUE 1 · Chips del hero ---------- */
  var highlights = [
    { icon: I.truck,    text: 'Alquiler de foodtruck' },
    { icon: I.cloche,   text: 'Catering para eventos' },
    { icon: I.pin,      text: 'Talavera y provincia de Toledo' },
    { icon: I.confetti, text: 'Bodas, empresas y festivales' }
  ];

  /* ---------- Marquesina ---------- */
  var marquee = [
    'Alquiler de foodtruck', 'Catering para eventos', 'Talavera de la Reina',
    'Provincia de Toledo', 'Bodas', 'Cumpleaños', 'Eventos de empresa',
    'Festivales', 'Street food'
  ];

  return {
    site: site,
    images: IMG,
    services: services,
    pillars: pillars,
    highlights: highlights,
    dishes: dishes,
    events: events,
    gallery: gallery,
    areas: areas,
    marquee: marquee
  };
})();
