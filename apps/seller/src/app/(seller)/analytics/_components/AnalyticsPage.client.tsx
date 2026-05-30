'use client'

import { Analytics } from '@ecom/ui-seller/pages/Analytics'
import { useAnalyticsAdapter } from '@/features/analytics/hooks/use-analytics-adapter'

type AnalyticsPageClientProps = { initialData?: Parameters<typeof useAnalyticsAdapter>[0] }

export function AnalyticsPageClient({ initialData }: AnalyticsPageClientProps) {
  const { loading, props, onDateRangeChange } = useAnalyticsAdapter(initialData)

  if (loading && !props) {
    return <p className="p-6 text-sm text-gray-500">Loading analytics...</p>
  }

  return props ? <Analytics {...props} onDateRangeChange={onDateRangeChange} /> : null
}
