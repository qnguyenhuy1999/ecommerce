'use client'

import { useEffect, useState } from 'react'
import { Analytics, type AnalyticsProps } from '@ecom/ui-seller'
import { DashboardLayout } from '../../shared/components/dashboard-layout'
import { getAnalyticsBundle } from '@/features/analytics/api'
import { buildAnalyticsProps, buildDateRangeParams } from '@/features/analytics/mappers'

export default function AnalyticsPage() {
  const [range, setRange] = useState('30d')
  const [props, setProps] = useState<AnalyticsProps>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const bundle = await getAnalyticsBundle(buildDateRangeParams(range))
        setProps(
          buildAnalyticsProps({
            range,
            revenue: bundle.revenue,
            orders: bundle.orders,
            topProducts: bundle.products,
            conversion: bundle.conversion,
          }),
        )
      } finally {
        setLoading(false)
      }
    }

    void fetchData()
  }, [range])

  return (
    <DashboardLayout>
      {loading && !props ? <p className="p-6 text-sm text-gray-500">Loading analytics...</p> : null}
      {props ? <Analytics {...props} onDateRangeChange={setRange} /> : null}
    </DashboardLayout>
  )
}
