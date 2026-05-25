'use client'

import { DashboardLayout } from '../../../components/dashboard-layout'
import { ProductDetail } from '@ecom/ui-seller'

export default function NewProductPage() {
  return (
    <DashboardLayout>
      <ProductDetail
        title="New product"
        breadcrumb={[{ label: 'Products', href: '/products' }, { label: 'New' }]}
        previewHref="#"
        saveDraftHref="#"
        publishHref="#"
      />
    </DashboardLayout>
  )
}
