'use client'

import { Analytics } from '@ecom/ui-seller/pages/Analytics'
import { useMetricsAdapter } from '@/features/metrics/hooks/use-metrics-adapter'

export default function MetricsPage() {
  const { props } = useMetricsAdapter()

  return props ? (
    <Analytics {...props} />
  ) : (
    <p className="p-6 text-sm text-gray-500">Loading metrics...</p>
  )
}
