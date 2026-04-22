/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@ecom/ui',
    '@ecom/ui-admin',
    '@ecom/api-client',
    '@ecom/api-types',
    '@ecom/constants',
    '@ecom/shared',
  ],
};

module.exports = nextConfig;
