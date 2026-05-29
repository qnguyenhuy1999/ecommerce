'use client'

import { useQuery } from '@tanstack/react-query'
import { getFinanceBundle } from '../api'
import { buildFinanceProps } from '../mappers'
import { financeKeys } from '../query-keys'

export function useFinanceAdapter() {
  const query = useQuery({
    queryKey: financeKeys.bundle(),
    queryFn: async () => {
      const bundle = await getFinanceBundle()
      return buildFinanceProps(bundle)
    },
  })

  return {
    loading: query.isPending,
    error: query.error,
    props: query.data,
  }
}
