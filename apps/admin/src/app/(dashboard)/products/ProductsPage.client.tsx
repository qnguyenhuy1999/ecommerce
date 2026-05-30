'use client'

import { ProductApproval } from '@ecom/ui-admin'
import { useProductApprovalAdapter } from '@/features/products/hooks/use-product-approval-adapter'
import { stripAdapterMeta } from '@ecom/shared'

export function ProductsPageClient() {
  return <ProductApproval {...stripAdapterMeta(useProductApprovalAdapter())} />
}
