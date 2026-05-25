'use client'

import { useMemo } from 'react'
import { SellerListPage } from '../../organisms'
import { buildReviewColumns } from './Reviews.columns'
import { useReviewsController } from './Reviews.controller'
import type { ReviewRecord, ReviewsProps } from './Reviews.types'

interface ReviewsClientProps {
  searchPlaceholder: string
  approveLabel: string
  hideLabel: string
  rejectLabel: string
  emptyMessage: string
  statusTabs: NonNullable<ReviewsProps['statusTabs']>
  items: ReviewRecord[]
  onApprove?: ReviewsProps['onApprove']
  onHide?: ReviewsProps['onHide']
  onReject?: ReviewsProps['onReject']
}

export function ReviewsClient({
  searchPlaceholder,
  approveLabel,
  hideLabel,
  rejectLabel,
  emptyMessage,
  statusTabs,
  items,
  onApprove,
  onHide,
  onReject,
}: ReviewsClientProps) {
  const controller = useReviewsController({ items, statusTabs, onApprove, onHide, onReject })

  const columns = useMemo(
    () =>
      buildReviewColumns({
        approveLabel,
        hideLabel,
        rejectLabel,
        onApprove: controller.handleApprove,
        onHide: controller.handleHide,
        onReject: controller.handleReject,
      }),
    [approveLabel, hideLabel, rejectLabel, controller.handleApprove, controller.handleHide, controller.handleReject],
  )

  return (
    <SellerListPage.Header>
      <SellerListPage.StatusTabs
        tabs={controller.statusTabOrder}
        value={controller.state.activeTab}
        onChange={(tab) => controller.setActiveTab(tab as ReviewsClientProps['statusTabs'][number]['value'])}
        counts={controller.counts}
      />

      <SellerListPage.Table
        columns={columns}
        data={controller.filteredItems}
        emptyMessage={emptyMessage}
        toolbar={
          <SellerListPage.Filters>
            <SellerListPage.Search
              value={controller.state.search}
              onChange={controller.setSearch}
              placeholder={searchPlaceholder}
            />
          </SellerListPage.Filters>
        }
      />
    </SellerListPage.Header>
  )
}
