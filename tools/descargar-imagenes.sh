#!/usr/bin/env bash
# =============================================================================
#  descargar-imagenes.sh
#  Descarga las imágenes del sitio original a assets/img/ y deja el proyecto
#  100% autocontenido (sin depender del dominio de Lovable).
#
#  Uso:  bash tools/descargar-imagenes.sh
#  Después, cambia las rutas en assets/js/data.js e index.html
#  (el script lo hace por ti automáticamente al final).
# =============================================================================
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IMG_DIR="$ROOT/assets/img"
BASE="https://go-la-alternativa.lovable.app"

mkdir -p "$IMG_DIR"

# nombre_local|url
FILES=(
  "logo.png|$BASE/__l5e/assets-v1/32ec6c4f-a5d9-499d-bb40-7dfcc9fcb85c/logo.png"
  "foodtruck.jpg|$BASE/__l5e/assets-v1/ecceaca8-2824-4d01-a760-b88249148760/foodtruck.jpg"
  "molletes.jpg|$BASE/assets/molletes-B9-d8B8x.jpg"
  "raciones.jpg|$BASE/assets/raciones-awO_NZwh.jpg"
  "patatas.jpg|$BASE/assets/patatas-DdcZ9OKu.jpg"
  "pincho.jpg|$BASE/assets/pincho-zPvPMn5n.jpg"
  "gal-festival.jpg|$BASE/assets/gal-festival-BaoRu4VW.jpg"
  "gal-people.jpg|$BASE/assets/gal-people-CXD2jUQX.jpg"
  "gal-birthday.jpg|$BASE/assets/gal-birthday-BQISnI2h.jpg"
  "gal-corporate.jpg|$BASE/assets/gal-corporate-D7jUyK9-.jpg"
)

echo "→ Descargando imágenes en assets/img/ …"
for entry in "${FILES[@]}"; do
  name="${entry%%|*}"
  url="${entry#*|}"
  if curl -fsSL "$url" -o "$IMG_DIR/$name"; then
    echo "   ✓ $name"
  else
    echo "   ✗ $name  (no se pudo descargar: $url)"
  fi
done

echo
echo "→ Reescribiendo rutas en index.html, paginas/*.html y assets/js/data.js …"

# sed compatible con macOS y Linux
sedi() { if sed --version >/dev/null 2>&1; then sed -i "$@"; else sed -i '' "$@"; fi; }

replace_in() {
  local file="$1" prefix="$2"
  sedi \
    -e "s#$BASE/__l5e/assets-v1/32ec6c4f-a5d9-499d-bb40-7dfcc9fcb85c/logo.png#${prefix}logo.png#g" \
    -e "s#$BASE/__l5e/assets-v1/ecceaca8-2824-4d01-a760-b88249148760/foodtruck.jpg#${prefix}foodtruck.jpg#g" \
    -e "s#$BASE/assets/molletes-B9-d8B8x.jpg#${prefix}molletes.jpg#g" \
    -e "s#$BASE/assets/raciones-awO_NZwh.jpg#${prefix}raciones.jpg#g" \
    -e "s#$BASE/assets/patatas-DdcZ9OKu.jpg#${prefix}patatas.jpg#g" \
    -e "s#$BASE/assets/pincho-zPvPMn5n.jpg#${prefix}pincho.jpg#g" \
    -e "s#$BASE/assets/gal-festival-BaoRu4VW.jpg#${prefix}gal-festival.jpg#g" \
    -e "s#$BASE/assets/gal-people-CXD2jUQX.jpg#${prefix}gal-people.jpg#g" \
    -e "s#$BASE/assets/gal-birthday-BQISnI2h.jpg#${prefix}gal-birthday.jpg#g" \
    -e "s#$BASE/assets/gal-corporate-D7jUyK9-.jpg#${prefix}gal-corporate.jpg#g" \
    "$file"
  echo "   ✓ $(basename "$file")"
}

replace_in "$ROOT/index.html"          "assets/img/"
replace_in "$ROOT/assets/js/data.js"   "assets/img/"
for page in "$ROOT"/paginas/*.html; do
  replace_in "$page" "../assets/img/"
done

echo
echo "✅ Listo. El sitio ya usa imágenes locales."
