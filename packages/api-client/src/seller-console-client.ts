import type { ProductResponse } from '@ecom/api-types'

import { getApiClient } from './client'

export interface SellerConsoleResponse {
  seller: {
    id: string
    storeName: string
    storeDescription: string | null
    kycStatus: string
    commissionRate: number
    rating: number
    totalRatings: number
  }
  metrics: {
    products: number
    activeProducts: number
    pendingOrders: number
    revenue: number
    commission: number
    availableBalance: number
  }
  products: ProductResponse[]
  inventory: Array<{
    productId: string
    productName: string
    variantId: string
    sku: string
    attributes: Record<string, unknown>
    stock: number
    reservedStock: number
    availableStock: number
  }>
  ledger: Array<{
    id: string
    type: string
    amount: number
    referenceType: string | null
    referenceId: string | null
    description: string | null
    createdAt: string
  }>
}

export const sellerConsoleClient = {
  get: async (): Promise<SellerConsoleResponse> => {
    const { data } = await getApiClient().get<{ success: true; data: SellerConsoleResponse }>(
      '/sellers/me/console',
    )
    return data.data
  },
}
