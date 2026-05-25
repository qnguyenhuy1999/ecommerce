import { Typography } from '@ecom/core-ui'
import { SellerListPage } from '../../organisms'
import { ordersDefaultProps } from './Orders.fixtures'
import type { OrdersProps } from './Orders.types'

export function Orders({
  title = ordersDefaultProps.title,
  description = ordersDefaultProps.description,
  searchPlaceholder: _searchPlaceholder = ordersDefaultProps.searchPlaceholder,
  viewLabel = ordersDefaultProps.viewLabel,
  emptyMessage = ordersDefaultProps.emptyMessage,
  statusTabs: _statusTabs = ordersDefaultProps.statusTabs,
  items = ordersDefaultProps.items,
  onView = ordersDefaultProps.onView,
}: OrdersProps) {
  return (
    <SellerListPage
      title={title}
      description={description}
      breadcrumb={[{ label: 'Admin', href: '#' }, { label: 'Orders' }]}
      mainClassName="space-y-5"
    >
      <div className="space-y-4">
        {items && items.length > 0 ? (
          <ul className="divide-border divide-y">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between py-3">
                <div className="space-y-1">
                  <Typography variant="body-sm" className="font-medium">
                    {item.id}
                  </Typography>
                  <Typography variant="caption" className="text-muted-foreground">
                    {item.status} · {item.totalAmountLabel} · {item.itemCount} item(s) ·{' '}
                    {item.createdAtLabel}
                  </Typography>
                </div>
                {onView && (
                  <button type="button" className="text-xs underline" onClick={() => onView(item)}>
                    {viewLabel ?? 'View'}
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <Typography variant="muted">
            {emptyMessage ?? 'No orders match current filters.'}
          </Typography>
        )}
      </div>
    </SellerListPage>
  )
}
