import { headers } from 'next/headers'
import { getWarehouses } from '@/features/warehouses/api'
import { WarehousesPageClient } from './_components/WarehousesPage.client'

export default async function WarehousesPage() {
  const cookie = (await headers()).get('cookie')
  const init = { cache: 'no-store' as const, ...(cookie ? { headers: { cookie } } : {}) }
  const initialData = await getWarehouses(init)
  return <WarehousesPageClient initialData={initialData} />
}
