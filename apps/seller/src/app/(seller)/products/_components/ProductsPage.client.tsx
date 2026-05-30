'use client'

import { Products } from '@ecom/ui-seller/pages/Products'
import { useProductsAdapter } from '@/features/products/hooks/use-products-adapter'

type ProductsPageClientProps = { initialData?: Parameters<typeof useProductsAdapter>[0] }

export function ProductsPageClient({ initialData }: ProductsPageClientProps) {
  const { loading, products } = useProductsAdapter(initialData)

  return (
    <Products
      products={loading ? [] : products}
      newProductHref="/products/new"
      importHref="#import-products"
      exportHref="#export-products"
    />
  )
}
