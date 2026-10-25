"""Batch Real-ESRGAN x4plus on MPS: every PNG in IN_DIR → OUT_DIR, resized to WIDTH (Lanczos). Loads the model once."""
import sys, os, torch, numpy as np
from PIL import Image
from spandrel import ModelLoader
mp, src, dst, width = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4])
dev = torch.device("mps"); model = ModelLoader().load_from_file(mp).eval().to(dev)
T, PAD, S = 256, 16, 4
for name in sorted(f for f in os.listdir(src) if f.endswith(".png")):
    if os.path.exists(os.path.join(dst, name)): continue
    x = torch.from_numpy(np.asarray(Image.open(os.path.join(src, name)).convert("RGB"), dtype=np.float32) / 255).permute(2, 0, 1)[None]
    _, _, H, W = x.shape; out = torch.zeros(1, 3, H * S, W * S)
    with torch.no_grad():
        for y0 in range(0, H, T):
            for x0 in range(0, W, T):
                ya, xa, yb, xb = max(y0 - PAD, 0), max(x0 - PAD, 0), min(y0 + T + PAD, H), min(x0 + T + PAD, W)
                r = model(x[:, :, ya:yb, xa:xb].to(dev)).float().cpu()
                oy, ox, h, w = (y0 - ya) * S, (x0 - xa) * S, (min(y0 + T, H) - y0) * S, (min(x0 + T, W) - x0) * S
                out[:, :, y0 * S:y0 * S + h, x0 * S:x0 * S + w] = r[:, :, oy:oy + h, ox:ox + w]
    im = Image.fromarray((out[0].clamp(0, 1).permute(1, 2, 0).numpy() * 255 + 0.5).astype(np.uint8))
    im.resize((width, round(im.height * width / im.width)), Image.LANCZOS).save(os.path.join(dst, name))
    print(name, flush=True)
