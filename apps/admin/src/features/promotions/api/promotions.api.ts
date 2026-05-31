import { api } from '@/lib/api'
import type { PaginatedResponse } from '@ecom/shared/pagination/core/types'

export interface CampaignListItem {
  id: string
  code: string
  name: string
  type: string
  status: string
  discountValue: string
  maxDiscountAmount: string | null
  minOrderAmount: string | null
  usageLimit: number | null
  usedCount: number
  startsAt: string
  expiresAt: string
  createdAt: string
}

export async function getCampaigns(params: {
  page?: number
  limit?: number
  status?: string
  search?: string
}) {
  const query = new URLSearchParams()
  if (params.page) query.set('page', String(params.page))
  if (params.limit) query.set('limit', String(params.limit))
  if (params.status) query.set('status', params.status)
  if (params.search) query.set('search', params.search)
  return api<{ success: boolean; data: PaginatedResponse<CampaignListItem> }>(
    `/admin/promotions/vouchers?${query.toString()}`,
  )
}

export async function getCampaign(id: string) {
  return api<{ success: boolean; data: CampaignListItem }>(`/admin/promotions/vouchers/${id}`)
}

export async function getCampaignStatusCounts() {
  return api<{ success: boolean; data: Record<string, number> }>(
    '/admin/promotions/vouchers/status-counts',
  )
}

export async function createCampaign(data: Record<string, unknown>) {
  return api<{ success: boolean; data: CampaignListItem }>('/admin/promotions/vouchers', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateCampaign(id: string, data: Record<string, unknown>) {
  return api<{ success: boolean; data: CampaignListItem }>(`/admin/promotions/vouchers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export const getVouchers = getCampaigns
export const getVoucher = getCampaign
export const getVoucherStatusCounts = getCampaignStatusCounts
export const createVoucher = createCampaign
export const updateVoucher = updateCampaign
