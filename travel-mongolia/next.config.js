// Payload CMS (feat/payload): admin /admin, REST /api/<collection> (app/(payload)). withPayload нь Payload-ийн
// серверийн package-уудыг bundle-ээс гаргах г.м. тохиргоог нэмнэ.
const { withPayload } = require('@payloadcms/next/withPayload');

// R2-ийн public домэйн (Payload-ийн зураг, payload.config.ts). Тохируулаагүй бол нэмэхгүй.
const r2Host = (() => {
  try {
    return process.env.R2_PUBLIC_URL ? new URL(process.env.R2_PUBLIC_URL).hostname : null;
  } catch {
    return null;
  }
})();

const provinceAliases = require('./lib/provinceAliases.json');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Локал тулгалтад хоёр dev server зэрэг ажиллуулахад (scripts/payload/compare-urls.mjs). Анхдагч .next хэвээр.
  ...(process.env.NEXT_DIST_DIR ? { distDir: process.env.NEXT_DIST_DIR } : {}),
  // Vercel-ийн орчныг (production / preview) client компонентод ч хүргэнэ.
  // lib/navigation.ts-ийн isPreviewEnv() үүгээр draft/planned хуудас руу заасан холбоосыг нууна.
  env: {
    SITE_ENV: process.env.VERCEL_ENV || 'development',
    // Payload-ийн зургийн R2 public домэйн (lib/imageUrl.ts cdnImage), client компонентод ч хэрэгтэй
    MEDIA_URL: process.env.R2_PUBLIC_URL || '',
  },
  // ia-plan.md 5в: хуучин "Түүхүүд", "Фото/видео түүх" хаягууд Түүх & өв hub руу (lib/navigation.ts REDIRECTED_PATHS)
  async redirects() {
    return [
      { source: '/inspiration/stories', destination: '/stories', permanent: true },
      { source: '/inspiration/magazine', destination: '/stories', permanent: true },
      // Богино бичлэгийн хуучин хуудсууд → «Фото/видео түүх» хэсэг (lib/shorts.ts SHORTS_BASE)
      { source: '/stories/shorts', destination: '/stories/photo-video', permanent: true },
      { source: '/stories/shorts/:slug', destination: '/stories/photo-video/:slug', permanent: true },
      // Аймгийн нэрийн өөр бичлэгүүд (umnugovi, omnogovi г.м.) → сайтын slug, сумын хуудсуудтай нь.
      // Routing түвшинд: хуудас render, ISR, Contentful-аас хамааралгүй тогтвортой 308 (lib/provinceFacts.ts).
      // ASCII бус бичлэг (bayan-ölgii г.м.) хуудсан дахь redirect-ээр шилжинэ.
      ...Object.entries(provinceAliases).flatMap(([to, names]) =>
        names
          .filter((from) => /^[a-z0-9-]+$/.test(from))
          .flatMap((from) => [
            { source: `/province/${from}`, destination: `/province/${to}`, permanent: true },
            { source: `/province/${from}/:soum`, destination: `/province/${to}/:soum`, permanent: true },
          ])
      ),
    ];
  },
  // Hero бичлэг, poster, кадрууд: нэрэнд агуулгын hash байгаа тул (scripts/hero/build-hero-flight.sh)
  // хөтөч 1 жил дахин шалгалгүй кэшлэнэ
  async headers() {
    return [
      {
        source: '/hero/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      // Payload admin: индексжүүлэхгүй, өөр сайтад iframe-ээр оруулахгүй (clickjacking), referrer-т зам гаргахгүй
      ...['/admin', '/admin/:path*'].map((source) => ({
        source,
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'same-origin' },
        ],
      })),
    ];
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net', // Contentful-ээс ирэх зургууд
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Нүүр хуудсанд ашигласан байгалийн зураг
      },
      {
        protocol: 'https',
        hostname: 'd1f6qhhrbg3j8a.cloudfront.net', // joinme.mn-ийн байгууллагын зураг (localProvider.externalImages)
      },
      ...(r2Host ? [{ protocol: 'https', hostname: r2Host }] : []),
    ],
  },
};

module.exports = withPayload(nextConfig, { devBundleServerPackages: false });
