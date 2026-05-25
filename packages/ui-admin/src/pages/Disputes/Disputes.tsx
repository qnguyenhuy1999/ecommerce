import { SellerListPage } from '../../organisms'
import { RefundsClient } from './Disputes.client'
import { refundsDefaultProps } from './Disputes.fixtures'
import type { RefundsProps } from './Disputes.types'

export function Refunds({
  title = refundsDefaultProps.title,
  description = refundsDefaultProps.description,
  searchPlaceholder = refundsDefaultProps.searchPlaceholder,
  openLabel = refundsDefaultProps.openLabel,
  summaryLabel = refundsDefaultProps.summaryLabel,
  filtersLabel = refundsDefaultProps.filtersLabel,
  emptyStateMessage = refundsDefaultProps.emptyStateMessage,
  priorityOptions = refundsDefaultProps.priorityOptions,
  statusOptions = refundsDefaultProps.statusOptions,
  queueOptions = refundsDefaultProps.queueOptions,
  resolutionOptions = refundsDefaultProps.resolutionOptions,
  items = refundsDefaultProps.items,
  onOpenCase = refundsDefaultProps.onOpenCase,
}: RefundsProps) {
  return (
    <SellerListPage
      title={title}
      description={description}
      breadcrumb={[{ label: 'Admin', href: '#' }, { label: 'Disputes' }]}
      mainClassName="space-y-5"
    >
      <RefundsClient
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
