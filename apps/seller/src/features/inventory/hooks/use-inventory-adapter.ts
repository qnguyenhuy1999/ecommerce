'use client'

import { useQuery } from '@tanstack/react-query'
import { getInventory } from '../api'
import { mapInventoryToRows } from '../mappers'
import { inventoryKeys } from '../query-keys'

export function useInventoryAdapter() {
  const query = useQuery({
    queryKey: inventoryKeys.list(),
    queryFn: async () => {
      const items = await getInventory()
      return mapInventoryToRows(items)
    },
  })

  return {
    loading: query.isPending,
    error: query.error,
    inventory: query.data ?? [],
  }
}
