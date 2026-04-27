import { getApiClient } from './client'

export interface PayoutReportRow {
  commissionId: string
  orderId: string
  sellerId: string
  storeName: string
  amount: number
  rate: number
  createdAt: string
}

export interface PayoutExportResponse {
  filename: string
  contentType: 'text/csv'
  content: string
  totalRows: number
  totalAmount: number
}

export const adminCommissionClient = {
  payoutReport: async (params?: { page?: number; limit?: number; sellerId?: string; from?: string; to?: string }) => {
    const { data } = await getApiClient().get<{
      success: true
      data: PayoutReportRow[]
      meta: { page: number; limit: number; total: number; totalPages: number }
    }>('/admin/commissions/payout-report', { params })
    return { data: data.data, meta: data.meta }
  },

  payoutExport: async (params?: { sellerId?: string; from?: string; to?: string }) => {
    const { data } = await getApiClient().get<{ success: true; data: PayoutExportResponse }>(
      '/admin/commissions/payout-export',
      { params },
    )
    return data.data
  },
}
