'use client'

import { SellerListPage } from '../../organisms'
import { useSellersKycController } from './SellersKyc.controller'
import type { SellerKycClientProps } from './SellersKyc.types'

export function SellersKycClient({
  searchPlaceholder,
  reviewLabel,
  emptyMessage,
  statusTabs,
  items,
  onReview,
}: SellerKycClientProps) {
  const { state, computed, handlers } = useSellersKycController({
    items,
    statusTabs,
    reviewLabel,
    onReview,
  })

  return (
    <SellerListPage.Header>
      <SellerListPage.Table
        columns={computed.columns}
        data={computed.filteredItems}
        emptyMessage={emptyMessage}
        className="[&_thead_tr]:bg-muted/45 [&_table]:min-w-[1100px] [&_tbody_td]:px-4 [&_tbody_td]:py-4 [&_thead_th]:h-[52px] [&_thead_th]:px-4"
        toolbar={
          <SellerListPage.Filters className="items-stretch gap-3 xl:flex-row xl:items-center">
            <SellerListPage.Search
              value={state.search}
              onChange={handlers.setSearch}
              placeholder={searchPlaceholder}
            />
            <SellerListPage.StatusTabs
              tabs={statusTabs.map((tab) => tab.value)}
              value={state.activeStatus}
              onChange={handlers.handleStatusChange}
              counts={computed.counts}
              labels={computed.statusLabels}
            />
          </SellerListPage.Filters>
        }
      />
    </SellerListPage.Header>
  )
}
