'use client'

import { useCallback, useEffect, useState } from 'react'
import { Bulk, type BulkJobRow } from '@ecom/ui-seller'
import { createBulkExport, createBulkImport, getBulkJobs } from '@/features/bulk/api'

export default function BulkPage() {
  const [jobs, setJobs] = useState<BulkJobRow[]>([])
  const [loading, setLoading] = useState(true)

  const refreshJobs = useCallback(async () => {
    setJobs(await getBulkJobs())
  }, [])

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        await refreshJobs()
      } catch {
        setJobs([])
      } finally {
        setLoading(false)
      }
    }
    void fetch()
  }, [refreshJobs])

  const handleExport = useCallback(async () => {
    await createBulkExport(`products-export-${Date.now()}.csv`)
    await refreshJobs()
  }, [refreshJobs])

  const handleImport = useCallback(
    async (file: File) => {
      await createBulkImport(file)
      await refreshJobs()
    },
    [refreshJobs],
  )

  return <Bulk jobs={jobs} loading={loading} onExport={handleExport} onImport={handleImport} />
}
