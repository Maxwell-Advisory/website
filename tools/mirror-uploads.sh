#!/usr/bin/env bash
# Mirror every wp-content/uploads asset referenced by the mirrored pages and
# stylesheets into tools/live-cache/, so Playwright renders the live pages WITH
# their images. Without this the mirrored "live" screenshots are image-less and
# useless for visual comparison.
set -u
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"; CACHE="$DIR/live-cache"
urls=$(grep -rhoE 'wp-content/uploads/[A-Za-z0-9._/@%-]+\.(jpg|jpeg|png|webp|gif|svg|avif)' \
        "$CACHE/pages" "$CACHE/wp-content" 2>/dev/null | sort -u)
n=0; got=0
for u in $urls; do
  n=$((n+1)); out="$CACHE/$u"
  [ -s "$out" ] && { got=$((got+1)); continue; }
  mkdir -p "$(dirname "$out")"
  if curl -sfL --max-time 45 "https://maxwelladvisory.eu/$u" -o "$out"; then got=$((got+1)); else rm -f "$out"; fi
done
echo "uploads: $got/$n cached"
