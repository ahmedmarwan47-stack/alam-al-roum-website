"""Animate the aerial shoreline still: only water moves (mask from colour: blue over red), with
small waves travelling toward the beach. Seamless: every wave completes whole cycles in L seconds.
Usage: shore_loop.py IN OUT_DIR WIDTH"""
import sys, os, math, torch, numpy as np
import torch.nn.functional as F
from PIL import Image
src, out, W = sys.argv[1], sys.argv[2], int(sys.argv[3])
dev = torch.device("mps")
im = Image.open(src).convert("RGB"); H = round(im.height * W / im.width); im = im.resize((W, H), Image.LANCZOS)
x = torch.from_numpy(np.asarray(im, dtype=np.float32) / 255).permute(2, 0, 1)[None].to(dev)
r, g, b = x[0, 0], x[0, 1], x[0, 2]
# water = blue/teal clearly above red; foam (bright, slightly blue) joins via the blur
m = ((b - r - 0.03) / 0.12).clamp(0, 1)
m = F.avg_pool2d(m[None, None], 31, stride=1, padding=15)[0, 0].clamp(0, 1)
m = F.avg_pool2d(m[None, None], 31, stride=1, padding=15)[0, 0]
# foam: bright pixels in a band just beyond the water edge; it washes in and out along the travel direction
near = F.max_pool2d(m[None, None], 121, stride=1, padding=60)[0, 0]
lum = (r + g + b) / 3
foam = (near * ((lum - 0.62) / 0.15).clamp(0, 1))
foam = F.avg_pool2d(foam[None, None], 21, stride=1, padding=10)[0, 0].clamp(0, 1)
m = torch.maximum(m, foam)
yy, xx = torch.meshgrid(torch.arange(H, device=dev, dtype=torch.float32), torch.arange(W, device=dev, dtype=torch.float32), indexing="ij")
s = W / 1512  # amplitudes and wavelengths are authored at 1512 px wide
u = (xx * 0.62 - yy * 0.78) / s  # distance along the wave travel direction (toward the sand, up-right)
v = (xx * 0.78 + yy * 0.62) / s
FPS, L = 25, 6.0; N = int(FPS * L)
os.makedirs(out, exist_ok=True)
for i in range(N):
    t = 2 * math.pi * i / N
    d_u = 2.2 * torch.sin(u / 26 - t) + 1.1 * torch.sin(u / 11 - 2 * t + v / 90) + 0.5 * torch.sin(v / 17 + 3 * t)
    d_v = 1.0 * torch.sin(v / 34 - t + u / 70) + 0.6 * torch.sin(u / 15 - 2 * t)
    d_u = d_u + foam * 4.0 * torch.sin(t + v / 260)  # the wash: foam slides toward and away from the sand
    dx = (d_u * 0.62 + d_v * 0.78) * s * m
    dy = (-d_u * 0.78 + d_v * 0.62) * s * m
    gx = (xx + dx) / (W - 1) * 2 - 1; gy = (yy + dy) / (H - 1) * 2 - 1
    f = F.grid_sample(x, torch.stack([gx, gy], -1)[None], mode="bilinear", padding_mode="reflection", align_corners=True)
    Image.fromarray((f[0].permute(1, 2, 0).clamp(0, 1).cpu().numpy() * 255 + 0.5).astype(np.uint8)).save(os.path.join(out, f"s{i:03d}.png"))
Image.fromarray((m.cpu().numpy() * 255).astype(np.uint8)).save(os.path.join(out, "mask.png"))
print("frames", N, W, H)
