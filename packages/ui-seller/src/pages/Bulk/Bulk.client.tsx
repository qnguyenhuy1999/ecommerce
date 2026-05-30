'use client'

import { useRef } from 'react'
import { Download, Upload } from 'lucide-react'
import { Button } from '@ecom/core-ui/atoms/Button'
import type { PaginationMeta } from '@ecom/shared/pagination/core/types'
import { SellerListPage } from '../../organisms/SellerListPage'
import { bulkColumns } from './Bulk.utils'
import type { BulkJobRow, BulkProps } from './Bulk.types'

interface BulkClientProps extends BulkProps {
  jobs?: BulkJobRow[]
  loading?: boolean
  meta?: PaginationMeta
  onPageChange?: (page: number) => void
}

export function BulkClient({
  jobs = [],
  loading = false,
  meta,
  onPageChange,
  onExport,
  onImport,
}: BulkClientProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const tableProps = {
    ...(meta ? { meta } : {}),
    ...(onPageChange ? { onPageChange } : {}),
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onImport) await onImport(file)
  }

  return (
    <SellerListPage
      title="Bulk Operations"
      description="Import and export products in bulk"
      actions={
        <SellerListPage.Actions>
          {onExport && (
            <Button variant="outline" size="sm" onClick={() => void onExport()}>
              <Download className="mr-2 h-4 w-4" />
              Export Products
            </Button>
          )}
          {onImport && (
            <>
              <Button size="sm" onClick={() => fileInputRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" />
                Import Products
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx"
                className="hidden"
                onChange={(e) => void handleFileChange(e)}
              />
            </>
          )}
        </SellerListPage.Actions>
      }
    >
      <SellerListPage.Table
        columns={bulkColumns}
        data={jobs}
        loading={loading}
        {...tableProps}
        emptyMessage="No bulk jobs yet"
      />
    </SellerListPage>
  )
}
