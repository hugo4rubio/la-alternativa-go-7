/* ==========================================================================
   gallery.js — Galería de imágenes + visor a pantalla completa (lightbox)
   ========================================================================== */

window.LAG_Gallery = (function () {
  'use strict';

  var data = window.LAG_DATA || {};
  var lightbox = null;
  var index = 0;

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function buildLightbox() {
    lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Galería de imágenes');
    lightbox.innerHTML =
      '<button class="lightbox__close" aria-label="Cerrar">&times;</button>' +
      '<button class="lightbox__nav lightbox__nav--prev" aria-label="Anterior">&#8249;</button>' +
      '<img class="lightbox__img" src="" alt="">' +
      '<button class="lightbox__nav lightbox__nav--next" aria-label="Siguiente">&#8250;</button>';
    document.body.appendChild(lightbox);

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target.closest('.lightbox__close')) return close();
      if (e.target.closest('.lightbox__nav--prev')) return step(-1);
      if (e.target.closest('.lightbox__nav--next')) return step(1);
    });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
  }

  function show(i) {
    var items = data.gallery || [];
    if (!items.length) return;
    index = (i + items.length) % items.length;
    var img = lightbox.querySelector('.lightbox__img');
    img.src = items[index].src;
    img.alt = items[index].alt || '';
  }

  function step(delta) { show(index + delta); }

  function open(i) {
    if (!lightbox) buildLightbox();
    show(i);
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('.lightbox__close').focus();
  }

  function close() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function render() {
    var host = document.getElementById('gallery');
    if (!host || !data.gallery) return;

    host.innerHTML = data.gallery.map(function (item, i) {
      return '' +
        '<button class="gallery__item" type="button" data-index="' + i + '" ' +
                'aria-label="Ampliar: ' + esc(item.alt) + '" data-reveal>' +
          '<img src="' + esc(item.src) + '" alt="' + esc(item.alt) + '" loading="lazy">' +
        '</button>';
    }).join('');

    host.addEventListener('click', function (e) {
      var btn = e.target.closest('.gallery__item');
      if (btn) open(Number(btn.dataset.index));
    });
  }

  return { render: render };
})();
