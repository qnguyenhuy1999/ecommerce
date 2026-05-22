import { Badge } from '@ecom/core-ui'
import { SellerListPage } from '../../organisms'
import { sellersKycDefaultProps } from './SellersKyc.fixtures'
import { SellersKycClient } from './SellersKyc.client'
import type { SellerKycProps } from './SellersKyc.types'

export function SellersKyc({
  title = sellersKycDefaultProps.title,
  description = sellersKycDefaultProps.description,
  awaitingReviewLabel = sellersKycDefaultProps.awaitingReviewLabel,
  searchPlaceholder = sellersKycDefaultProps.searchPlaceholder,
  reviewLabel = sellersKycDefaultProps.reviewLabel,
  emptyMessage = sellersKycDefaultProps.emptyMessage,
  statusTabs = sellersKycDefaultProps.statusTabs,
  items = sellersKycDefaultProps.items,
  onReview = sellersKycDefaultProps.onReview,
}: SellerKycProps) {
  return (
    <SellerListPage
      title={title}
      description={description}
      breadcrumb={[{ label: 'Admin', href: '#' }, { label: 'Sellers' }]}
      actions={
        awaitingReviewLabel ? (
          <Badge
            variant="ghost"
            className="bg-warning/10 text-warning rounded-full px-4 py-2 text-base font-semibold"
          >
            {awaitingReviewLabel}
          </Badge>
        ) : null
      }
      mainClassName="space-y-5"
    >
      <SellersKycClient
        searchPlaceholder={searchPlaceholder ?? 'Search vendor name...'}
        reviewLabel={reviewLabel ?? 'Review'}
        emptyMessage={emptyMessage ?? 'No sellers match current filters.'}
        statusTabs={statusTabs ?? []}
        items={items ?? []}
        onReview={onReview}
      />
    </SellerListPage>
  )
}
