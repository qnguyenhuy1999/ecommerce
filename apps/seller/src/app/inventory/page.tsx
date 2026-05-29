'use client'

import { useEffect, useState } from 'react'
import { Inventory, type InventoryRow } from '@ecom/ui-seller'
import { getInventory } from '@/features/inventory/api'
import { mapInventoryToRows } from '@/features/inventory/mappers'
import { DashboardLayout } from '../../shared/components/dashboard-layout'

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
