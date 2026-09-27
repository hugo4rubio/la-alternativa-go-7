#!/usr/bin/env node
/* =============================================================================
   prerender.js — Escribe en index.html el contenido que se genera desde data.js
   -----------------------------------------------------------------------------
   Servicios, carta, eventos, galería, zonas… se generan con JavaScript a partir
   de assets/js/data.js. Google ejecuta ese JavaScript, pero otros buscadores,
   las vistas previas de redes y las extensiones de SEO solo leen el HTML.

   Este script ejecuta los mismos render() de la web y copia el resultado dentro
   de cada contenedor de index.html. En el navegador, el JavaScript vuelve a
   generar exactamente lo mismo, así que data.js sigue siendo la única fuente.

   Uso (después de cambiar data.js):   node tools/prerender.js
   ============================================================================= */
'use strict';

var fs = require('fs');
var path = require('path');
var vm = require('vm');

var ROOT = path.join(__dirname, '..');
var INDEX = path.join(ROOT, 'index.html');

/* Contenedores que se rellenan desde data.js */
var IDS = ['heroHighlights', 'pillars', 'servicesGrid', 'menuGrid', 'eventsGrid', 'gallery', 'areasList'];

/* DOM mínimo: solo lo que usan los render() */
var hosts = {};
IDS.forEach(function (id) {
  hosts[id] = { id: id, innerHTML: '', addEventListener: function () {} };
});
var sandbox = {
  document: {
    getElementById: function (id) { return hosts[id] || null; },
    addEventListener: function () {},
    createElement: function () { return {}; }
  }
};
sandbox.window = sandbox;
vm.createContext(sandbox);

['icons.js', 'data.js', 'services.js', 'menu.js', 'gallery.js'].forEach(function (file) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'assets/js', file), 'utf8'), sandbox, { filename: file });
});
sandbox.LAG_Services.render();
sandbox.LAG_Menu.render();
sandbox.LAG_Gallery.render();

var html = fs.readFileSync(INDEX, 'utf8');
var eol = html.indexOf('\r\n') !== -1 ? '\r\n' : '\n';

IDS.forEach(function (id) {
  var content = hosts[id].innerHTML;
  if (!content) throw new Error('Sin contenido para #' + id);
  var block = '<!-- prerender -->' + content + '<!-- /prerender -->';

  var open = new RegExp('<(div|ul)\\b[^>]*\\bid="' + id + '"[^>]*>');
  var m = open.exec(html);
  if (!m) throw new Error('No encuentro el contenedor #' + id + ' en index.html');
  var start = m.index + m[0].length;
  var rest = html.slice(start);

  if (rest.indexOf('<!-- prerender -->') === 0) {
    // Ya prerenderizado: sustituimos lo que hay entre los marcadores
    var end = rest.indexOf('<!-- /prerender -->') + '<!-- /prerender -->'.length;
    html = html.slice(0, start) + block + rest.slice(end);
  } else if (rest.indexOf('</' + m[1] + '>') === 0) {
    // Contenedor vacío: insertamos
    html = html.slice(0, start) + block + rest;
  } else {
    throw new Error('#' + id + ' tiene contenido escrito a mano; vacíalo antes de prerenderizar');
  }
});

fs.writeFileSync(INDEX, html.replace(/\r?\n/g, eol));
console.log('✓ index.html actualizado: ' + IDS.map(function (id) { return '#' + id; }).join(', '));
