'use client'

import { Button, Input, Typography } from '@ecom/core-ui'
import { Plus } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { SellerListPage } from '../../organisms'
import type { CommissionFeesProps, CommissionRule } from './CommissionFees.types'

interface DraftValues {
  commissionPct: string
  paymentFeePct: string
}

export interface CommissionFeesClientProps {
  addRuleLabel: string
  sampleOrderAmount: number
  globalRate: CommissionRule
  categoryOverrides: CommissionRule[]
  vendorOverrides: CommissionRule[]
  onSave?: CommissionFeesProps['onSave']
  onAddRule?: CommissionFeesProps['onAddRule']
}

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

function NetPayoutPreview({
  amount,
  commissionPct,
  paymentFeePct,
}: {
  amount: number
  commissionPct: number
  paymentFeePct: number
}) {
  const sellerReceives = amount * (1 - commissionPct / 100 - paymentFeePct / 100)

  return (
    <div className="bg-card border-border rounded-2xl border p-5">
      <Typography variant="label" className="text-foreground mb-3 block font-semibold">
        Net payout preview
      </Typography>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-foreground">
          Sample order: <strong>${amount.toFixed(0)}</strong>
        </span>
        <span className="text-muted-foreground">-</span>
        <span className="text-muted-foreground">Commission ({commissionPct}%)</span>
        <span className="text-muted-foreground">-</span>
        <span className="text-muted-foreground">Payment fee ({paymentFeePct}%)</span>
        <span className="border-success/30 bg-success/10 text-success rounded-full border px-3 py-0.5 font-medium">
          = Seller receives ${sellerReceives.toFixed(2)}
        </span>
      </div>
    </div>
  )
}

function TableHeader() {
  return (
    <thead>
      <tr className="bg-muted/40 border-b">
        <th className="text-muted-foreground px-5 py-3 text-left text-xs font-medium tracking-wide uppercase">
          Rule
        </th>
        <th className="text-muted-foreground w-40 px-5 py-3 text-left text-xs font-medium tracking-wide uppercase">
          Commission %
        </th>
        <th className="text-muted-foreground w-36 px-5 py-3 text-left text-xs font-medium tracking-wide uppercase">
          Payment Fee %
        </th>
        <th className="text-muted-foreground px-5 py-3 text-left text-xs font-medium tracking-wide uppercase">
          Effective From
        </th>
        <th className="w-16" />
      </tr>
    </thead>
  )
}

function RuleRow({
  rule,
  draft,
  onCommissionChange,
  onPaymentFeeChange,
  onSave,
}: {
  rule: CommissionRule
  draft: DraftValues
  onCommissionChange: (id: string, value: string) => void
  onPaymentFeeChange: (id: string, value: string) => void
  onSave: (rule: CommissionRule, draft: DraftValues) => void
}) {
  return (
    <tr className="border-b last:border-0">
      <td className="px-5 py-3 align-middle">
        <Typography variant="body-sm" className="text-foreground">
          {rule.label}
        </Typography>
      </td>
      <td className="px-5 py-3 align-middle">
        <Input
          type="number"
          min={0}
          max={100}
          step={0.1}
          value={draft.commissionPct}
          onChange={(e) => onCommissionChange(rule.id, e.target.value)}
          className="h-8 w-20 text-sm"
        />
      </td>
      <td className="px-5 py-3 align-middle">
        <Input
          type="number"
          min={0}
          max={100}
          step={0.1}
          value={draft.paymentFeePct}
          onChange={(e) => onPaymentFeeChange(rule.id, e.target.value)}
          className="h-8 w-20 text-sm"
        />
      </td>
      <td className="px-5 py-3 align-middle">
        <Typography variant="body-sm" className="text-muted-foreground">
          {rule.effectiveFrom}
        </Typography>
      </td>
      <td className="px-5 py-3 text-right align-middle">
        <Button
          type="button"
          variant="ghost"
          onClick={() => onSave(rule, draft)}
          className="text-primary"
        >
          Save
        </Button>
      </td>
    </tr>
  )
}

function RuleSection({
  title,
  rules,
  drafts,
  onCommissionChange,
  onPaymentFeeChange,
  onSave,
}: {
  title: string
  rules: CommissionRule[]
  drafts: Map<string, DraftValues>
  onCommissionChange: (id: string, value: string) => void
  onPaymentFeeChange: (id: string, value: string) => void
  onSave: (rule: CommissionRule, draft: DraftValues) => void
}) {
  return (
    <div className="bg-card border-border overflow-hidden rounded-2xl border">
      <div className="px-5 py-4">
        <Typography variant="label" className="text-foreground font-semibold">
          {title}
        </Typography>
      </div>
      <table className="w-full border-t">
        <TableHeader />
        <tbody>
          {rules.map((rule) => {
            const draft = drafts.get(rule.id)
            if (!draft) return null
            return (
              <RuleRow
                key={rule.id}
                rule={rule}
                draft={draft}
                onCommissionChange={onCommissionChange}
                onPaymentFeeChange={onPaymentFeeChange}
                onSave={onSave}
              />
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export function CommissionFeesClient({
  addRuleLabel,
  sampleOrderAmount,
  globalRate,
  categoryOverrides,
  vendorOverrides,
  onSave,
  onAddRule,
}: CommissionFeesClientProps) {
  const [drafts, setDrafts] = useState<Map<string, DraftValues>>(() =>
    initDrafts(globalRate, categoryOverrides, vendorOverrides),
  )

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

  const sectionProps = useMemo(
    () => ({
      drafts,
      onCommissionChange: handleCommissionChange,
      onPaymentFeeChange: handlePaymentFeeChange,
      onSave: handleSave,
    }),
    [drafts, handleCommissionChange, handlePaymentFeeChange, handleSave],
  )

  return (
    <div className="space-y-5">
      <SellerListPage.Header>
        <div className="flex items-center justify-end">
          <SellerListPage.Actions>
            <Button type="button" onClick={() => void onAddRule?.()}>
              <Plus className="size-4" />
              {addRuleLabel}
            </Button>
          </SellerListPage.Actions>
        </div>
      </SellerListPage.Header>

      <NetPayoutPreview
        amount={sampleOrderAmount}
        commissionPct={previewCommission}
        paymentFeePct={previewPaymentFee}
      />

      <RuleSection title="Global rate" rules={[globalRate]} {...sectionProps} />

      <RuleSection title="Category overrides" rules={categoryOverrides} {...sectionProps} />

      <RuleSection title="Vendor overrides" rules={vendorOverrides} {...sectionProps} />
    </div>
  )
}
