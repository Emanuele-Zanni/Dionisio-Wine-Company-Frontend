/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Permite cualquier subdominio de cualquier dominio
      },
    ],
  },
  env: {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_UPLOAD_PRESET: process.env.CLOUDINARY_UPLOAD_PRESET,
  },
  async rewrites() {
    return [
      {
        source: "/api-vinos/:path*",
        destination:
          "https://dionisio-wine-company-backend.onrender.com/:path*",
      },
    ];
  },
 
};

module.exports = nextConfig;