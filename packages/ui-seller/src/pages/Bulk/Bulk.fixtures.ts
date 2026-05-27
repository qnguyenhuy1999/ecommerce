import type { BulkProps } from './Bulk.types'

export const defaultProps = {} satisfies BulkProps

export const mockJobs = [
  {
    id: '1',
    type: 'PRODUCT_IMPORT',
    status: 'COMPLETED',
    fileName: 'products.csv',
    totalRows: 100,
    processedRows: 100,
    successRows: 98,
    errorRows: 2,
    createdAt: '2025-05-01T10:00:00Z',
    completedAt: '2025-05-01T10:05:00Z',
  },
  {
    id: '2',
    type: 'PRODUCT_EXPORT',
    status: 'PROCESSING',
    fileName: 'export.csv',
    totalRows: null,
    processedRows: null,
    successRows: null,
    errorRows: null,
    createdAt: '2025-05-02T09:00:00Z',
    completedAt: null,
  },
]
