'use client'

import { Warehouses } from '@ecom/ui-seller/pages/Warehouses'
import { useWarehousesAdapter } from '@/features/warehouses/hooks/use-warehouses-adapter'

type WarehousesPageClientProps = { initialData?: Parameters<typeof useWarehousesAdapter>[0] }

export function WarehousesPageClient({ initialData }: WarehousesPageClientProps) {
  const { loading, warehouses, onCreateClick } = useWarehousesAdapter(initialData)

  return <Warehouses warehouses={warehouses} loading={loading} onCreateClick={onCreateClick} />
}
