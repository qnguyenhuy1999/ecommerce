import { headers } from 'next/headers'
import { getAnalyticsBundle } from '@/features/analytics/api'
import { buildAnalyticsProps, buildDateRangeParams } from '@/features/analytics/mappers'
import { AnalyticsPageClient } from './_components/AnalyticsPage.client'

export default async function AnalyticsPage() {
  const cookie = (await headers()).get('cookie')
  const init = { cache: 'no-store' as const, ...(cookie ? { headers: { cookie } } : {}) }
  const bundle = await getAnalyticsBundle(buildDateRangeParams('30d'), init)
  const initialData = buildAnalyticsProps({
    range: '30d',
    revenue: bundle.revenue,
    orders: bundle.orders,
    topProducts: bundle.products,
    conversion: bundle.conversion,
  })
  return <AnalyticsPageClient initialData={initialData} />
}
