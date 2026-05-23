import { useCallback, useMemo, useState } from 'react'
import { buildSellersKycColumns } from './SellersKyc.columns'
import { buildSellerKycStatusCounts, filterSellerKycItems } from './SellersKyc.constants'
import type { SellerKycClientProps, SellerKycStatusTab } from './SellersKyc.types'

export function useSellersKycController({
  items,
  statusTabs,
  reviewLabel,
  onReview,
}: Pick<SellerKycClientProps, 'items' | 'statusTabs' | 'reviewLabel' | 'onReview'>) {
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

  const handleStatusChange = useCallback((tab: string) => {
    setActiveStatus(tab as SellerKycStatusTab)
  }, [])

  return {
    state: {
      search,
      activeStatus,
    },
    computed: {
      counts,
      statusLabels,
      filteredItems,
      columns,
    },
    handlers: {
      setSearch,
      handleStatusChange,
    },
  }
}
