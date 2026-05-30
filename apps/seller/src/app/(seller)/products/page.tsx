import { headers } from 'next/headers'
import { getProductsList } from '@/features/products/api'
import { mapProductsToRows } from '@/features/products/mappers'
import { ProductsPageClient } from './_components/ProductsPage.client'

export default async function ProductsPage() {
  const cookie = (await headers()).get('cookie')
  const init = { cache: 'no-store' as const, ...(cookie ? { headers: { cookie } } : {}) }
  const { items } = await getProductsList({}, init)
  const initialData = mapProductsToRows(items)
  return <ProductsPageClient initialData={initialData} />
}
