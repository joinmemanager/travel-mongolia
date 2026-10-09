#!/usr/bin/env bash
# Нүүр хуудасны HeroFlight бичлэгийг эх файлуудаас (travel-mongolia/public/hero/flight-1/2/3.mp4,
# git-д ороогүй) дахин бэлдэнэ. Git Bash-аас: bash scripts/hero/build-hero-flight.sh
# ffmpeg PATH-д байх ёстой (эсвэл FFMPEG=/path/to/bin). Сонголтын үндэслэл: docs/hero-quality/README.md
#
# Файлын нэрэнд агуулгын hash орно (hero-flight-light.<hash>.mp4, frames-<hash>/), тиймээс
# next.config.js нь /hero/*-ийг "immutable" (1 жил) кэшлэнэ. Нэрсийг lib/heroAssets.ts-д бичнэ.
set -euo pipefail
BIN="${FFMPEG:-}"; FF="${BIN:+$BIN/}ffmpeg"
cd "$(dirname "$0")/../../travel-mongolia/public/hero"
TMP="$(mktemp -d)"
OUT="$TMP/out"; mkdir -p "$OUT/frames"

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
"$FF" -y -v error -i "$TMP/master.mp4" -vf scale=854:480:flags=lanczos $ENC -crf 30 "$OUT/light.mp4" # хамгийн түрүүнд, 480p ≤2MB
"$FF" -y -v error -i "$TMP/master.mp4" $ENC -crf 19 "$OUT/desktop.mp4" # компьютер, 720p ≤15MB
"$FF" -y -v error -i "$TMP/master.mp4" $ENC -crf 26 "$OUT/mobile.mp4"  # утас, 720p ≤6MB

# 3. Poster = эхний кадр (LCP), ≤250KB
"$FF" -y -v error -i "$TMP/master.mp4" -frames:v 1 -c:v libwebp -quality 90 -compression_level 6 "$OUT/poster.webp"

# 4. Нөөц горимын кадрууд (iOS Low Power Mode г.м.): секундэд 12 кадр, 720p WebP, нийт ≤6MB
"$FF" -y -v error -i "$TMP/master.mp4" -vf fps=12 -c:v libwebp -quality 42 -compression_level 6 "$OUT/frames/%03d.webp"
FRAME_COUNT=$(ls "$OUT/frames" | wc -l)

# 5. Hash-тай нэрээр байрлуулж, хуучныг устгана
hash() { sha256sum "$1" | cut -c1-10; }
rm -rf hero-flight-*.mp4 hero-flight-*.webp frames frames-*
LIGHT="hero-flight-light.$(hash "$OUT/light.mp4").mp4"
DESKTOP="hero-flight-desktop.$(hash "$OUT/desktop.mp4").mp4"
MOBILE="hero-flight-mobile.$(hash "$OUT/mobile.mp4").mp4"
POSTER="hero-flight-poster.$(hash "$OUT/poster.webp").webp"
FRAMES="frames-$(cat "$OUT"/frames/*.webp | sha256sum | cut -c1-10)"
mv "$OUT/light.mp4" "$LIGHT"; mv "$OUT/desktop.mp4" "$DESKTOP"; mv "$OUT/mobile.mp4" "$MOBILE"
mv "$OUT/poster.webp" "$POSTER"; mv "$OUT/frames" "$FRAMES"

cat > ../../lib/heroAssets.ts <<EOF
// scripts/hero/build-hero-flight.sh үүсгэсэн, гараар засахгүй.
// Нэрэнд агуулгын hash байгаа тул /hero/* нь immutable кэштэй (next.config.js).
export const HERO_ASSETS = {
  light: '/hero/$LIGHT',
  desktop: '/hero/$DESKTOP',
  mobile: '/hero/$MOBILE',
  poster: '/hero/$POSTER',
  frames: '/hero/$FRAMES',
  frameCount: $FRAME_COUNT,
} as const;
EOF

rm -rf "$TMP"
ls -la hero-flight-*
echo "$FRAMES: $FRAME_COUNT файл, $(cat "$FRAMES"/*.webp | wc -c) байт"
