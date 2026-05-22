import { ConsolePageLayout } from '@ecom/core-ui'
import { DisputeDetailClient } from './DisputeDetail.client'
import { disputeDetailDefaultProps } from './DisputeDetail.fixtures'
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
      <DisputeDetailClient item={item} onApplyResolution={onApplyResolution} />
    </ConsolePageLayout>
  )
}
