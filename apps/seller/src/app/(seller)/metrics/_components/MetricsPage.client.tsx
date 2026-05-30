'use client'

import { Analytics } from '@ecom/ui-seller/pages/Analytics'
import { useMetricsAdapter } from '@/features/metrics/hooks/use-metrics-adapter'

type MetricsPageClientProps = { initialData?: Parameters<typeof useMetricsAdapter>[0] }

export function MetricsPageClient({ initialData }: MetricsPageClientProps) {
  const { props } = useMetricsAdapter(initialData)

  return props ? (
    <Analytics {...props} />
  ) : (
    <p className="p-6 text-sm text-gray-500">Loading metrics...</p>
  )
}
