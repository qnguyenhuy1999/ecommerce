import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: [
    '@ecom/api-client',
    '@ecom/auth',
    '@ecom/core-ui',
    '@ecom/ui-storefront',
    '@ecom/shared',
  ],
}

export default nextConfig
