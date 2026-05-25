'use client'

import { useCallback, useEffect, useState } from 'react'
import { Bulk, type BulkJobRow } from '@ecom/ui-seller'
import { DashboardLayout } from '../../components/dashboard-layout'
import { api } from '../../lib/api'

interface BulkJobsResponse {
  data: BulkJobRow[]
}

export default function BulkPage() {
  const [jobs, setJobs] = useState<BulkJobRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const res = await api<BulkJobsResponse>('/bulk/jobs', { params: { limit: 50 } })
        setJobs(res.data)
      } catch {
        /* empty */
      } finally {
        setLoading(false)
      }
    }
    void fetch()
  }, [])

  const handleExport = useCallback(async () => {
    await api('/bulk/export', {
      method: 'POST',
      body: JSON.stringify({ fileName: `products-export-${Date.now()}.csv` }),
    })
    const res = await api<BulkJobsResponse>('/bulk/jobs', { params: { limit: 50 } })
    setJobs(res.data)
  }, [])

  const handleImport = useCallback(async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    await api('/bulk/import', { method: 'POST', body: formData })
    const res = await api<BulkJobsResponse>('/bulk/jobs', { params: { limit: 50 } })
    setJobs(res.data)
  }, [])

  return (
    <DashboardLayout>
      <Bulk jobs={jobs} loading={loading} onExport={handleExport} onImport={handleImport} />
    </DashboardLayout>
  )
}
