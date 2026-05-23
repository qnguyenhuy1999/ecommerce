'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createCommissionRule,
  getCommissionRules,
  updateCommissionRule,
  type CreateCommissionRulePayload,
  type UpdateCommissionRulePayload,
} from '../api/commission-fees.api'
import { commissionFeeKeys } from '../query-keys'

export function useCommissionRules() {
  return useQuery({
    queryKey: commissionFeeKeys.lists(),
    queryFn: async () => (await getCommissionRules()).data,
  })
}

export function useCreateCommissionRule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateCommissionRulePayload) => createCommissionRule(payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: commissionFeeKeys.all })
    },
  })
}

export function useUpdateCommissionRule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCommissionRulePayload }) =>
      updateCommissionRule(id, payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: commissionFeeKeys.all })
    },
  })
}
