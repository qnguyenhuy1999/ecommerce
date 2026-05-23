'use client'

import type { ProductApprovalProps } from '@ecom/ui-admin'
import { PAGINATION_DEFAULTS } from '@ecom/shared/pagination/core'
import {
  useProducts,
  useProductStatusCounts,
  useBulkApproveProducts,
  useBulkRejectProducts,
} from '../hooks/use-products'
import {
  mapProductToApprovalItem,
  buildProductStatusTabs,
} from '../mappers/product-approval.mapper'

export function useProductApprovalAdapter(): ProductApprovalProps & {
  loading: boolean
  error: Error | null
} {
  const productsQuery = useProducts({
    page: 1,
    limit: PAGINATION_DEFAULTS.PAGE_SIZE,
  })
  const countsQuery = useProductStatusCounts()
  const bulkApprove = useBulkApproveProducts()
  const bulkReject = useBulkRejectProducts()

  const items = (productsQuery.data?.items ?? []).map(mapProductToApprovalItem)
  const statusTabs = buildProductStatusTabs(countsQuery.data ?? {})

  return {
    loading: productsQuery.isPending,
    error: productsQuery.error,
    items,
    statusTabs,
    onApprove: async (payload) => {
      await bulkApprove.mutateAsync(payload.ids)
    },
    onReject: async (payload) => {
      await bulkReject.mutateAsync(payload.ids)
    },
  }
}
