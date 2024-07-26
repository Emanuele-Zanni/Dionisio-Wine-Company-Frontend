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
};

export default nextConfig;
