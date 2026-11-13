#!/bin/sh
# Vercel build (vercel.json buildCommand). Payload-ийн DB байвал (DATABASE_URI) эхлээд migration, дараа нь next build.
# DATABASE_URI тохируулаагүй орчинд (Contentful горимд) migration-гүйгээр өмнөх шигээ build хийнэ.
set -e
if [ -n "$DATABASE_URI" ]; then
  echo "Payload migrate…"
  node scripts/payload/cli.mjs migrate
fi
exec next build
