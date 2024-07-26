/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['http://dummyimage.com', 'dummyimage.com' ],
      remotePatterns: [
          {
              protocol: 'https',
              hostname: '**',
          },
      ],
  },
  env: {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_UPLOAD_PRESET: process.env.CLOUDINARY_UPLOAD_PRESET,
  },
};

export default nextConfig;
