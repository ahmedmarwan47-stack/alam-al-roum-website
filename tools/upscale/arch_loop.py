"""Build the seamless arch-at-sea loop from upscaled frames.
1) extend the sky: rows 0..200 (pure sky above the arch) are stretched to 420 px, so the arch sits clear of the cloud overlay;
2) loop: 60 output frames = source 13..72, with the last 13 crossfaded into source 0..12 (so frame 59 flows into frame 0)."""
import sys, os, numpy as np
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]
names = sorted(f for f in os.listdir(src) if f.endswith(".png")); N = len(names); X = 13; L = N - X
def load(i):
    im = Image.open(os.path.join(src, names[i])).convert("RGB"); w, h = im.size
    sky = im.crop((0, 0, w, 200)).resize((w, 420), Image.BICUBIC)
    out = Image.new("RGB", (w, h + 220)); out.paste(sky, (0, 0)); out.paste(im.crop((0, 200, w, h)), (0, 420))
    return np.asarray(out, dtype=np.float32)
os.makedirs(dst, exist_ok=True)
for i in range(L):
    a = load(i + X)
    if i >= L - X:
        w = (i - (L - X) + 1) / (X + 1); a = a * (1 - w) + load(i - (L - X)) * w
    Image.fromarray(np.clip(a + 0.5, 0, 255).astype(np.uint8)).save(os.path.join(dst, f"o{i:03d}.png"))
print("frames", L, "size", Image.open(os.path.join(dst, "o000.png")).size)
