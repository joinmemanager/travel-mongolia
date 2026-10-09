#!/usr/bin/env bash
# Нүүр хуудасны HeroFlight бичлэгийг эх файлуудаас (travel-mongolia/public/hero/flight-1/2/3.mp4,
# git-д ороогүй) дахин бэлдэнэ. Git Bash-аас: bash scripts/hero/build-hero-flight.sh
# ffmpeg PATH-д байх ёстой (эсвэл FFMPEG=/path/to/bin). Сонголтын үндэслэл: docs/hero-quality/README.md
set -euo pipefail
BIN="${FFMPEG:-}"; FF="${BIN:+$BIN/}ffmpeg"
cd "$(dirname "$0")/../../travel-mongolia/public/hero"
TMP="$(mktemp -d)"

# 1. Нэгтгэх: 1280x720 (эх файлууд 1280x720 ба 1344x768 тул томруулахгүй), 24fps, залгаас бүрт
#    0.3с crossfade, дуугүй. flight-3-ын доод ирмэгт timecode бичиг байгаа тул ~2% тайрна.
#    offset = өмнөх хэсгүүдийн нийт урт - 0.3с (flight-1 6.583с, flight-2 6.042с).
#    Дундын файл алдагдалгүй (-qp 0), ингэснээр давхар шахалтаас чанар буурахгүй.
N='scale=1280:720:force_original_aspect_ratio=increase:flags=lanczos,crop=1280:720,fps=24,format=yuv420p,setsar=1,settb=AVTB'
"$FF" -y -v error -i flight-1.mp4 -i flight-2.mp4 -i flight-3.mp4 -filter_complex \
  "[0:v]$N[a];[1:v]$N[b];[2:v]crop=1252:704:14:0,$N[c];[a][b]xfade=transition=fade:duration=0.3:offset=6.283333[ab];[ab][c]xfade=transition=fade:duration=0.3:offset=12.025,format=yuv420p[v]" \
  -map "[v]" -an -c:v libx264 -qp 0 -preset veryfast "$TMP/master.mp4"

# 2. 6 кадр тутамд keyframe: гүйлгэх үед currentTime-ийг аль ч кадр руу гацалтгүй үсрүүлнэ.
ENC='-an -c:v libx264 -preset veryslow -g 6 -keyint_min 6 -sc_threshold 0 -bf 2 -profile:v high -pix_fmt yuv420p -movflags +faststart'
"$FF" -y -v error -i "$TMP/master.mp4" $ENC -crf 19 hero-flight-desktop.mp4 # компьютер, ≤15MB
"$FF" -y -v error -i "$TMP/master.mp4" $ENC -crf 26 hero-flight-mobile.mp4  # утас, 720p ≤6MB

# 3. Poster = эхний кадр (LCP), ≤250KB
"$FF" -y -v error -i "$TMP/master.mp4" -frames:v 1 -c:v libwebp -quality 90 -compression_level 6 hero-flight-poster.webp

# 4. Нөөц горимын кадрууд (iOS Low Power Mode г.м.): секундэд 12 кадр, 720p WebP, нийт ≤6MB
rm -rf frames && mkdir frames
"$FF" -y -v error -i "$TMP/master.mp4" -vf fps=12 -c:v libwebp -quality 42 -compression_level 6 frames/%03d.webp

rm -rf "$TMP"
ls -la hero-flight-*
echo "frames: $(ls frames | wc -l) файл, $(du -sh frames | cut -f1)"
