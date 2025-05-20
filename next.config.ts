import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'images.unsplash.com',
      'plus.unsplash.com',
      'cdn.hashnode.com',
      'res.cloudinary.com',
      'placehold.co',
    ],
  },
};

export default nextConfig;
