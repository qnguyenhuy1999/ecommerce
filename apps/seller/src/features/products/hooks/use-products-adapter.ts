'use client'

import { useQuery } from '@tanstack/react-query'
import { getProductsList } from '../api'
import { mapProductsToRows } from '../mappers'
import { productKeys } from '../query-keys'

export function useProductsAdapter() {
  const query = useQuery({
    queryKey: productKeys.list(),
    queryFn: async () => {
      const { items } = await getProductsList()
      return mapProductsToRows(items)
    },
  })

  return {
    loading: query.isPending,
    error: query.error,
    products: query.data ?? [],
  }
}
