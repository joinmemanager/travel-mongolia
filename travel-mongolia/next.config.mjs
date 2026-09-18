/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: 'C:/projects/teslatraders/travel-mongolia',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
