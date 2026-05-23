import { ConsolePageLayout } from '@ecom/core-ui'
import { ResolutionPanelClient } from './DisputeDetail.client'
import { disputeDetailDefaultProps } from './DisputeDetail.fixtures'
import { AuditTrailCard, ConversationEvidenceCard, OrderSummaryCard } from './DisputeDetail.server'
import type { DisputeDetailProps } from './DisputeDetail.types'

export function DisputeDetail({
  item = disputeDetailDefaultProps.item,
  backHref = disputeDetailDefaultProps.backHref,
  onApplyResolution = disputeDetailDefaultProps.onApplyResolution,
}: DisputeDetailProps) {
  if (!item) {
    return null
  }

  return (
    <ConsolePageLayout
      title={item.id}
      description={`${item.reason} · opened ${item.openedAtLabel}`}
      breadcrumb={[
        { label: 'Admin', href: '#' },
        backHref ? { label: 'Disputes', href: backHref } : { label: 'Disputes' },
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
