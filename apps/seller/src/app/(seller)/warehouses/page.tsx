'use client'

import { Warehouses } from '@ecom/ui-seller/pages/Warehouses'
import { useWarehousesAdapter } from '@/features/warehouses/hooks/use-warehouses-adapter'

export default function WarehousesPage() {
  const { loading, warehouses, onCreateClick } = useWarehousesAdapter()

  return <Warehouses warehouses={warehouses} loading={loading} onCreateClick={onCreateClick} />
}
