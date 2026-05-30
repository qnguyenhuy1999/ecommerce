import { headers } from 'next/headers'
import { getMetricsBundle } from '@/features/metrics/api'
import { buildMetricsAnalyticsProps } from '@/features/metrics/mappers'
import { MetricsPageClient } from './_components/MetricsPage.client'

export default async function MetricsPage() {
  const cookie = (await headers()).get('cookie')
  const init = { cache: 'no-store' as const, ...(cookie ? { headers: { cookie } } : {}) }
  const bundle = await getMetricsBundle(init)
  const initialData = buildMetricsAnalyticsProps(bundle)
  return <MetricsPageClient initialData={initialData} />
}
