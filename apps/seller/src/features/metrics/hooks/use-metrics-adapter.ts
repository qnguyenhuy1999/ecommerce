'use client'

import { useQuery } from '@tanstack/react-query'
import { getMetricsBundle } from '../api'
import { buildMetricsAnalyticsProps } from '../mappers'
import { metricsKeys } from '../query-keys'

export function useMetricsAdapter() {
  const query = useQuery({
    queryKey: metricsKeys.bundle(),
    queryFn: async () => {
      const bundle = await getMetricsBundle()
      return buildMetricsAnalyticsProps(bundle)
    },
  })

  return {
    loading: query.isPending,
    error: query.error,
    props: query.data,
  }
}
