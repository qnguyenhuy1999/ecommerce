/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@ecom/ui',
    '@ecom/ui-storefront',
    '@ecom/api-client',
    '@ecom/api-types',
    '@ecom/constants',
    '@ecom/shared',
  ],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.yourplatform.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

module.exports = nextConfig;
