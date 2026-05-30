import { headers } from 'next/headers'
import { getInventory } from '@/features/inventory/api'
import { mapInventoryToRows } from '@/features/inventory/mappers'
import { InventoryPageClient } from './_components/InventoryPage.client'

export default async function InventoryPage() {
  const cookie = (await headers()).get('cookie')
  const init = { cache: 'no-store' as const, ...(cookie ? { headers: { cookie } } : {}) }
  const items = await getInventory(init)
  const initialData = mapInventoryToRows(items)
  return <InventoryPageClient initialData={initialData} />
}
