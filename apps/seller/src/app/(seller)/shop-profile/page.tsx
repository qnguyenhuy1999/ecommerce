import { headers } from 'next/headers'
import { getShopProfile } from '@/features/shop-profile/api'
import { mapShopToProfileForm } from '@/features/shop-profile/mappers'
import { ShopProfilePageClient } from './_components/ShopProfilePage.client'

export default async function ShopProfilePage() {
  const cookie = (await headers()).get('cookie')
  const init = { cache: 'no-store' as const, ...(cookie ? { headers: { cookie } } : {}) }
  const shop = await getShopProfile(init)
  const initialData = mapShopToProfileForm(shop)
  return <ShopProfilePageClient initialData={initialData} />
}
