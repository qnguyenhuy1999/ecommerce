'use client'

import { ProductDetail } from '@ecom/ui-seller'
import { useNewProductAdapter } from '@/features/products/hooks/use-new-product-adapter'

export default function NewProductPage() {
  const { loading, categories, onSaveDraft, onPublish } = useNewProductAdapter()

  return (
    <ProductDetail
      title="New product"
      breadcrumb={[{ label: 'Products', href: '/products' }, { label: 'New' }]}
      previewHref="#"
      saveDraftHref="/products"
      publishHref="/products"
      categories={categories}
      onSaveDraft={onSaveDraft}
      onPublish={onPublish}
    />
  )
}
