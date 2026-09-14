"""Print the structural skeleton of a mirrored live page.
   python tools/outline.py for-companies
Shows the nested Elementor containers (with their element ids) and the widgets
inside them, so a page can be re-authored without reading raw HTML."""
import re, sys, html as H
slug = sys.argv[1]
raw = open(f'tools/live-cache/pages/{slug}.html', encoding='utf-8', errors='replace').read()
body = re.sub(r'<(style|script|noscript)[^>]*>.*?</\1>', '', raw, flags=re.S)
m = re.search(r'<div class="elementor elementor-\d+.*?(?=<footer|</body)', body, re.S)
seg = m.group(0) if m else body

# tokenise opening/closing divs so we can track depth
tokens = re.finditer(r'<div\b([^>]*)>|</div>', seg)
depth = 0
for t in tokens:
    if t.group(0) == '</div>':
        depth = max(0, depth - 1); continue
    attrs = t.group(1)
    cls = (re.search(r'class="([^"]*)"', attrs) or [None, ''])[1]
    did = (re.search(r'data-id="([0-9a-f]+)"', attrs) or [None, ''])[1]
    wt  = (re.search(r'data-widget_type="([a-z-]+)', attrs) or [None, ''])[1]
    pad = '  ' * depth
    if 'e-con' in cls and did:
        kind = 'PARENT' if 'e-parent' in cls else 'child'
        flex = 'row' if 'e-flex' in cls else ''
        print(f'{pad}<{kind} {did}> {flex}')
    elif wt and did:
        # text/img preview
        after = seg[t.end(): t.end() + 3000]
        txt = re.sub(r'<[^>]+>', ' ', after.split('</div>')[0] if wt != 'image' else '')
        txt = H.unescape(re.sub(r'\s+', ' ', txt)).strip()
        img = (re.search(r'<img[^>]*src="([^"]+)"', after) or [None, ''])[1].split('/')[-1]
        extra = f' img={img}' if img and wt == 'image' else ''
        print(f'{pad}  [{wt} {did}]{extra} {txt[:100]}')
    depth += 1
