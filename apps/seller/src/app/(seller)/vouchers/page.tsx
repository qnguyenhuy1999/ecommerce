import { headers } from 'next/headers'
import { getVouchersBundle } from '@/features/vouchers/api'
import { mapCouponsToVoucherRows } from '@/features/vouchers/mappers'
import { VouchersPageClient } from './_components/VouchersPage.client'

export default async function VouchersPage() {
  const cookie = (await headers()).get('cookie')
  const init = { cache: 'no-store' as const, ...(cookie ? { headers: { cookie } } : {}) }
  const coupons = await getVouchersBundle(init)
  const initialData = mapCouponsToVoucherRows(coupons)
  return <VouchersPageClient initialData={initialData} />
}
