'use client'

import { useVouchersController } from './Campaigns.controller'
import type { VoucherRecord, VoucherStatus, VouchersProps } from './Campaigns.types'
import { Empty } from './components/Empty'
import { Filters } from './components/Filters'
import { List } from './components/List'

export interface VouchersClientProps {
  newVoucherLabel: string
  budgetLabel: string
  editLabel: string
  performanceLabel: string
  impressionsLabel: string
  ctrLabel: string
  redemptionsLabel: string
  tabLabels: Partial<Record<VoucherStatus, string>>
  items: VoucherRecord[]
  onNewVoucher: VouchersProps['onNewVoucher'] | undefined
  onEdit: VouchersProps['onEdit'] | undefined
  onPerformance: VouchersProps['onPerformance'] | undefined
}

export function VouchersClient({
  newVoucherLabel,
  budgetLabel,
  editLabel,
  performanceLabel,
  impressionsLabel,
  ctrLabel,
  redemptionsLabel,
  tabLabels,
  items,
  onNewVoucher,
  onEdit,
  onPerformance,
}: VouchersClientProps) {
  const { state, computed, handlers } = useVouchersController({ items })

  return (
    <div className="space-y-6">
      <Filters
        activeTab={state.activeTab}
        counts={computed.counts}
        tabLabels={tabLabels}
        newVoucherLabel={newVoucherLabel}
        onTabChange={handlers.setActiveTab}
        onNewVoucher={computed.filtered.length > 0 ? onNewVoucher : undefined}
      />

      {computed.filtered.length === 0 ? (
        <Empty newVoucherLabel={newVoucherLabel} onNewVoucher={onNewVoucher} />
      ) : (
        <List
          items={computed.filtered}
          budgetLabel={budgetLabel}
          editLabel={editLabel}
          performanceLabel={performanceLabel}
          impressionsLabel={impressionsLabel}
          ctrLabel={ctrLabel}
          redemptionsLabel={redemptionsLabel}
          onEdit={onEdit}
          onPerformance={onPerformance}
        />
      )}
    </div>
  )
}
