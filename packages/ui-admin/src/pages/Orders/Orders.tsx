import { SellerListPage } from '../../organisms'
import { ordersDefaultProps } from './Orders.fixtures'
import { OrdersClient } from './Orders.client'
import type { OrdersProps } from './Orders.types'

export function Orders({
  title = ordersDefaultProps.title,
  description = ordersDefaultProps.description,
  searchPlaceholder = ordersDefaultProps.searchPlaceholder,
  viewLabel = ordersDefaultProps.viewLabel,
  emptyMessage = ordersDefaultProps.emptyMessage,
  statusTabs = ordersDefaultProps.statusTabs,
  items = ordersDefaultProps.items,
  loading = ordersDefaultProps.loading,
  meta = ordersDefaultProps.meta,
  activeStatus = ordersDefaultProps.activeStatus,
  onView = ordersDefaultProps.onView,
  onSearchChange = ordersDefaultProps.onSearchChange,
  onStatusChange = ordersDefaultProps.onStatusChange,
  onPageChange = ordersDefaultProps.onPageChange,
}: OrdersProps) {
  return (
    <SellerListPage
      title={title}
      description={description}
      breadcrumb={[{ label: 'Admin', href: '#' }, { label: 'Orders' }]}
      mainClassName="space-y-5"
    >
      <OrdersClient
        searchPlaceholder={searchPlaceholder ?? 'Search order ID...'}
        viewLabel={viewLabel ?? 'View'}
        emptyMessage={emptyMessage ?? 'No orders match current filters.'}
        statusTabs={statusTabs ?? []}
        items={items ?? []}
        activeStatus={activeStatus ?? 'ALL'}
        {...(loading !== undefined ? { loading } : {})}
        {...(meta !== undefined ? { meta } : {})}
        {...(onView !== undefined ? { onView } : {})}
        {...(onSearchChange !== undefined ? { onSearchChange } : {})}
        {...(onStatusChange !== undefined ? { onStatusChange } : {})}
        {...(onPageChange !== undefined ? { onPageChange } : {})}
      />
    </SellerListPage>
  )
}
