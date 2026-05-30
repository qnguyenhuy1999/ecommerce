'use client'

import { Inventory } from '@ecom/ui-seller/pages/Inventory'
import { useInventoryAdapter } from '@/features/inventory/hooks/use-inventory-adapter'

type InventoryPageClientProps = { initialData?: Parameters<typeof useInventoryAdapter>[0] }

export function InventoryPageClient({ initialData }: InventoryPageClientProps) {
  const { loading, inventory } = useInventoryAdapter(initialData)

  return <Inventory inventory={inventory} loading={loading} />
}
