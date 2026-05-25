'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '../../components/dashboard-layout'
import { Inventory } from '@ecom/ui-seller'
import { api } from '../../lib/api'
import type { InventoryRow } from '@ecom/ui-seller'

interface ApiInventoryItem {
  variantId: string
  productName: string
  sku: string | null
  stock: number
  reservedStock: number
  availableStock: number
  isLowStock: boolean
}

interface InventoryResponse {
  data: ApiInventoryItem[]
  meta: { page: number; limit: number; total: number; totalPages: number }
}

function toInventoryRow(item: ApiInventoryItem): InventoryRow {
  return {
    id: item.variantId,
    image: '',
    name: item.productName,
    category: '',
    sku: item.sku ?? '',
    onHand: item.stock,
    incoming: 0,
    reserved: item.reservedStock,
    available: item.availableStock,
    threshold: 10,
    status: item.isLowStock ? 'Low' : 'OK',
  }
}

export default function InventoryPage() {
  const [rows, setRows] = useState<InventoryRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true)
      try {
        const res = await api<{ data: InventoryResponse }>('/inventory', {
          params: { limit: 100 },
        })
        setRows(res.data.data.map(toInventoryRow))
      } catch {
        /* empty */
      } finally {
        setLoading(false)
      }
    }
    void fetchInventory()
  }, [])

  return (
    <DashboardLayout>
      <Inventory inventory={rows} loading={loading} />
    </DashboardLayout>
  )
}
