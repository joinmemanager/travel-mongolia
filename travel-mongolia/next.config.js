const provinceAliases = require('./lib/provinceAliases.json');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel-ийн орчныг (production / preview) client компонентод ч хүргэнэ.
  // lib/navigation.ts-ийн isPreviewEnv() үүгээр draft/planned хуудас руу заасан холбоосыг нууна.
  env: {
    SITE_ENV: process.env.VERCEL_ENV || 'development',
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
    ],
  },
};

module.exports = nextConfig;
