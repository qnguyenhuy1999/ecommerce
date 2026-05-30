'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createBulkExport, createBulkImport, getBulkJobs } from '../api'
import { bulkKeys } from '../query-keys'

export function useBulkAdapter(initialData?: Awaited<ReturnType<typeof getBulkJobs>>) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: bulkKeys.jobs(),
    queryFn: () => getBulkJobs(),
    initialData,
  })

  const exportMutation = useMutation({
    mutationFn: (filename: string) => createBulkExport(filename),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: bulkKeys.all }),
  })

  const importMutation = useMutation({
    mutationFn: (file: File) => createBulkImport(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: bulkKeys.all }),
  })

  return {
    loading: query.isPending,
    error: query.error,
    jobs: query.data ?? [],
    onExport: () => exportMutation.mutateAsync(`products-export-${Date.now()}.csv`),
    onImport: (file: File) => importMutation.mutateAsync(file),
  }
}
