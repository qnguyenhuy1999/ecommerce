import { Progress } from '@ecom/core-ui/atoms/Progress'
import { Typography } from '@ecom/core-ui/atoms/Typography'
import { Megaphone } from 'lucide-react'
import type { VoucherRecord, VouchersProps } from '../Campaigns.types'
import { Actions } from './Actions'
import { StatBox } from './StatBox'
import { StatusDot } from './StatusDot'
import { StatusLabel } from './StatusLabel'

interface ItemProps {
  item: VoucherRecord
  budgetLabel: string
  editLabel: string
  performanceLabel: string
  impressionsLabel: string
  ctrLabel: string
  redemptionsLabel: string
  onEdit: VouchersProps['onEdit'] | undefined
  onPerformance: VouchersProps['onPerformance'] | undefined
}

export function Item({
  item,
  budgetLabel,
  editLabel,
  performanceLabel,
  impressionsLabel,
  ctrLabel,
  redemptionsLabel,
  onEdit,
  onPerformance,
}: ItemProps) {
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

      <Actions
        item={item}
        editLabel={editLabel}
        performanceLabel={performanceLabel}
        onEdit={onEdit}
        onPerformance={onPerformance}
      />
    </div>
  )
}
