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
