'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProductDetail, type ProductDetailFormData } from '@ecom/ui-seller'
import type { ProductStatus } from '@ecom/contracts'
import { createProduct, getProductCategories } from '@/features/products/api'
import type { SellerCategory } from '@/features/products/mappers'
import { flattenCategories, mapProductFormToCreatePayload } from '@/features/products/mappers'

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
  )
}
