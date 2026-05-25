'use client'

import { useCallback } from 'react'
import { Approvals } from '@ecom/ui-seller'
import { DashboardLayout } from '../../components/dashboard-layout'
import { api } from '../../lib/api'

export default function ApprovalsPage() {
  const handleResubmit = useCallback(async (approvalId: string) => {
    await api(`/approvals/${approvalId}/resubmit`, { method: 'POST' })
  }, [])

  return (
    <DashboardLayout>
      <Approvals onResubmit={handleResubmit} />
    </DashboardLayout>
  )
}
