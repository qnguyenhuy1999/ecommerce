import { SellerListPage } from '../../organisms'
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
  priorityOptions = disputesDefaultProps.priorityOptions,
  statusOptions = disputesDefaultProps.statusOptions,
  queueOptions = disputesDefaultProps.queueOptions,
  resolutionOptions = disputesDefaultProps.resolutionOptions,
  items = disputesDefaultProps.items,
  onOpenCase = disputesDefaultProps.onOpenCase,
}: DisputesProps) {
  return (
    <SellerListPage
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
        priorityOptions={priorityOptions ?? []}
        statusOptions={statusOptions ?? []}
        queueOptions={queueOptions ?? []}
        resolutionOptions={resolutionOptions ?? []}
        items={items ?? []}
        onOpenCase={onOpenCase}
      />
    </SellerListPage>
  )
}
