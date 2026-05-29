'use client'

import { useEffect, useState } from 'react'
import { Analytics, type AnalyticsProps } from '@ecom/ui-seller'
import { getMetricsBundle } from '@/features/metrics/api'
import { buildMetricsAnalyticsProps } from '@/features/metrics/mappers'

export default function MetricsPage() {
  const [props, setProps] = useState<AnalyticsProps>()

  useEffect(() => {
    const fetchData = async () => {
      const bundle = await getMetricsBundle()
      setProps(buildMetricsAnalyticsProps(bundle))
    }

    void fetchData()
  }, [])

  return props ? (
    <Analytics {...props} />
  ) : (
    <p className="p-6 text-sm text-gray-500">Loading metrics...</p>
  )
}
