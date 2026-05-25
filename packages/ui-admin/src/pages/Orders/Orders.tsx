import { SellerListPage } from '../../organisms'
import { ordersDefaultProps } from './Orders.fixtures'
import type { OrdersProps } from './Orders.types'

export function Orders({
  title = ordersDefaultProps.title,
  description = ordersDefaultProps.description,
  searchPlaceholder = ordersDefaultProps.searchPlaceholder,
  viewLabel = ordersDefaultProps.viewLabel,
  emptyMessage = ordersDefaultProps.emptyMessage,
  statusTabs = ordersDefaultProps.statusTabs,
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
          <ul className="divide-y divide-border">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between py-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{item.id}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.status} · {item.totalAmountLabel} · {item.itemCount} item(s) · {item.createdAtLabel}
                  </p>
                </div>
                {onView && (
                  <button
                    type="button"
                    className="text-xs underline"
                    onClick={() => onView(item)}
                  >
                    {viewLabel ?? 'View'}
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">{emptyMessage ?? 'No orders match current filters.'}</p>
        )}
      </div>
    </SellerListPage>
  )
}
