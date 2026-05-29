'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Analytics, type AnalyticsProps } from '@ecom/ui-seller'
import { getAnalyticsBundle } from '../api'
import { buildAnalyticsProps, buildDateRangeParams } from '../mappers'
import { analyticsKeys } from '../query-keys'

export function useAnalyticsAdapter() {
  const [range, setRange] = useState('30d')

  const query = useQuery({
    queryKey: analyticsKeys.bundle(range),
    queryFn: async () => {
      const bundle = await getAnalyticsBundle(buildDateRangeParams(range))
      return buildAnalyticsProps({
        range,
        revenue: bundle.revenue,
        orders: bundle.orders,
        topProducts: bundle.products,
        conversion: bundle.conversion,
      })
    },
  })

  return {
    loading: query.isPending,
    error: query.error,
    props: query.data as AnalyticsProps | undefined,
    onDateRangeChange: setRange,
  }
}
