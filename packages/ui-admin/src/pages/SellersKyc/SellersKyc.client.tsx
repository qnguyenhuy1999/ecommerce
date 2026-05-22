'use client'

import { useMemo, useState } from 'react'
import { SellerListPage } from '../../organisms'
import { buildSellersKycColumns } from './SellersKyc.columns'
import { buildSellerKycStatusCounts, filterSellerKycItems } from './SellersKyc.constants'
import type { SellerKycClientProps, SellerKycStatusTab } from './SellersKyc.types'

export function SellersKycClient({
  searchPlaceholder,
  reviewLabel,
  emptyMessage,
  statusTabs,
  items,
  onReview,
}: SellerKycClientProps) {
  const [search, setSearch] = useState('')
  const [activeStatus, setActiveStatus] = useState<SellerKycStatusTab>(
    statusTabs[0]?.value ?? 'ALL',
  )

  const counts = useMemo(() => buildSellerKycStatusCounts(items, statusTabs), [items, statusTabs])
  const statusLabels = useMemo(
    () =>
      Object.fromEntries(statusTabs.map((tab) => [tab.value, tab.label])) as Record<
        SellerKycStatusTab,
        string
      >,
    [statusTabs],
  )
  const filteredItems = useMemo(
    () => filterSellerKycItems(items, activeStatus, search),
    [activeStatus, items, search],
  )
  const columns = useMemo(
    () => buildSellersKycColumns(reviewLabel, onReview),
    [onReview, reviewLabel],
  )

  return (
    <SellerListPage.Header>
      <SellerListPage.Table
        columns={columns}
        data={filteredItems}
        emptyMessage={emptyMessage}
        className="[&_thead_tr]:bg-muted/45 [&_table]:min-w-[1100px] [&_tbody_td]:px-4 [&_tbody_td]:py-4 [&_thead_th]:h-[52px] [&_thead_th]:px-4"
        toolbar={
          <SellerListPage.Filters className="items-stretch gap-3 xl:flex-row xl:items-center">
            <SellerListPage.Search
              value={search}
              onChange={setSearch}
              placeholder={searchPlaceholder}
            />
            <SellerListPage.StatusTabs
              tabs={statusTabs.map((tab) => tab.value)}
              value={activeStatus}
              onChange={(tab) => setActiveStatus(tab as SellerKycStatusTab)}
              counts={counts}
              labels={statusLabels}
            />
          </SellerListPage.Filters>
        }
      />
    </SellerListPage.Header>
  )
}
