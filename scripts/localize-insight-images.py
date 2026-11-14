#!/usr/bin/env python3
"""Self-host article images (C-13). Same script as the English site.

For every Markdown image in src/content/insights/*.md that points at substackcdn.com (our own Substack
publication's images), download it once, save it as WebP (quality 72) no wider than 1600 px under
public/insights-img/<slug>/NN.webp, point the Markdown at the local file, and record width and height in
src/data/insight-images.json (the build step in astro.config.mjs prints them on the <img>).
Article text is not touched. Re-running is safe: images already local are skipped.
Needs Pillow. Usage: python3 scripts/localize-insight-images.py
"""
import glob, io, json, os, re, sys, urllib.request
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'src/content/insights')
PUB = os.path.join(ROOT, 'public/insights-img')
MANIFEST = os.path.join(ROOT, 'src/data/insight-images.json')
PAT = re.compile(r'(!\[[^\]]*\]\()(https://(?:substackcdn\.com|substack-post-media\.s3\.amazonaws\.com)/[^)\s]+)(\))')

sizes = json.load(open(MANIFEST)) if os.path.exists(MANIFEST) else {}
failed, done, before, after = [], 0, 0, 0
for f in sorted(glob.glob(os.path.join(SRC, '*.md'))):
    slug = os.path.basename(f)[:-3]
    text = open(f, encoding='utf8').read()
    n = len([p for p in sizes if p.startswith(f'/insights-img/{slug}/')])
    def repl(m):
        global n, done, before, after
        url = m.group(2)
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0', 'Accept': 'image/png,image/jpeg,image/*'})
            raw = urllib.request.urlopen(req, timeout=60).read()
            im = Image.open(io.BytesIO(raw))
            im = im.convert('RGBA' if im.mode in ('RGBA', 'LA', 'P') else 'RGB')
            if im.width > 1600: im = im.resize((1600, round(im.height * 1600 / im.width)), Image.LANCZOS)
            n += 1
            rel = f'/insights-img/{slug}/{n:02d}.webp'
            os.makedirs(os.path.join(PUB, slug), exist_ok=True)
            im.save(os.path.join(ROOT, 'public' + rel), 'WEBP', quality=72, method=6)
            sizes[rel] = [im.width, im.height]
            done += 1; before += len(raw); after += os.path.getsize(os.path.join(ROOT, 'public' + rel))
            return m.group(1) + rel + m.group(3)
        except Exception as e:
            failed.append((slug, url, str(e)))
            return m.group(0)
    new = PAT.sub(repl, text)
    if new != text: open(f, 'w', encoding='utf8').write(new)
json.dump(dict(sorted(sizes.items())), open(MANIFEST, 'w'), indent=1)
open(MANIFEST, 'a').write('\n')
print(f'localized {done} images, {before/1e6:.2f} MB downloaded -> {after/1e6:.2f} MB on disk; failed {len(failed)}')
for x in failed: print('FAILED', *x)
sys.exit(1 if failed else 0)
