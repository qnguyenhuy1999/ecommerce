'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getApprovals, resubmitApproval } from '../api'
import { mapApprovalsToRows } from '../mappers'
import { approvalKeys } from '../query-keys'

export function useApprovalsAdapter() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: approvalKeys.list(),
    queryFn: async () => {
      const items = await getApprovals()
      return mapApprovalsToRows(items)
    },
  })

  const resubmitMutation = useMutation({
    mutationFn: (approvalId: string) => resubmitApproval(approvalId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: approvalKeys.all })
    },
  })

  return {
    loading: query.isPending,
    error: query.error,
    approvals: query.data ?? [],
    onResubmit: (approvalId: string) => resubmitMutation.mutateAsync(approvalId),
  }
}
