'use client'

import { useEffect, useState } from 'react'
import { Analytics, type AnalyticsProps } from '@ecom/ui-seller'
import { DashboardLayout } from '../../components/dashboard-layout'
import { getMetricsBundle } from '@/features/integration/seller-page-api'
import { buildMetricsAnalyticsProps } from '@/features/integration/seller-page-adapters'

export default function MetricsPage() {
  const [props, setProps] = useState<AnalyticsProps>()

  useEffect(() => {
    const fetchData = async () => {
      const bundle = await getMetricsBundle()
      setProps(buildMetricsAnalyticsProps(bundle))
    }

    void fetchData()
  }, [])

  return (
    <DashboardLayout>
      {props ? (
        <Analytics {...props} />
      ) : (
        <p className="p-6 text-sm text-gray-500">Loading metrics...</p>
      )}
    </DashboardLayout>
  )
}
