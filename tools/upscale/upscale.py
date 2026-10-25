"""Real-ESRGAN x4plus upscale on Apple GPU (MPS), tiled. Usage: upscale.py MODEL IN OUT [target_long_side]
Upscales 4x, then resizes (Lanczos) so the long side equals target (default: keep 4x). Keeps alpha by upscaling it with Lanczos."""
import sys, torch, numpy as np
from PIL import Image
from spandrel import ModelLoader

model_path, src, dst = sys.argv[1], sys.argv[2], sys.argv[3]
target = int(sys.argv[4]) if len(sys.argv) > 4 else 0
dev = torch.device("mps" if torch.backends.mps.is_available() else "cpu")
model = ModelLoader().load_from_file(model_path).eval().to(dev)

im = Image.open(src); has_alpha = im.mode in ("RGBA", "LA") or "transparency" in im.info
rgba = im.convert("RGBA"); rgb = rgba.convert("RGB")
x = torch.from_numpy(np.asarray(rgb, dtype=np.float32) / 255).permute(2, 0, 1)[None]
_, _, H, W = x.shape; T, PAD, S = 256, 16, 4
out = torch.zeros(1, 3, H * S, W * S)
with torch.no_grad():
    for y0 in range(0, H, T):
        for x0 in range(0, W, T):
            ya, xa = max(y0 - PAD, 0), max(x0 - PAD, 0)
            yb, xb = min(y0 + T + PAD, H), min(x0 + T + PAD, W)
            r = model(x[:, :, ya:yb, xa:xb].to(dev)).float().cpu()
            oy, ox = (y0 - ya) * S, (x0 - xa) * S
            h, w = (min(y0 + T, H) - y0) * S, (min(x0 + T, W) - x0) * S
            out[:, :, y0 * S:y0 * S + h, x0 * S:x0 * S + w] = r[:, :, oy:oy + h, ox:ox + w]
up = Image.fromarray((out[0].clamp(0, 1).permute(1, 2, 0).numpy() * 255 + 0.5).astype(np.uint8))
if has_alpha:
    up.putalpha(rgba.getchannel("A").resize(up.size, Image.LANCZOS))
if target:
    k = target / max(up.size); up = up.resize((round(up.width * k), round(up.height * k)), Image.LANCZOS)
fmt = dst.rsplit(".", 1)[-1].lower()
kw = {"quality": 92} if fmt in ("jpg", "jpeg") else ({"quality": 90, "method": 6} if fmt == "webp" else {})
(up.convert("RGB") if fmt in ("jpg", "jpeg") else up).save(dst, **kw)
print(f"{src} {W}x{H} -> {up.width}x{up.height}")
