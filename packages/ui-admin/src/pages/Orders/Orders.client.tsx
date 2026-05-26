'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import { SellerListPage } from '../../organisms'
import { buildOrderColumns } from './Orders.columns'
import { buildOrderStatusCounts, ORDERS_STATUS_TAB_ORDER } from './Orders.constants'
import type { OrderRecord, OrderStatusTab, OrderStatusTabOption, OrdersProps } from './Orders.types'

interface OrdersClientProps {
  searchPlaceholder: string
  viewLabel: string
  emptyMessage: string
  statusTabs: OrderStatusTabOption[]
  items: OrderRecord[]
  loading?: boolean
  meta?: OrdersProps['meta']
  activeStatus: OrderStatusTab
  onView?: OrdersProps['onView']
  onSearchChange?: OrdersProps['onSearchChange']
  onStatusChange?: OrdersProps['onStatusChange']
  onPageChange?: OrdersProps['onPageChange']
}

export function OrdersClient({
  searchPlaceholder,
  viewLabel,
  emptyMessage,
  statusTabs,
  items,
  loading,
  meta,
  activeStatus,
  onView,
  onSearchChange,
  onStatusChange,
  onPageChange,
}: OrdersClientProps) {
  const [inputSearch, setInputSearch] = useState('')
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const handleSearchChange = useCallback(
    (value: string) => {
      setInputSearch(value)
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        onSearchChange?.(value)
      }, 300)
    },
    [onSearchChange],
  )

  const counts = useMemo(() => buildOrderStatusCounts(statusTabs), [statusTabs])
  const columns = useMemo(() => buildOrderColumns({ viewLabel, onView }), [viewLabel, onView])

  return (
    <SellerListPage.Header>
      <SellerListPage.StatusTabs
        tabs={ORDERS_STATUS_TAB_ORDER}
        value={activeStatus}
        onChange={(tab) => onStatusChange?.(tab as OrderStatusTab)}
        counts={counts}
      />

      <SellerListPage.Table
        columns={columns}
        data={items}
        {...(loading !== undefined ? { loading } : {})}
        {...(meta !== undefined ? { meta } : {})}
        {...(onPageChange !== undefined ? { onPageChange } : {})}
        emptyMessage={emptyMessage}
        toolbar={
          <SellerListPage.Filters>
            <SellerListPage.Search
              value={inputSearch}
              onChange={handleSearchChange}
              placeholder={searchPlaceholder}
            />
          </SellerListPage.Filters>
        }
      />
    </SellerListPage.Header>
  )
}
