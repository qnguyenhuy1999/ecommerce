'use client'

import { Inventory } from '@ecom/ui-seller/pages/Inventory'
import { useInventoryAdapter } from '@/features/inventory/hooks/use-inventory-adapter'

export default function InventoryPage() {
  const { loading, inventory } = useInventoryAdapter()

  return <Inventory inventory={inventory} loading={loading} />
}
