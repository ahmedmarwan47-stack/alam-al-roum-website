"""Smaller copies of the site's photos, so a screen downloads only what it can show.

For every JPG in public/images at least 1200 px wide (the copies themselves skipped):
  - re-encodes the original at its own size (quality 80, progressive) when that saves 15 % or more;
  - writes <name>-800.jpg and, where the original is wider than 1600 px, <name>-1400.jpg (quality 78);
  - records the original's width in lib/img-sizes.json, which `srcSet()` (lib/img.ts) reads.
Run again after adding or replacing photos:  ~/alam-elroum/docs/upscale/env/bin/python -I scripts/img-variants.py
"""
import io, json, os, re, sys
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
PUB = os.path.join(ROOT, "public")
VARIANT = re.compile(r"-(800|1400)\.jpg$")
widths, saved, made = {}, 0, 0

for d, _, files in os.walk(os.path.join(PUB, "images")):
    for f in sorted(files):
        if not f.lower().endswith(".jpg") or VARIANT.search(f): continue
        p = os.path.join(d, f)
        im = Image.open(p); w, h = im.size
        if w < 1200: continue
        rgb = im.convert("RGB")
        b = io.BytesIO(); rgb.save(b, "JPEG", quality=80, optimize=True, progressive=True)
        old = os.path.getsize(p)
        if len(b.getvalue()) < old * 0.85:
            open(p, "wb").write(b.getvalue()); saved += old - len(b.getvalue())
        for v in (800, 1400):
            if v == 1400 and w <= 1600: continue
            rgb.resize((v, round(h * v / w)), Image.LANCZOS).save(p[:-4] + f"-{v}.jpg", "JPEG", quality=78, optimize=True, progressive=True)
            made += 1
        widths["/" + os.path.relpath(p, PUB).replace(os.sep, "/")] = w

json.dump(dict(sorted(widths.items())), open(os.path.join(ROOT, "lib", "img-sizes.json"), "w"), indent=0)
print(f"{len(widths)} photos, {made} copies, {saved / 1e6:.1f} MB saved on the originals", file=sys.stderr)
