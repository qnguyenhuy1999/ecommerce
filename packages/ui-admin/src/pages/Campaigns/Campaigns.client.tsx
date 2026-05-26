'use client'

import { Button, Progress, Typography } from '@ecom/core-ui'
import { cn } from '@ecom/shared/utils'
import { Megaphone, Plus } from 'lucide-react'
import {
  VOUCHERS_EMPTY_MESSAGE,
  VOUCHER_STATUS_DOT_CLASS,
  VOUCHER_STATUS_LABEL_CLASS,
  VOUCHER_STATUS_TEXT,
} from './Campaigns.constants'
import { useVouchersController } from './Campaigns.controller'
import {
  voucherStatuses,
  type VoucherRecord,
  type VoucherStatus,
  type VouchersProps,
} from './Campaigns.types'

function StatusDot({ status }: { status: VoucherStatus }) {
  return (
    <span className={cn('inline-block size-2 rounded-full', VOUCHER_STATUS_DOT_CLASS[status])} />
  )
}

function StatusLabel({ status }: { status: VoucherStatus }) {
  return (
    <Typography variant="caption" className={cn('font-medium', VOUCHER_STATUS_LABEL_CLASS[status])}>
      {VOUCHER_STATUS_TEXT[status]}
    </Typography>
  )
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border flex flex-1 flex-col gap-0.5 rounded-lg border p-2">
      <Typography variant="caption" className="text-muted-foreground leading-none">
        {label}
      </Typography>
      <Typography variant="body-sm" className="leading-tight font-semibold">
        {value}
      </Typography>
    </div>
  )
}

function VoucherCard({
  item,
  budgetLabel,
  editLabel,
  performanceLabel,
  impressionsLabel,
  ctrLabel,
  redemptionsLabel,
  onEdit,
  onPerformance,
}: {
  item: VoucherRecord
  budgetLabel: string
  editLabel: string
  performanceLabel: string
  impressionsLabel: string
  ctrLabel: string
  redemptionsLabel: string
  onEdit?: VouchersProps['onEdit']
  onPerformance?: VouchersProps['onPerformance']
}) {
  return (
    <div className="bg-card border-border flex flex-col gap-4 rounded-xl border p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="bg-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
            <Megaphone className="text-primary-foreground size-5" />
          </div>
          <div className="min-w-0">
            <Typography variant="body-sm" className="leading-snug font-semibold">
              {item.name}
            </Typography>
            <Typography variant="caption" className="text-muted-foreground">
              {item.type} · {item.category}
            </Typography>
            <Typography variant="caption" className="text-muted-foreground mt-0.5 block">
              {item.dateRange}
            </Typography>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <StatusDot status={item.status} />
          <StatusLabel status={item.status} />
        </div>
      </div>

      <div className="flex gap-2">
        <StatBox label={impressionsLabel} value={item.impressions} />
        <StatBox label={ctrLabel} value={item.ctr} />
        <StatBox label={redemptionsLabel} value={item.redemptions} />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Typography variant="caption" className="text-muted-foreground">
            {budgetLabel}
          </Typography>
          <Typography variant="caption" className="text-muted-foreground">
            {item.budgetSpent} / {item.budgetTotal}
          </Typography>
        </div>
        <Progress value={item.budgetPercent} className="h-2" />
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => void onEdit?.(item)}
        >
          {editLabel}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => void onPerformance?.(item)}
        >
          {performanceLabel}
        </Button>
      </div>
    </div>
  )
}

export type { VoucherStatus, VoucherRecord }

interface VouchersClientProps {
  newVoucherLabel: string
  budgetLabel: string
  editLabel: string
  performanceLabel: string
  impressionsLabel: string
  ctrLabel: string
  redemptionsLabel: string
  tabLabels: NonNullable<VouchersProps['tabLabels']>
  items: VoucherRecord[]
  onNewVoucher?: VouchersProps['onNewVoucher']
  onEdit?: VouchersProps['onEdit']
  onPerformance?: VouchersProps['onPerformance']
}

export type { VouchersClientProps }

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
      <div className="border-border flex items-center justify-between border-b">
        <div className="flex">
          {voucherStatuses.map((status) => {
            const isActive = state.activeTab === status
            return (
              <button
                key={status}
                type="button"
                onClick={() => handlers.setActiveTab(status)}
                className={cn(
                  'relative -mb-px inline-flex items-center gap-1.5 px-4 pt-2 pb-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'border-primary text-foreground border-b-2'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {tabLabels[status] ?? status}
                <span
                  className={cn(
                    'inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs',
                    isActive
                      ? 'bg-primary-soft text-primary-deep'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  {computed.counts[status]}
                </span>
              </button>
            )
          })}
        </div>

        <Button type="button" onClick={() => void onNewVoucher?.()}>
          <Plus className="size-4" />
          {newVoucherLabel}
        </Button>
      </div>

      {computed.filtered.length === 0 ? (
        <div className="border-border text-muted-foreground flex min-h-48 items-center justify-center rounded-xl border border-dashed text-sm">
          {VOUCHERS_EMPTY_MESSAGE}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {computed.filtered.map((item) => (
            <VoucherCard
              key={item.id}
              item={item}
              budgetLabel={budgetLabel}
              editLabel={editLabel}
              performanceLabel={performanceLabel}
              impressionsLabel={impressionsLabel}
              ctrLabel={ctrLabel}
              redemptionsLabel={redemptionsLabel}
              onEdit={onEdit}
              onPerformance={onPerformance}
            />
          ))}
        </div>
      )}
    </div>
  )
}
