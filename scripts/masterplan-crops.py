"""
Masterplan crops: cuts each page's view out of the one master masterplan image and writes lib/masterplan-crops.json.

Every masterplan on the site is a view of ONE master image (the full aerial):
  - Home and About show the whole master (no crop);
  - the Communities listing shows the built-up city ("communities");
  - each community page (/communities/<slug>) shows its own district (the crop named after its slug).
Boxes and pins share one coordinate space, "plan units": the master is 1512 x 839 plan units, whatever its pixel size
(the pins in lib/content.ts, lib/communities.ts and lib/masterplan.ts are in the same units). The site places pins
inside a crop from the box written to the JSON, so a box can move without touching any pin.

Swapping in a new master image:
  1. Save it over public/images/photo/masterplan-aerial.jpg (or pass --master <file>).
  2. Same framing as the current render (only sharper or larger)? Nothing else to change. A different framing?
     Edit the boxes in CROPS below, and the pin x / y values in lib/content.ts (Home), lib/communities.ts
     (community pins) and lib/masterplan.ts (About places, community amenities), all in plan units.
  3. Run, from the repo root:
       ~/alam-elroum/docs/upscale/env/bin/python -I scripts/masterplan-crops.py
     It writes public/images/masterplan/<name>.jpg and lib/masterplan-crops.json (paths carry a content hash, so
     browsers fetch the new files). Small crops are upscaled with Real-ESRGAN x4plus when torch + spandrel and the
     model are available (--model, default ~/alam-elroum/docs/upscale/models/RealESRGAN_x4plus.pth), else Lanczos.
     No AI generation: crops and upscales of the client's own render only.

Options: --master <file>  --model <RealESRGAN_x4plus.pth>  --edge <long edge px, default 2400>  --only <name,...>
"""
import argparse, hashlib, json, os, sys
import cv2
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PLAN_W, PLAN_H = 1512, 839

# name: (x, y, w, h) in plan units. Community crops keep the 1512:839 shape of the Home map; the listing view is wider
# (2.57:1) so the whole built-up city fits one screen under the section title.
CROPS = {
    "communities":      (90, 70, 1360, 530),   # the built-up city, west residential tip to the golf course; little desert and sea
    "beachfront":       (930, 130, 480, 266),  # the east shore: beach, clubhouse, lagoon canal
    "lagoon":           (420, 175, 500, 277),  # the swimmable lagoons around the big lagoon
    "marina-boulevard": (760, 250, 440, 244),  # the marina basin, lighthouse and the head of the boulevard
    "resort":           (380, 330, 480, 266),  # the lagoon island, resort hotel and the west beach
    "golf":             (1030, 90, 420, 233),  # the 18-hole course and its lakes
    "town-centre":      (660, 175, 440, 244),  # the commercial boulevard, from the expo centre down to the marina
}


def esrgan(model_path):
    """Returns an x4 upscaler (BGR uint8 -> BGR uint8), or None when torch / spandrel / the model are missing."""
    try:
        import torch
        from spandrel import ModelLoader
    except ImportError:
        return None
    if not os.path.exists(model_path):
        return None
    dev = torch.device("mps" if torch.backends.mps.is_available() else "cpu")
    model = ModelLoader().load_from_file(model_path).eval().to(dev)

    def run(bgr):
        x = torch.from_numpy(cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB).astype(np.float32) / 255).permute(2, 0, 1)[None]
        _, _, H, W = x.shape
        T, PAD, S = 256, 16, 4
        out = torch.zeros(1, 3, H * S, W * S)
        with torch.no_grad():
            for y0 in range(0, H, T):
                for x0 in range(0, W, T):
                    ya, xa, yb, xb = max(y0 - PAD, 0), max(x0 - PAD, 0), min(y0 + T + PAD, H), min(x0 + T + PAD, W)
                    r = model(x[:, :, ya:yb, xa:xb].to(dev)).float().cpu()
                    oy, ox = (y0 - ya) * S, (x0 - xa) * S
                    h, w = (min(y0 + T, H) - y0) * S, (min(x0 + T, W) - x0) * S
                    out[:, :, y0 * S:y0 * S + h, x0 * S:x0 * S + w] = r[:, :, oy:oy + h, ox:ox + w]
        rgb = (out[0].clamp(0, 1).permute(1, 2, 0).numpy() * 255 + 0.5).astype(np.uint8)
        return cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR)
    return run


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--master", default=os.path.join(ROOT, "public/images/photo/masterplan-aerial.jpg"))
    ap.add_argument("--model", default=os.path.expanduser("~/alam-elroum/docs/upscale/models/RealESRGAN_x4plus.pth"))
    ap.add_argument("--edge", type=int, default=2400)
    ap.add_argument("--only", default="")
    a = ap.parse_args()

    master = cv2.imread(a.master, cv2.IMREAD_COLOR)
    if master is None:
        sys.exit(f"cannot read {a.master}")
    H, W = master.shape[:2]
    sx, sy = W / PLAN_W, H / PLAN_H
    out_dir = os.path.join(ROOT, "public/images/masterplan")
    os.makedirs(out_dir, exist_ok=True)
    json_path = os.path.join(ROOT, "lib/masterplan-crops.json")
    prev = json.load(open(json_path)) if os.path.exists(json_path) else {"crops": {}}
    only = {n for n in a.only.split(",") if n}
    up = None

    rel_master = "/" + os.path.relpath(a.master, os.path.join(ROOT, "public")).replace(os.sep, "/")
    crops = {}
    for name, (x, y, w, h) in CROPS.items():
        if only and name not in only and name in prev["crops"]:
            crops[name] = {**prev["crops"][name]}
            continue
        px0, py0, px1, py1 = round(x * sx), round(y * sy), round((x + w) * sx), round((y + h) * sy)
        img = master[max(py0, 0):min(py1, H), max(px0, 0):min(px1, W)]
        long_edge = max(img.shape[:2])
        if long_edge < a.edge * 0.85:
            up = up or esrgan(a.model) or "lanczos"
            if up == "lanczos":
                print(f"  {name}: Real-ESRGAN unavailable, Lanczos upscale")
            else:
                img = up(img)
        k = a.edge / max(img.shape[:2])
        if abs(k - 1) > 0.01:
            img = cv2.resize(img, (round(img.shape[1] * k), round(img.shape[0] * k)),
                             interpolation=cv2.INTER_AREA if k < 1 else cv2.INTER_LANCZOS4)
        f = os.path.join(out_dir, f"{name}.jpg")
        cv2.imwrite(f, img, [cv2.IMWRITE_JPEG_QUALITY, 84, cv2.IMWRITE_JPEG_PROGRESSIVE, 1])
        v = hashlib.md5(open(f, "rb").read()).hexdigest()[:8]
        crops[name] = {"src": f"/images/masterplan/{name}.jpg?v={v}", "x": x, "y": y, "w": w, "h": h}
        print(f"{name}: plan {x},{y} {w}x{h} -> px {px1 - px0}x{py1 - py0} -> {img.shape[1]}x{img.shape[0]}")

    v = hashlib.md5(open(a.master, "rb").read()).hexdigest()[:8]
    data = {"_note": "Generated by scripts/masterplan-crops.py. Edit the boxes there and re-run; do not edit by hand.",
            "plan": {"w": PLAN_W, "h": PLAN_H}, "master": f"{rel_master}?v={v}", "crops": crops}
    with open(json_path, "w") as fh:
        json.dump(data, fh, indent=2)
        fh.write("\n")
    print("wrote", os.path.relpath(json_path, ROOT))


if __name__ == "__main__":
    main()
