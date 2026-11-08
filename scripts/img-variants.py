"""The site's photos as WebP (quality 80), with smaller copies so a screen downloads only what it can show.

For every JPG in public/images (the -800 / -1400 copies skipped):
  - writes <name>.webp at its own size, from the best source there is: the photo as it was in git before the JPEGs
    were re-encoded (commit e697bb0) when that version exists, else the JPG on disk;
  - where the photo is at least 1200 px wide, writes <name>-800.webp and, when wider than 1600 px, <name>-1400.webp,
    and records its width in lib/img-sizes.json, which `srcSet()` (lib/img.ts) reads;
  - deletes the JPG and its JPG copies.
Run after adding photos (as JPGs):  ~/alam-elroum/docs/upscale/env/bin/python -I scripts/img-variants.py
"""
import io, json, os, re, subprocess, sys
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
PUB = os.path.join(ROOT, "public")
BEFORE = "e697bb0"          # the last commit with the photos as delivered, before the JPEG re-encode
COPY = re.compile(r"-(800|1400)\.(jpg|webp)$")
Q = dict(quality=80, method=5)
SIZES = os.path.join(ROOT, "lib", "img-sizes.json")
widths = json.load(open(SIZES)) if os.path.exists(SIZES) else {}
widths = {k.replace(".jpg", ".webp"): v for k, v in widths.items()}
before = after = n = 0

def source(p):
    rel = os.path.relpath(p, ROOT)
    r = subprocess.run(["git", "-C", ROOT, "show", f"{BEFORE}:{rel}"], capture_output=True)
    return Image.open(io.BytesIO(r.stdout)) if r.returncode == 0 else Image.open(p)

for d, _, files in os.walk(os.path.join(PUB, "images")):
    for f in sorted(files):
        if not f.lower().endswith(".jpg") or COPY.search(f): continue
        p = os.path.join(d, f); base = p[:-4]
        old = [p] + [base + f"-{v}.jpg" for v in (800, 1400) if os.path.exists(base + f"-{v}.jpg")]
        before += sum(os.path.getsize(x) for x in old)
        im = source(p).convert("RGB"); w, h = im.size
        im.save(base + ".webp", "WEBP", **Q); new = [base + ".webp"]
        key = "/" + os.path.relpath(base + ".webp", PUB).replace(os.sep, "/")
        if w >= 1200:
            for v in (800, 1400):
                if v == 1400 and w <= 1600: continue
                im.resize((v, round(h * v / w)), Image.LANCZOS).save(base + f"-{v}.webp", "WEBP", **Q); new.append(base + f"-{v}.webp")
            widths[key] = w
        else:
            widths.pop(key, None)
        after += sum(os.path.getsize(x) for x in new); n += 1
        for x in old: os.remove(x)

json.dump(dict(sorted(widths.items())), open(SIZES, "w"), indent=0)
print(f"{n} photos to WebP: {before / 1e6:.1f} MB → {after / 1e6:.1f} MB", file=sys.stderr)
