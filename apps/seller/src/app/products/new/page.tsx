'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '../../../components/dashboard-layout'
import { ProductDetail, type ProductDetailFormData } from '@ecom/ui-seller'
import type { ProductStatus } from '@ecom/contracts'
import { createProduct, getProductCategories } from '@/features/integration/seller-page-api'
import type { SellerCategory } from '@/features/integration/seller-page-adapters'
import {
  flattenCategories,
  mapProductFormToCreatePayload,
} from '@/features/integration/seller-page-adapters'

export default function NewProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<SellerCategory[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await getProductCategories()
      setCategories(response)
    }

    void fetchData()
  }, [])

  const handlePersist = async (data: ProductDetailFormData, status: ProductStatus) => {
    const payload = mapProductFormToCreatePayload(data, categories, status)
    await createProduct(payload, status)
    router.push('/products')
  }

  return (
    <DashboardLayout>
      <ProductDetail
        title="New product"
        breadcrumb={[{ label: 'Products', href: '/products' }, { label: 'New' }]}
        previewHref="#"
        saveDraftHref="/products"
        publishHref="/products"
        categories={flattenCategories(categories).map((category) => category.name)}
        onSaveDraft={(data) => handlePersist(data, 'DRAFT')}
        onPublish={(data) => handlePersist(data, 'PUBLISHED')}
      />
    </DashboardLayout>
  )
}
