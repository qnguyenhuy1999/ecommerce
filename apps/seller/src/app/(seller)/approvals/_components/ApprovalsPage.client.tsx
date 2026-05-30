'use client'

import { Approvals } from '@ecom/ui-seller/pages/Approvals'
import { useApprovalsAdapter } from '@/features/approvals/hooks/use-approvals-adapter'

type ApprovalsPageClientProps = { initialData?: Parameters<typeof useApprovalsAdapter>[0] }

export function ApprovalsPageClient({ initialData }: ApprovalsPageClientProps) {
  const { loading, approvals, onResubmit } = useApprovalsAdapter(initialData)

  return <Approvals approvals={approvals} loading={loading} onResubmit={onResubmit} />
}
