import { SellerListPage } from '../../organisms'
import { reviewsDefaultProps } from './Reviews.fixtures'
import { ReviewsClient } from './Reviews.client'
import type { ReviewsProps } from './Reviews.types'

export function Reviews({
  title = reviewsDefaultProps.title,
  description = reviewsDefaultProps.description,
  searchPlaceholder = reviewsDefaultProps.searchPlaceholder,
  approveLabel = reviewsDefaultProps.approveLabel,
  hideLabel = reviewsDefaultProps.hideLabel,
  rejectLabel = reviewsDefaultProps.rejectLabel,
  emptyMessage = reviewsDefaultProps.emptyMessage,
  statusTabs = reviewsDefaultProps.statusTabs,
  items = reviewsDefaultProps.items,
  onApprove = reviewsDefaultProps.onApprove,
  onHide = reviewsDefaultProps.onHide,
  onReject = reviewsDefaultProps.onReject,
}: ReviewsProps) {
  return (
    <SellerListPage
      title={title}
      description={description}
      breadcrumb={[{ label: 'Admin', href: '#' }, { label: 'Reviews' }]}
      mainClassName="space-y-5"
    >
      <ReviewsClient
        searchPlaceholder={searchPlaceholder ?? 'Search comment...'}
        approveLabel={approveLabel ?? 'Approve'}
        hideLabel={hideLabel ?? 'Hide'}
        rejectLabel={rejectLabel ?? 'Reject'}
        emptyMessage={emptyMessage ?? 'No reviews match current filters.'}
        statusTabs={statusTabs ?? []}
        items={items ?? []}
        onApprove={onApprove}
        onHide={onHide}
        onReject={onReject}
      />
    </SellerListPage>
  )
}
