'use client'

import { Approvals } from '@ecom/ui-seller'
import { useApprovalsAdapter } from '@/features/approvals/hooks/use-approvals-adapter'

export default function ApprovalsPage() {
  const { loading, approvals, onResubmit } = useApprovalsAdapter()

  return <Approvals approvals={approvals} loading={loading} onResubmit={onResubmit} />
}
