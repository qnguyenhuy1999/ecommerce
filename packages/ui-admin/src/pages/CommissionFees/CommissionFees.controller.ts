import { useCallback, useMemo, useState } from 'react'
import type { DraftValues } from './CommissionFees.client'
import type { CommissionFeesProps, CommissionRule, NewCommissionRule } from './CommissionFees.types'

function toDraft(rule: CommissionRule): DraftValues {
  return {
    commissionPct: String(rule.commissionPct),
    paymentFeePct: String(rule.paymentFeePct),
  }
}

function initDrafts(
  globalRate: CommissionRule,
  categoryOverrides: CommissionRule[],
  vendorOverrides: CommissionRule[],
): Map<string, DraftValues> {
  const map = new Map<string, DraftValues>()
  for (const rule of [globalRate, ...categoryOverrides, ...vendorOverrides]) {
    map.set(rule.id, toDraft(rule))
  }
  return map
}

export interface CommissionFeesControllerProps {
  globalRate: CommissionRule
  categoryOverrides: CommissionRule[]
  vendorOverrides: CommissionRule[]
  onSave?: CommissionFeesProps['onSave']
  onAddRule?: CommissionFeesProps['onAddRule']
}

export function useCommissionFeesController({
  globalRate,
  categoryOverrides,
  vendorOverrides,
  onSave,
  onAddRule,
}: CommissionFeesControllerProps) {
  const [drafts, setDrafts] = useState<Map<string, DraftValues>>(() =>
    initDrafts(globalRate, categoryOverrides, vendorOverrides),
  )
  const [modalOpen, setModalOpen] = useState(false)

  const globalDraft = drafts.get(globalRate.id) ?? toDraft(globalRate)
  const previewCommission = parseFloat(globalDraft.commissionPct) || 0
  const previewPaymentFee = parseFloat(globalDraft.paymentFeePct) || 0

  const handleCommissionChange = useCallback((id: string, value: string) => {
    setDrafts((prev) => {
      const next = new Map(prev)
      const existing = next.get(id)
      if (existing) next.set(id, { ...existing, commissionPct: value })
      return next
    })
  }, [])

  const handlePaymentFeeChange = useCallback((id: string, value: string) => {
    setDrafts((prev) => {
      const next = new Map(prev)
      const existing = next.get(id)
      if (existing) next.set(id, { ...existing, paymentFeePct: value })
      return next
    })
  }, [])

  const handleSave = useCallback(
    (rule: CommissionRule, draft: DraftValues) => {
      void onSave?.({
        ...rule,
        commissionPct: parseFloat(draft.commissionPct) || rule.commissionPct,
        paymentFeePct: parseFloat(draft.paymentFeePct) || rule.paymentFeePct,
      })
    },
    [onSave],
  )

  const handleAddRule = useCallback(
    (rule: NewCommissionRule) => {
      void onAddRule?.(rule)
    },
    [onAddRule],
  )

  const sectionProps = useMemo(
    () => ({
      drafts,
      onCommissionChange: handleCommissionChange,
      onPaymentFeeChange: handlePaymentFeeChange,
      onSave: handleSave,
    }),
    [drafts, handleCommissionChange, handlePaymentFeeChange, handleSave],
  )

  return {
    state: {
      drafts,
      modalOpen,
    },
    computed: {
      previewCommission,
      previewPaymentFee,
      sectionProps,
    },
    handlers: {
      handleCommissionChange,
      handlePaymentFeeChange,
      handleSave,
      handleAddRule,
      setModalOpen,
    },
  }
}
