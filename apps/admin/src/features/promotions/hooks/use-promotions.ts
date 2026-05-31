'use client'

import type { PaginatedResponse } from '@ecom/shared/pagination/core/types'
import type { UseQueryResult } from '@tanstack/react-query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CampaignListItem } from '../api/promotions.api'
import {
  createVoucher,
  getVoucher,
  getVouchers,
  getVoucherStatusCounts,
  updateVoucher,
} from '../api/promotions.api'

export function useVouchers(params: {
  page?: number
  limit?: number
  status?: string
  search?: string
}): UseQueryResult<PaginatedResponse<CampaignListItem>, Error> {
  return useQuery({
    queryKey: ['vouchers', params],
    queryFn: async () => {
      const res = await getVouchers(params)
      return res.data
    },
  })
}

export function useVoucher(id: string): UseQueryResult<CampaignListItem, Error> {
  return useQuery({
    queryKey: ['voucher', id],
    queryFn: async () => {
      const res = await getVoucher(id)
      return res.data
    },
    enabled: !!id,
  })
}

export function useVoucherStatusCounts(): UseQueryResult<Record<string, number>, Error> {
  return useQuery({
    queryKey: ['voucher-status-counts'],
    queryFn: async () => {
      const res = await getVoucherStatusCounts()
      return res.data
    },
  })
}

function useInvalidateVouchers() {
  const qc = useQueryClient()
  return () => {
    void qc.invalidateQueries({ queryKey: ['vouchers'] })
    void qc.invalidateQueries({ queryKey: ['voucher'] })
    void qc.invalidateQueries({ queryKey: ['voucher-status-counts'] })
  }
}

export function useCreateVoucher() {
  const invalidate = useInvalidateVouchers()
  return useMutation({ mutationFn: createVoucher, onSuccess: invalidate })
}

export function useUpdateVoucher() {
  const invalidate = useInvalidateVouchers()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      updateVoucher(id, data),
    onSuccess: invalidate,
  })
}
