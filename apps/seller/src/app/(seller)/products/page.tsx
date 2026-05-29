'use client'

import { useEffect, useState } from 'react'
import { Products, type ProductRow } from '@ecom/ui-seller'
import { getProductsList } from '@/features/products/api'
import { mapProductsToRows } from '@/features/products/mappers'

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const { items } = await getProductsList()
        setProducts(mapProductsToRows(items))
      } catch {
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    void fetchProducts()
  }, [])

  return (
    <Products
      products={loading ? [] : products}
      newProductHref="/products/new"
      importHref="#import-products"
      exportHref="#export-products"
    />
  )
}
