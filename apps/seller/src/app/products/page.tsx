'use client'

import { useEffect, useState } from 'react'
import { Products, type ProductRow } from '@ecom/ui-seller'
import { getProductsList } from '@/features/integration/seller-page-api'
import { mapProductsToRows } from '@/features/integration/seller-page-adapters'
import { DashboardLayout } from '../../components/dashboard-layout'

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
    <DashboardLayout>
      <Products
        products={loading ? [] : products}
        newProductHref="/products/new"
        importHref="#import-products"
        exportHref="#export-products"
      />
    </DashboardLayout>
  )
}
