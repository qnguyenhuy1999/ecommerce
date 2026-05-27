'use client'

import { useEffect, useState } from 'react'
import { Inventory, type InventoryRow } from '@ecom/ui-seller'
import { getInventory } from '@/features/integration/seller-page-api'
import { mapInventoryToRows } from '@/features/integration/seller-page-adapters'
import { DashboardLayout } from '../../components/dashboard-layout'

export default function InventoryPage() {
  const [rows, setRows] = useState<InventoryRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true)
      try {
        setRows(mapInventoryToRows(await getInventory()))
      } catch {
        setRows([])
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
