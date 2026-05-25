'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '../../components/dashboard-layout'
import { Products } from '@ecom/ui-seller'
import { api } from '../../lib/api'

type ProductsStatus = 'LIVE' | 'DRAFT' | 'OUT_OF_STOCK' | 'PENDING' | 'BLOCKED' | 'SCHEDULED'

interface ProductRow {
  id: string
  image: string
  name: string
  sku: string
  category: string
  status: ProductsStatus
  price: number
  stock: number
  sold: string
  rating: number
}

interface ApiProduct {
  id: string
  name: string
  baseSku: string | null
  basePrice: number | null
  baseStock: number
  status: string
  images: { url: string }[]
  category: { name: string } | null
  _count: { variants: number }
}

interface ApiProductsResponse {
  data?: {
    items?: ApiProduct[]
  }
}

const STATUS_MAP: Record<string, ProductsStatus> = {
  PUBLISHED: 'LIVE',
  DRAFT: 'DRAFT',
  ARCHIVED: 'OUT_OF_STOCK',
}

function toProductRow(p: ApiProduct): ProductRow {
  return {
    id: p.id,
    image: p.images[0]?.url ?? '',
    name: p.name,
    sku: p.baseSku ?? '',
    category: p.category?.name ?? '',
    status: STATUS_MAP[p.status] ?? 'DRAFT',
    price: p.basePrice ?? 0,
    stock: p.baseStock,
    sold: '—',
    rating: 0,
  }
}

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const res = await api<ApiProductsResponse>('/products', {
          params: { limit: 100 },
        })
        const items = res?.data?.items ?? []
        setProducts(items.map(toProductRow))
      } catch {
        /* empty */
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
