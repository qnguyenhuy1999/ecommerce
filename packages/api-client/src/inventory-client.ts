import { getApiClient } from './client'

export interface LowStockVariant {
  variantId: string
  productId: string
  productName: string
  sku: string
  stock: number
  reservedStock: number
  availableStock: number
}

export interface InventoryReservation {
  id: string
  variantId: string
  orderId: string
  quantity: number
  status: string
  expiresAt: string
  createdAt: string
}

interface PaginatedData<T> {
  data: T[]
  page: number
  limit: number
  total: number
  totalPages: number
}

export const inventoryClient = {
  lowStock: async (params?: { threshold?: number; page?: number; limit?: number }) => {
    const { data } = await getApiClient().get<{ success: true; data: PaginatedData<LowStockVariant> }>(
      '/inventory/low-stock',
      { params },
    )
    return data.data
  },

  reservations: async (params?: { variantId?: string; orderId?: string; status?: string; page?: number; limit?: number }) => {
    const { data } = await getApiClient().get<{ success: true; data: PaginatedData<InventoryReservation> }>(
      '/inventory/reservations',
      { params },
    )
    return data.data
  },

  adjustStock: async (variantId: string, input: { delta: number; reason: string }) => {
    const { data } = await getApiClient().post<{ success: true; data: unknown }>(
      `/inventory/variants/${variantId}/adjust`,
      input,
    )
    return data.data
  },
}
