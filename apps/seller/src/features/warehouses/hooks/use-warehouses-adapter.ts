'use client'

import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { getWarehouses } from '../api'
import { warehouseKeys } from '../query-keys'

export function useWarehousesAdapter(initialData?: Awaited<ReturnType<typeof getWarehouses>>) {
  const router = useRouter()

  const query = useQuery({
    queryKey: warehouseKeys.list(),
    queryFn: () => getWarehouses(),
    initialData,
  })

  return {
    loading: query.isPending,
    error: query.error,
    warehouses: query.data ?? [],
    onCreateClick: () => router.push('/warehouses/new'),
  }
}
