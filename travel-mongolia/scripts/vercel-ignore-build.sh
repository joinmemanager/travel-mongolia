#!/bin/bash
# Vercel «Ignored Build Step» (vercel.json ignoreCommand). exit 0 = build хийхгүй, exit 1 = build хийнэ.
# Build бүр (ялангуяа preview) Contentful руу хүсэлт илгээдэг тул (2026-10-21, 100K/сар хязгаар хэтэрсэн):
#  - Сайтын код (travel-mongolia/) өөрчлөгдөөгүй commit (docs/, scripts/ г.м.) → build хийхгүй.
#  - Preview: commit-ийн мессежид [preview] байвал эсвэл staging branch бол л build хийнэ.
#  - Production (main): сайтын код өөрчлөгдсөн бол үргэлж build хийнэ.

# Энэ branch-ийн сүүлийн амжилттай deploy-оос (VERCEL_GIT_PREVIOUS_SHA) хойш энэ хавтас (Vercel-ийн Root Directory)
# өөрчлөгдсөн эсэх. HEAD^-тэй харьцуулбал merge commit (эхний эцэг нь өөрчлөлтгүй байж болно) болон
# хоосон commit-ийн өмнөх өөрчлөлт алгасагддаг байв (2026-11-11, f5c9e57 / 9eeb145).
# Хувьсагч байхгүй, эсвэл тэр commit shallow clone-д олдохгүй бол аюулгүй тал руу: build хийнэ.
PREV="$VERCEL_GIT_PREVIOUS_SHA"
if [ -z "$PREV" ] || ! git cat-file -e "$PREV^{commit}" 2>/dev/null; then
  echo "Сүүлийн амжилттай deploy-ийн commit олдсонгүй (${PREV:-байхгүй}) — build хийнэ"
elif git diff --quiet "$PREV" HEAD -- .; then
  echo "travel-mongolia/ ${PREV:0:7}-оос хойш өөрчлөгдөөгүй — build алгасав"
  exit 0
else
  echo "travel-mongolia/ ${PREV:0:7}-оос хойш өөрчлөгдсөн"
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
