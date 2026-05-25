'use client'

import { useCallback } from 'react'
import { Bulk } from '@ecom/ui-seller'
import { DashboardLayout } from '../../components/dashboard-layout'
import { api } from '../../lib/api'

export default function BulkPage() {
  const handleExport = useCallback(async () => {
    await api('/bulk/export', {
      method: 'POST',
      body: JSON.stringify({ fileName: `products-export-${Date.now()}.csv` }),
    })
  }, [])

  const handleImport = useCallback(async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    await api('/bulk/import', { method: 'POST', body: formData })
  }, [])

  return (
    <DashboardLayout>
      <Bulk onExport={handleExport} onImport={handleImport} />
    </DashboardLayout>
  )
}
