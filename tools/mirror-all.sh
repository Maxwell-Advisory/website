#!/usr/bin/env bash
# Mirror every live page's HTML into tools/live-cache/pages/<slug>.html
# (stylesheets are shared and already mirrored by refresh-live-mirror.sh).
set -u
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"; OUT="$DIR/live-cache/pages"; mkdir -p "$OUT"
PATHS="/ /for-companies/ /for-investors/ /team/ /track-record/ /contact/ /legal-notice/ /privacy-policy/
/team/joe-davis/ /team/adrien-dormesson/
/sectors/renewables/ /sectors/storage/ /sectors/grids/ /sectors/green-gases/
/sectors/clean-transport/ /sectors/circular-economy/ /sectors/industrial-decarbonisation/"
for p in $PATHS; do
  slug=$(echo "$p" | sed 's|^/||; s|/$||; s|/|__|g'); [ -z "$slug" ] && slug=index
  code=$(curl -sL --max-time 45 -w "%{http_code}" "https://maxwelladvisory.eu$p" -o "$OUT/$slug.html")
  printf "  %-34s %s  %s bytes\n" "$p" "$code" "$(wc -c < "$OUT/$slug.html" 2>/dev/null || echo 0)"
done
