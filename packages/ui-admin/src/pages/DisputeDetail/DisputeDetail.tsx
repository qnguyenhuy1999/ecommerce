import { ConsolePageLayout } from '@ecom/core-ui/layouts/ConsolePageLayout'
import { ResolutionPanelClient } from './DisputeDetail.client'
import { refundDetailDefaultProps } from './DisputeDetail.fixtures'
import { AuditTrailCard, ConversationEvidenceCard, OrderSummaryCard } from './DisputeDetail.server'
import type { RefundDetailProps } from './DisputeDetail.types'

export function RefundDetail({
  item = refundDetailDefaultProps.item,
  backHref = refundDetailDefaultProps.backHref,
  onApplyResolution = refundDetailDefaultProps.onApplyResolution,
}: RefundDetailProps) {
  if (!item) {
    return null
  }

  return (
    <ConsolePageLayout
      title={item.id}
      description={`${item.reason} · opened ${item.openedAtLabel}`}
      breadcrumb={[
        { label: 'Admin', href: '#' },
        backHref ? { label: 'Refunds', href: backHref } : { label: 'Refunds' },
        { label: item.id },
      ]}
      actions={
        <div className="flex items-center justify-end">
          <div className="rounded-full bg-sky-50 px-3 py-1">
            <span className="text-sm font-medium text-sky-600">{item.statusLabel}</span>
          </div>
        </div>
      }
      mainClassName="space-y-6"
    >
      <div className="space-y-6">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_32rem]">
          <OrderSummaryCard item={item} />
          <ConversationEvidenceCard item={item} />
          <ResolutionPanelClient item={item} onApplyResolution={onApplyResolution} />
        </div>
        <AuditTrailCard item={item} />
      </div>
    </ConsolePageLayout>
  )
}
