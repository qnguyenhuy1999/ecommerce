'use client'

import type { CommissionFeesProps } from '@ecom/ui-admin'
import { useCommissionRules, useCreateCommissionRule, useUpdateCommissionRule } from './use-commission-fees'
import { mapApiRuleToCommissionRule } from '../mappers/commission-fees.mapper'

interface CommissionFeesAdapterResult {
  loading: boolean
  error: Error | null
  commissionFeesProps: CommissionFeesProps
}

export function useCommissionFeesAdapter(): CommissionFeesAdapterResult {
  const rulesQuery = useCommissionRules()
  const createMutation = useCreateCommissionRule()
  const updateMutation = useUpdateCommissionRule()

  const rules = rulesQuery.data ?? []
  const globalRule = rules.find((r) => r.scope === 'GLOBAL')
  const categoryRules = rules.filter((r) => r.scope === 'CATEGORY')
  const vendorRules = rules.filter((r) => r.scope === 'VENDOR')

  return {
    loading: rulesQuery.isPending,
    error: rulesQuery.error,
    commissionFeesProps: {
      ...(globalRule && { globalRate: mapApiRuleToCommissionRule(globalRule) }),
      categoryOverrides: categoryRules.map(mapApiRuleToCommissionRule),
      vendorOverrides: vendorRules.map(mapApiRuleToCommissionRule),
      onSave: async (rule) => {
        const originalRule = rules.find((r) => r.id === rule.id)
        await updateMutation.mutateAsync({
          id: rule.id,
          payload: {
            label: rule.label,
            commissionPct: rule.commissionPct,
            paymentFeePct: rule.paymentFeePct,
            effectiveFrom: originalRule?.effectiveFrom ?? rule.effectiveFrom,
          },
        })
      },
      onAddRule: async (newRule) => {
        await createMutation.mutateAsync({
          scope: newRule.scope.toUpperCase(),
          label: newRule.name ?? '',
          commissionPct: newRule.commissionPct,
          paymentFeePct: newRule.paymentFeePct,
          effectiveFrom: newRule.effectiveFrom,
        })
      },
    },
  }
}
