'use client'

import { Products } from '@ecom/ui-seller/pages/Products'
import { useProductsAdapter } from '@/features/products/hooks/use-products-adapter'

export default function ProductsPage() {
  const { loading, products } = useProductsAdapter()

  return (
    <Products
      products={loading ? [] : products}
      newProductHref="/products/new"
      importHref="#import-products"
      exportHref="#export-products"
    />
  )
}
