'use client'

import { Analytics } from '@ecom/ui-seller/pages/Analytics'
import { useAnalyticsAdapter } from '@/features/analytics/hooks/use-analytics-adapter'

export default function AnalyticsPage() {
  const { loading, props, onDateRangeChange } = useAnalyticsAdapter()

  if (loading && !props) {
    return <p className="p-6 text-sm text-gray-500">Loading analytics...</p>
  }

  return props ? <Analytics {...props} onDateRangeChange={onDateRangeChange} /> : null
}
