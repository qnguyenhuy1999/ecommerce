'use client'

import { useCallback, useEffect, useState } from 'react'
import { Approvals, type ApprovalRow } from '@ecom/ui-seller'
import { getApprovals, resubmitApproval } from '@/features/approvals/api'
import { mapApprovalsToRows } from '@/features/approvals/mappers'
import { DashboardLayout } from '../../shared/components/dashboard-layout'

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<ApprovalRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        setApprovals(mapApprovalsToRows(await getApprovals()))
      } catch {
        setApprovals([])
      } finally {
        setLoading(false)
      }
    }
    void fetch()
  }, [])

  const handleResubmit = useCallback(async (approvalId: string) => {
    await resubmitApproval(approvalId)
    setApprovals((prev) => prev.map((a) => (a.id === approvalId ? { ...a, status: 'PENDING' } : a)))
  }, [])

  return (
    <DashboardLayout>
      <Approvals approvals={approvals} loading={loading} onResubmit={handleResubmit} />
    </DashboardLayout>
  )
}
