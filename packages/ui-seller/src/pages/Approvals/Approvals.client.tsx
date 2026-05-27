'use client'

import { startTransition, useMemo, useState } from 'react'
import type { PaginationMeta } from '@ecom/shared/pagination/core'
import { SellerListPage } from '../../organisms/SellerListPage'
import { makeApprovalsColumns } from './Approvals.utils'
import { APPROVAL_STATUS_OPTIONS } from './Approvals.constants'
import type { ApprovalRow, ApprovalsProps } from './Approvals.types'

interface ApprovalsClientProps extends ApprovalsProps {
  approvals?: ApprovalRow[]
  loading?: boolean
  meta?: PaginationMeta
  onPageChange?: (page: number) => void
}

export function ApprovalsClient({
  approvals = [],
  loading = false,
  meta,
  onPageChange,
  onResubmit,
}: ApprovalsClientProps) {
  const [statusFilter, setStatusFilter] = useState('')
  const handleResubmit = onResubmit ?? (async () => {})
  const columns = useMemo(() => makeApprovalsColumns(handleResubmit), [handleResubmit])

  const filtered = statusFilter ? approvals.filter((a) => a.status === statusFilter) : approvals
  const tableProps = {
    ...(meta ? { meta } : {}),
    ...(onPageChange ? { onPageChange } : {}),
  }

  return (
    <SellerListPage title="Product Approvals" description="Track product approval status">
      <SellerListPage.Filters>
        <SellerListPage.StatusTabs
          tabs={APPROVAL_STATUS_OPTIONS.map((o) => o.value)}
          value={statusFilter}
          onChange={(v) => {
            startTransition(() => setStatusFilter(v))
          }}
          labels={Object.fromEntries(APPROVAL_STATUS_OPTIONS.map((o) => [o.value, o.label]))}
        />
      </SellerListPage.Filters>
      <SellerListPage.Table
        columns={columns}
        data={filtered}
        loading={loading}
        {...tableProps}
        emptyMessage="No approval requests found"
      />
    </SellerListPage>
  )
}
