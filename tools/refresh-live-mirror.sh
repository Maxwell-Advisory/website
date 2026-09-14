#!/usr/bin/env bash
# Refresh the local mirror of the live site used by tools/compare.mjs.
#
# Why a mirror: this environment aborts headless-browser subresource requests to
# maxwelladvisory.eu, so the live page would render unstyled and every
# comparison would be garbage. curl works, so we fetch the HTML and all of its
# stylesheets once and serve them locally. Images/fonts come from ./public,
# which holds the same asset files.
#
# Run from the repo root:  npm run compare:refresh
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CACHE="$DIR/live-cache"
SITE="https://maxwelladvisory.eu"

mkdir -p "$CACHE"
echo "Fetching $SITE ..."
curl -sL --max-time 60 "$SITE/" -o "$CACHE/live.html"
echo "  HTML: $(wc -c < "$CACHE/live.html") bytes"

n=0
for u in $(grep -o "https://maxwelladvisory\.eu/[^'\"]*\.css[^'\"]*" "$CACHE/live.html" | sort -u); do
  path="${u#https://maxwelladvisory.eu/}"
  path="${path%%\?*}"
  mkdir -p "$CACHE/$(dirname "$path")"
  if curl -sL --max-time 45 "$u" -o "$CACHE/$path"; then n=$((n+1)); fi
done
echo "  stylesheets: $n"
echo "Mirror ready: $CACHE"
