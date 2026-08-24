/* ==========================================================================
   menu.js — BLOQUE 4 (carta), BLOQUE 5 (eventos) y zonas de servicio
   Se genera todo a partir de los datos de data.js
   ========================================================================== */

window.LAG_Menu = (function () {
  'use strict';

  var data = window.LAG_DATA || {};

  /* Escapa texto para evitar inyección de HTML si se editan los datos */
  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function dishCard(dish) {
    var tags = (dish.tags || [])
      .map(function (t) { return '<li>' + esc(t) + '</li>'; })
      .join('');

    /* El plato marcado como `featured` ocupa el doble en la cuadrícula */
    var cls = 'dish' + (dish.featured ? ' dish--featured' : '');
    var flag = dish.flag ? '<span class="dish__flag">' + esc(dish.flag) + '</span>' : '';

    return '' +
      '<article class="' + cls + '" data-reveal>' +
        '<div class="dish__media">' +
          flag +
          '<img src="' + esc(dish.image) + '" alt="' + esc(dish.alt || dish.name) + '" loading="lazy" width="900" height="600">' +
        '</div>' +
        '<div class="dish__body">' +
          '<div class="dish__head">' +
            '<h3 class="dish__name">' + esc(dish.name) + '</h3>' +
            '<span class="dish__price">' + esc(dish.price) + '</span>' +
          '</div>' +
          '<p class="dish__desc">' + esc(dish.description) + '</p>' +
          (tags ? '<ul class="dish__tags">' + tags + '</ul>' : '') +
        '</div>' +
      '</article>';
  }

  /* El icono es SVG propio (icons.js), por eso no pasa por esc() */
  function eventCard(ev) {
    return '' +
      '<article class="card" data-reveal>' +
        '<span class="card__icon" aria-hidden="true">' + (ev.icon || '') + '</span>' +
        '<h3 class="card__title">' + esc(ev.title) + '</h3>' +
        '<p class="card__text">' + esc(ev.text) + '</p>' +
      '</article>';
  }

  function pillarItem(p) {
    return '' +
      '<article class="pillar">' +
        '<span class="pillar__icon" aria-hidden="true">' + (p.icon || '') + '</span>' +
        '<div>' +
          '<h3 class="pillar__title">' + esc(p.title) + '</h3>' +
          '<p class="pillar__text">' + esc(p.text) + '</p>' +
        '</div>' +
      '</article>';
  }

  function highlightItem(h) {
    return '<li>' + (h.icon || '') + '<span>' + esc(h.text) + '</span></li>';
  }

  function render() {
    var pillars = document.getElementById('pillars');
    if (pillars && data.pillars) {
      pillars.innerHTML = data.pillars.map(pillarItem).join('');
    }

    var highlights = document.getElementById('heroHighlights');
    if (highlights && data.highlights) {
      highlights.innerHTML = data.highlights.map(highlightItem).join('');
    }

    var grid = document.getElementById('menuGrid');
    if (grid && data.dishes) {
      grid.innerHTML = data.dishes.map(dishCard).join('');
    }

    var events = document.getElementById('eventsGrid');
    if (events && data.events) {
      events.innerHTML = data.events.map(eventCard).join('');
    }

    var areas = document.getElementById('areasList');
    if (areas && data.areas) {
      areas.innerHTML = data.areas
        .map(function (a) { return '<li>' + esc(a) + '</li>'; })
        .join('');
    }
  }

  return { render: render };
})();
