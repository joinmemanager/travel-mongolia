import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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

export default nextConfig;
