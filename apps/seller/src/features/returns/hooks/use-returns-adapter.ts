'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { type ReturnsRefundsActionPayload } from '@ecom/ui-seller/pages/ReturnsRefunds'
import { getReturns, updateReturnStatus } from '../api'
import { mapReturnsToRows } from '../mappers'
import { returnKeys } from '../query-keys'

const RETURN_ACTION_STATUS_MAP: Record<ReturnsRefundsActionPayload['action'], string> = {
  approve: 'APPROVED',
  partial: 'APPROVED',
  reject: 'REJECTED',
}

export function useReturnsAdapter() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: returnKeys.list(),
    queryFn: async () => {
      const items = await getReturns()
      return mapReturnsToRows(items)
    },
  })

  const actionMutation = useMutation({
    mutationFn: (payload: ReturnsRefundsActionPayload) =>
      updateReturnStatus(payload.id, RETURN_ACTION_STATUS_MAP[payload.action]),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: returnKeys.all }),
  })

  return {
    loading: query.isPending,
    error: query.error,
    returns: query.data ?? [],
    onAction: (payload: ReturnsRefundsActionPayload) => actionMutation.mutateAsync(payload),
  }
}
