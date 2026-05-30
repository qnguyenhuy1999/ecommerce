'use client'

import { Bulk } from '@ecom/ui-seller/pages/Bulk'
import { useBulkAdapter } from '@/features/bulk/hooks/use-bulk-adapter'

type BulkPageClientProps = { initialData?: Parameters<typeof useBulkAdapter>[0] }

export function BulkPageClient({ initialData }: BulkPageClientProps) {
  const { loading, jobs, onExport, onImport } = useBulkAdapter(initialData)

  return <Bulk jobs={jobs} loading={loading} onExport={onExport} onImport={onImport} />
}
