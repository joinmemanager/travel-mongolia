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
      // Нүүрний газрын зургийн (RegionMap) хуучин аймгийн хаягууд → Contentful-ийн slug (tic-migration.md)
      ...[
        ['bayan-olgii', 'bayan-ulgii'],
        ['govi-altai', 'gov-altai'],
        ['hovsgol', 'khuvsgul'],
        ['dundgovi', 'dundgov'],
        ['omnogovi', 'umnugov'],
        ['dornogovi', 'dornogov'],
        ['govisumber', 'govsumber'],
      ].map(([from, to]) => ({ source: `/province/${from}`, destination: `/province/${to}`, permanent: true })),
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
    ],
  },
};

module.exports = nextConfig;
