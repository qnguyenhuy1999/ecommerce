import { ConsolePageLayout } from '@ecom/core-ui'
import { DisputesClient } from './Disputes.client'
import { disputesDefaultProps } from './Disputes.fixtures'
import type { DisputesProps } from './Disputes.types'

export function Disputes({
  title = disputesDefaultProps.title,
  description = disputesDefaultProps.description,
  searchPlaceholder = disputesDefaultProps.searchPlaceholder,
  openLabel = disputesDefaultProps.openLabel,
  summaryLabel = disputesDefaultProps.summaryLabel,
  filtersLabel = disputesDefaultProps.filtersLabel,
  emptyStateMessage = disputesDefaultProps.emptyStateMessage,
  detailTitle = disputesDefaultProps.detailTitle,
  priorityOptions = disputesDefaultProps.priorityOptions,
  statusOptions = disputesDefaultProps.statusOptions,
  queueOptions = disputesDefaultProps.queueOptions,
  resolutionOptions = disputesDefaultProps.resolutionOptions,
  items = disputesDefaultProps.items,
  onOpenCase = disputesDefaultProps.onOpenCase,
}: DisputesProps) {
  return (
    <ConsolePageLayout
      title={title}
      description={description}
      breadcrumb={[{ label: 'Admin', href: '#' }, { label: 'Disputes' }]}
      mainClassName="space-y-5"
    >
      <DisputesClient
        searchPlaceholder={searchPlaceholder ?? 'Search disputes'}
        openLabel={openLabel ?? 'Open'}
        summaryLabel={summaryLabel ?? 'cases'}
        filtersLabel={filtersLabel ?? 'Filters'}
        emptyStateMessage={emptyStateMessage ?? 'No disputes match current filters.'}
        detailTitle={detailTitle ?? 'Case detail'}
        priorityOptions={priorityOptions ?? []}
        statusOptions={statusOptions ?? []}
        queueOptions={queueOptions ?? []}
        resolutionOptions={resolutionOptions ?? []}
        items={items ?? []}
        onOpenCase={onOpenCase}
      />
    </ConsolePageLayout>
  )
}
