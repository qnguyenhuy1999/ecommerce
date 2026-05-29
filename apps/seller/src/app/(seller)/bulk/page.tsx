'use client'

import { Bulk } from '@ecom/ui-seller/pages/Bulk'
import { useBulkAdapter } from '@/features/bulk/hooks/use-bulk-adapter'

export default function BulkPage() {
  const { loading, jobs, onExport, onImport } = useBulkAdapter()

  return <Bulk jobs={jobs} loading={loading} onExport={onExport} onImport={onImport} />
}
