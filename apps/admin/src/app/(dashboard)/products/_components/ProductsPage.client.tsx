'use client'

import { ProductApproval } from '@ecom/ui-admin/pages/ProductApproval'
import { useProductApprovalAdapter } from '@/features/products/hooks/use-product-approval-adapter'
import { stripAdapterMeta } from '@ecom/shared/utils/adapter-utils'

export function ProductsPageClient() {
  return <ProductApproval {...stripAdapterMeta(useProductApprovalAdapter())} />
}
