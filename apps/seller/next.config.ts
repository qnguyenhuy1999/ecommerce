import type { NextConfig } from 'next'

const SELLER_BE_URL = process.env.SELLER_BE_INTERNAL_URL ?? 'http://localhost:4003'

const nextConfig: NextConfig = {
  transpilePackages: ['@ecom/core-ui', '@ecom/ui-seller', '@ecom/contracts', '@ecom/shared'],
  turbopack: {
    resolveAlias: {
      'tw-animate-css': './node_modules/tw-animate-css/dist/tw-animate.css',
      'shadcn/tailwind.css': './node_modules/shadcn/dist/tailwind.css',
    },
  },
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${SELLER_BE_URL}/:path*` }]
  },
}

export default nextConfig
