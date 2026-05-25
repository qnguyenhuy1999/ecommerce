'use client'

import { useCallback, useEffect, useState } from 'react'
import { Approvals, type ApprovalRow } from '@ecom/ui-seller'
import { DashboardLayout } from '../../components/dashboard-layout'
import { api } from '../../lib/api'

interface ApprovalsResponse {
  data: ApprovalRow[]
}

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<ApprovalRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const res = await api<ApprovalsResponse>('/approvals', { params: { limit: 50 } })
        setApprovals(res.data)
      } catch {
        /* empty */
      } finally {
        setLoading(false)
      }
    }
    void fetch()
  }, [])

  const handleResubmit = useCallback(async (approvalId: string) => {
    await api(`/approvals/${approvalId}/resubmit`, { method: 'POST' })
    setApprovals((prev) =>
      prev.map((a) => (a.id === approvalId ? { ...a, status: 'PENDING' } : a)),
    )
  }, [])

  return (
    <DashboardLayout>
      <Approvals approvals={approvals} loading={loading} onResubmit={handleResubmit} />
    </DashboardLayout>
  )
}
