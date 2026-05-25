export interface BulkJobRow {
  id: string
  type: string
  status: string
  fileName: string
  totalRows: number | null
  processedRows: number | null
  successRows: number | null
  errorRows: number | null
  createdAt: string
  completedAt: string | null
}

export interface BulkProps {
  onExport?: () => Promise<void>
  onImport?: (file: File) => Promise<void>
}
