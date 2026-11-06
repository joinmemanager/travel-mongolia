#!/usr/bin/env bash
# 10 зургийг Real-ESRGAN-аар (realesrgan-x4plus) 2× болгож туршина. Contentful-д юу ч байршуулахгүй.
#  - Анхны файл: backups/images-original/   (Contentful-ийн CDN-ээс татсан, өөрчлөхгүй)
#  - Шинэ файл:  tmp/images-enhanced/       (x4plus 4× → ffmpeg lanczos-оор 50% → нийт 2×, JPEG q2)
#  - Хугацаа:    tmp/images-enhanced/timings.csv
#   bash scripts/content/enhance-images.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
ESRGAN=/c/project/tools/realesrgan-ncnn-vulkan/realesrgan-ncnn-vulkan.exe
FFMPEG="$(ls -d "$LOCALAPPDATA"/Microsoft/WinGet/Packages/Gyan.FFmpeg*/ffmpeg-*/bin | head -1)/ffmpeg.exe"
ORIG="$ROOT/backups/images-original"
OUT="$ROOT/tmp/images-enhanced"
WORK="$OUT/_work"
mkdir -p "$ORIG" "$OUT" "$WORK"
IDS="aimag-photo-naadam aimag-photo-terelj aimag-photo-khuvsgul aimag-photo-khentii aimag-photo-khovd aimag-photo-selenge aimag-photo-sukhbaatar aimag-photo-uvs aimag-photo-zavkhan aimag-photo-dornogov"
echo "asset_id,файл,анхны_хэмжээ,шинэ_хэмжээ,анхны_KB,шинэ_KB,секунд" > "$OUT/timings.csv"
for id in $IDS; do
  url=$(grep -E "^$id," "$ROOT/docs/plan/images-audit.csv" | awk -F, '{print $NF}' | tr -d '\r')
  name="$id.jpg"
  [ -s "$ORIG/$name" ] || curl -sfL -o "$ORIG/$name" "$url"
  start=$(date +%s.%N)
  "$ESRGAN" -i "$ORIG/$name" -o "$WORK/$id-x4.png" -n realesrgan-x4plus -s 4 -f png >/dev/null 2>&1
  "$FFMPEG" -loglevel error -y -i "$WORK/$id-x4.png" -vf "scale=iw/2:ih/2:flags=lanczos" -q:v 2 "$OUT/$name"
  end=$(date +%s.%N)
  secs=$(awk "BEGIN{printf \"%.1f\", $end-$start}")
  dim() { "$FFMPEG" -hide_banner -i "$1" 2>&1 | grep -oE '[0-9]{2,5}x[0-9]{2,5}' | head -1; }
  kb() { echo $(( $(stat -c %s "$1") / 1024 )); }
  echo "$id,$name,$(dim "$ORIG/$name"),$(dim "$OUT/$name"),$(kb "$ORIG/$name"),$(kb "$OUT/$name"),$secs" | tee -a "$OUT/timings.csv"
  rm -f "$WORK/$id-x4.png"
done
rmdir "$WORK" 2>/dev/null || true
