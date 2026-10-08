#!/usr/bin/env bash
# Нүүр хуудасны HeroFlight бичлэгийг эх файлуудаас (travel-mongolia/public/hero/flight-1/2/3.mp4,
# git-д ороогүй) дахин бэлдэнэ. Git Bash-аас: bash scripts/hero/build-hero-flight.sh
# ffmpeg PATH-д байх ёстой (эсвэл FFMPEG=/path/to/bin).
set -euo pipefail
BIN="${FFMPEG:-}"; FF="${BIN:+$BIN/}ffmpeg"
cd "$(dirname "$0")/../../travel-mongolia/public/hero"
TMP="$(mktemp -d)"

# 1. Нэгтгэх: 1280x720, 24fps, залгаас бүрт 0.3с crossfade, дуугүй.
#    flight-3-ын доод ирмэгт timecode бичиг байгаа тул ~2% тайрна.
#    offset = өмнөх хэсгүүдийн нийт урт - 0.3с (flight-1 6.583с, flight-2 6.042с).
N='scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,fps=24,format=yuv420p,setsar=1,settb=AVTB'
"$FF" -y -v error -i flight-1.mp4 -i flight-2.mp4 -i flight-3.mp4 -filter_complex \
  "[0:v]$N[a];[1:v]$N[b];[2:v]crop=1252:704:14:0,$N[c];[a][b]xfade=transition=fade:duration=0.3:offset=6.283333[ab];[ab][c]xfade=transition=fade:duration=0.3:offset=12.025,format=yuv420p[v]" \
  -map "[v]" -an -c:v libx264 -crf 12 -preset slow "$TMP/master.mp4"

# 2. Кадр бүр keyframe (-g 1): гүйлгэх үед currentTime-ийг аль ч кадр руу гацалтгүй үсрүүлнэ.
ENC='-an -c:v libx264 -preset veryslow -crf 29 -g 1 -keyint_min 1 -sc_threshold 0 -profile:v high -pix_fmt yuv420p -movflags +faststart'
"$FF" -y -v error -i "$TMP/master.mp4" $ENC hero-flight-720.mp4                                # компьютер, ≤8MB
"$FF" -y -v error -i "$TMP/master.mp4" -vf scale=854:480:flags=lanczos $ENC hero-flight-480.mp4 # утас, ≤4MB

# 3. Poster = эхний кадр (LCP)
"$FF" -y -v error -i "$TMP/master.mp4" -frames:v 1 -c:v libwebp -quality 80 -compression_level 6 hero-flight-poster-720.webp
"$FF" -y -v error -i "$TMP/master.mp4" -frames:v 1 -vf scale=854:480:flags=lanczos -c:v libwebp -quality 78 -compression_level 6 hero-flight-poster-480.webp

rm -rf "$TMP"
ls -la hero-flight-*
