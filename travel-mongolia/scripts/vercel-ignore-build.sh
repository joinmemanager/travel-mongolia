#!/bin/bash
# Vercel «Ignored Build Step» (vercel.json ignoreCommand). exit 0 = build хийхгүй, exit 1 = build хийнэ.
# Build бүр (ялангуяа preview) Contentful руу хүсэлт илгээдэг тул (2026-10-21, 100K/сар хязгаар хэтэрсэн):
#  - Сайтын код (travel-mongolia/) өөрчлөгдөөгүй commit (docs/, scripts/ г.м.) → build хийхгүй.
#  - Preview: commit-ийн мессежид [preview] байвал эсвэл staging branch бол л build хийнэ.
#  - Production (main): сайтын код өөрчлөгдсөн бол үргэлж build хийнэ.

# Өмнөх commit-оос хойш энэ хавтас (Vercel-ийн Root Directory) өөрчлөгдсөн эсэх.
# Shallow clone-д HEAD^ байхгүй бол аюулгүй тал руу: build хийнэ.
if git rev-parse --verify --quiet HEAD^ >/dev/null && git diff --quiet HEAD^ HEAD -- .; then
  echo "travel-mongolia/ өөрчлөгдөөгүй — build алгасав"
  exit 0
fi

if [ "$VERCEL_ENV" = "production" ]; then
  exit 1
fi

if [ "$VERCEL_GIT_COMMIT_REF" = "staging" ]; then
  exit 1
fi

case "$VERCEL_GIT_COMMIT_MESSAGE" in
  *"[preview]"*) exit 1 ;;
esac

echo "Preview build алгасав (commit мессежид [preview] нэмбэл build хийнэ)"
exit 0
