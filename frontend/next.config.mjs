/**
 * @type {import('next').NextConfig}
 */
export const nextConfig = {
  images: {
    domains: ["dummyimage.com"], // Permite imágenes desde dummyimage.com
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
    AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
    AUTH0_SECRET: process.env.AUTH0_SECRET,
    AUTH0_BASE_URL: process.env.AUTH0_BASE_URL,
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

export const experimental = {
  appDir: true,
};
