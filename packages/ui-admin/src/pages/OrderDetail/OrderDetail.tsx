import { Typography } from '@ecom/core-ui/atoms/Typography'
import { ConsolePageLayout } from '@ecom/core-ui/layouts/ConsolePageLayout'
import { StatusBadge } from '@ecom/core-ui/organisms/DataTable'
import { OrderDetailActions } from './OrderDetail.client'
import { orderDetailDefaultProps } from './OrderDetail.fixtures'
import type { OrderDetailProps, SellerOrderRecord } from './OrderDetail.types'

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-muted h-24 animate-pulse rounded-xl" />
      ))}
    </div>
  )
}

function SellerOrderCard({ so }: { so: SellerOrderRecord }) {
  return (
    <div className="bg-card rounded-xl border shadow-sm">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <Typography variant="label">{so.shopName}</Typography>
          <Typography variant="body-sm" className="text-muted-foreground">
            Subtotal: {so.subtotalLabel}
          </Typography>
        </div>
        <StatusBadge status={so.status} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b text-left">
              <th className="text-muted-foreground px-4 py-3 font-medium">Product</th>
              <th className="text-muted-foreground px-4 py-3 font-medium">Qty</th>
              <th className="text-muted-foreground px-4 py-3 font-medium">Price</th>
              <th className="text-muted-foreground px-4 py-3 font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {so.items.map((item) => (
              <tr key={item.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-medium">{item.productName}</td>
                <td className="px-4 py-3">{item.quantity}</td>
                <td className="px-4 py-3">{item.unitPriceLabel}</td>
                <td className="px-4 py-3">{item.totalPriceLabel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {so.shipment && (
        <div className="border-t px-6 py-3 text-sm">
          <span className="text-muted-foreground">Shipping: </span>
          <StatusBadge status={so.shipment.status} />
          {so.shipment.trackingNumber && (
            <span className="ml-2 font-mono text-xs">{so.shipment.trackingNumber}</span>
          )}
        </div>
      )}
    </div>
  )
}

export function OrderDetail({
  order = orderDetailDefaultProps.order,
  loading = orderDetailDefaultProps.loading,
  backHref = orderDetailDefaultProps.backHref,
  forceCancelLabel = orderDetailDefaultProps.forceCancelLabel,
  forceCompleteLabel = orderDetailDefaultProps.forceCompleteLabel,
  onForceCancel = orderDetailDefaultProps.onForceCancel,
  onForceComplete = orderDetailDefaultProps.onForceComplete,
}: OrderDetailProps) {
  if (loading) return <LoadingSkeleton />
  if (!order) return <Typography variant="muted">Order not found.</Typography>

  return (
    <ConsolePageLayout
      title={order.shortId}
      description={order.createdAtLabel}
      breadcrumb={[
        { label: 'Admin', href: '#' },
        backHref ? { label: 'Orders', href: backHref } : { label: 'Orders' },
        { label: order.shortId },
      ]}
      actions={
        <OrderDetailActions
          order={order}
          forceCancelLabel={forceCancelLabel}
          forceCompleteLabel={forceCompleteLabel}
          onForceCancel={onForceCancel}
          onForceComplete={onForceComplete}
        />
      }
      mainClassName="space-y-6"
    >
      <div className="bg-card rounded-xl border p-6 shadow-sm">
        <Typography variant="label" className="mb-3 block">
          Summary
        </Typography>
        <dl className="grid gap-2 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-muted-foreground">Total</dt>
            <dd className="font-medium">{order.totalAmountLabel}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Sellers</dt>
            <dd>{order.sellerCount}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Status</dt>
            <dd>{order.status}</dd>
          </div>
        </dl>
      </div>

      {order.sellerOrders.map((so) => (
        <SellerOrderCard key={so.id} so={so} />
      ))}
    </ConsolePageLayout>
  )
}
