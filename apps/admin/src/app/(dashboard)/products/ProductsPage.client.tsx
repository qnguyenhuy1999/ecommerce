'use client'

import { ProductApproval } from '@ecom/ui-admin'
import { useProductApprovalAdapter } from '@/features/products/hooks/use-product-approval-adapter'
import { stripAdapterMeta } from '@/lib/adapter-utils'

export function ProductsPageClient() {
  return <ProductApproval {...stripAdapterMeta(useProductApprovalAdapter())} />
}
