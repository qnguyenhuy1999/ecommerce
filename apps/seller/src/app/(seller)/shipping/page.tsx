import { headers } from 'next/headers'
import { getShippingBundle } from '@/features/shipping/api'
import { mapShippingProviders } from '@/features/shipping/mappers'
import { ShippingPageClient } from './_components/ShippingPage.client'

export default async function ShippingPage() {
  const cookie = (await headers()).get('cookie')
  const init = { cache: 'no-store' as const, ...(cookie ? { headers: { cookie } } : {}) }
  const bundle = await getShippingBundle(init)
  const initialData = mapShippingProviders(bundle.providers, bundle.methods)
  return <ShippingPageClient initialData={initialData} />
}
