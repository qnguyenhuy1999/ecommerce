import { cache } from 'react'

import type {
  ProductListRequest,
  ProductResponse,
} from '@ecom/api-types'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

interface ProductListEnvelope {
  success: true
  data: ProductResponse[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

interface ProductDetailEnvelope {
  success: true
  data: ProductResponse
}

/**
 * Cache TTL for product reads. Short enough that price/stock updates surface
 * quickly across the marketplace, long enough to absorb the brunt of homepage
 * traffic without re-hitting the origin per request.
 */
const PRODUCT_REVALIDATE_SECONDS = 60

const PRODUCT_LIST_TAG = 'products:list'
const productDetailTag = (id: string) => `products:detail:${id}`

function buildProductListUrl(params: ProductListRequest): string {
  const url = new URL(`${API_URL}/api/v1/products`)
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue
    url.searchParams.set(key, String(value))
  }
  return url.toString()
}

/**
 * Server-side product list fetcher. Wraps `fetch` with Next.js's data cache
 * and a short revalidate window so multiple Server Components on the same
 * request only ever hit the origin once.
 *
 * Wrapping in `react.cache` additionally dedupes identical calls during a
 * single render pass — important when, for example, the home page hero and
 * a "featured" section both ask for the same product slice.
 */
const EMPTY_LIST: ProductListEnvelope = {
  success: true,
  data: [],
  meta: { total: 0, page: 1, limit: 0, totalPages: 0 },
}

export const fetchProducts = cache(
  async (params: ProductListRequest): Promise<ProductListEnvelope> => {
    try {
      const res = await fetch(buildProductListUrl(params), {
        next: {
          revalidate: PRODUCT_REVALIDATE_SECONDS,
          tags: [PRODUCT_LIST_TAG],
        },
      })
      if (!res.ok) {
        return EMPTY_LIST
      }
      return (await res.json()) as ProductListEnvelope
    } catch {
      // API unreachable (build-time prerender, network blip). Render an empty
      // collection so the page can still be produced; subsequent requests will
      // re-fetch via revalidate.
      return EMPTY_LIST
    }
  },
)

export const fetchProductById = cache(
  async (id: string): Promise<ProductResponse | null> => {
    try {
      const res = await fetch(`${API_URL}/api/v1/products/${id}`, {
        next: {
          revalidate: PRODUCT_REVALIDATE_SECONDS,
          tags: [PRODUCT_LIST_TAG, productDetailTag(id)],
        },
      })
      if (res.status === 404) return null
      if (!res.ok) return null
      const body = (await res.json()) as ProductDetailEnvelope
      return body.data
    } catch {
      return null
    }
  },
)

export const PRODUCT_CACHE_TAGS = {
  list: PRODUCT_LIST_TAG,
  detail: productDetailTag,
}
