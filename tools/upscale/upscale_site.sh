#!/bin/zsh
# Upscale every low-res site image in place (Real-ESRGAN x4plus → long side min(4×, 2400)),
# then rebuild the two 720p videos at 1920×1080 frame by frame.
set -u
R="$1"; SITE="$2"; WORK="$3"
PY="$R/venv/bin/python"; M="$R/RealESRGAN_x4plus.pth"
cd "$SITE"
find public/images -type f \( -iname '*.jpg' -o -iname '*.png' -o -iname '*.webp' \) ! -path '*/destination/*' ! -path '*/experiences/*' ! -path '*/communities/*' ! -path '*/sustainability/*' ! -name 'qatari-diar.png' | while read f; do
  m=$(sips -g pixelWidth -g pixelHeight "$f" 2>/dev/null | awk '/pixelWidth/{w=$2}/pixelHeight/{h=$2}END{print (w>h?w:h)}')
  [ "$m" -ge 1600 ] && continue
  t=$(( m * 4 > 2400 ? 2400 : m * 4 ))
  ext="${f##*.}"; tmp="$WORK/img-tmp.$ext"
  "$PY" -I "$R/scripts/upscale.py" "$M" "$f" "$tmp" "$t" && mv "$tmp" "$f" && echo "IMG $f -> $t"
done
for v in footer-lagoon grandeur-skyfall-v2; do
  d="$WORK/vid-$v"; rm -rf "$d"; mkdir -p "$d/in" "$d/up"
  ffmpeg -v error -i "public/video/$v.mp4" "$d/in/f%04d.png"
  "$PY" -I "$R/scripts/upscale_dir.py" "$M" "$d/in" "$d/up" 1920 > "$d/log.txt" 2>&1
  ffmpeg -v error -y -framerate 24 -i "$d/up/f%04d.png" -vf "scale=1920:1080,format=yuv420p" -c:v libx264 -crf 19 -preset slow -movflags +faststart "$d/out.mp4" && mv "$d/out.mp4" "public/video/$v.mp4" && echo "VID $v -> 1920x1080"
done
for p in public/images/photo/grandeur-skyfall-v2-poster.jpg; do :; done
echo DONE
