'use client'

import { Button } from '@ecom/core-ui/atoms/Button'
import { Typography } from '@ecom/core-ui/atoms/Typography'
import { Plus } from 'lucide-react'
import { SellerListPage } from '../../organisms'
import { COMMISSION_SECTION_TITLES } from './CommissionFees.constants'
import { useCommissionFeesController } from './CommissionFees.controller'
import type { CommissionFeesProps, CommissionRule } from './CommissionFees.types'
import { AddCommissionRuleModal } from './components/AddCommissionRuleModal'
import { RuleSection } from './components/RuleSection'

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

export interface CommissionFeesClientProps {
  addRuleLabel: string
  sampleOrderAmount: number
  globalRate: CommissionRule
  categoryOverrides: CommissionRule[]
  vendorOverrides: CommissionRule[]
  onSave?: CommissionFeesProps['onSave']
  onAddRule?: CommissionFeesProps['onAddRule']
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
  const { state, computed, handlers } = useCommissionFeesController({
    globalRate,
    categoryOverrides,
    vendorOverrides,
    onSave,
    onAddRule,
  })

  return (
    <div className="space-y-5">
      <SellerListPage.Header>
        <div className="flex items-center justify-end">
          <SellerListPage.Actions>
            <Button type="button" onClick={() => handlers.setModalOpen(true)}>
              <Plus className="size-4" />
              {addRuleLabel}
            </Button>
          </SellerListPage.Actions>
        </div>
      </SellerListPage.Header>

      <NetPayoutPreview
        amount={sampleOrderAmount}
        commissionPct={computed.previewCommission}
        paymentFeePct={computed.previewPaymentFee}
      />

      <RuleSection
        title={COMMISSION_SECTION_TITLES.global}
        rules={[globalRate]}
        {...computed.sectionProps}
      />

      <RuleSection
        title={COMMISSION_SECTION_TITLES.category}
        rules={categoryOverrides}
        {...computed.sectionProps}
      />

      <RuleSection
        title={COMMISSION_SECTION_TITLES.vendor}
        rules={vendorOverrides}
        {...computed.sectionProps}
      />

      <AddCommissionRuleModal
        open={state.modalOpen}
        sampleOrderAmount={sampleOrderAmount}
        onClose={() => handlers.setModalOpen(false)}
        onSubmit={handlers.handleAddRule}
      />
    </div>
  )
}
