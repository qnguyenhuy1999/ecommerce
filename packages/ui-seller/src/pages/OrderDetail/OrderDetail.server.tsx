import { StatusBadge, Typography } from '@ecom/core-ui'
import { Package, Truck } from 'lucide-react'
import { SectionCard } from '../../atoms/SectionCard'
import type {
  ensureAuditLogs} from './OrderDetail.utils';
import {
  formatOrderCurrency,
  formatStatusLabel,
  getOrderSummaryRows,
} from './OrderDetail.utils'
import type { OrderRecord } from './OrderDetail.controller'

export function OrderDetailSidebar({ order }: { order: OrderRecord }) {
  return (
    <div className="space-y-4">
      <SectionCard title="Status">
        <div className="space-y-3">
          <StatusBadge status={order.status} />
          <div className="text-muted-foreground text-sm">
            <div>Placed: {order.createdAt}</div>
            {order.updatedAt ? <div>Updated: {order.updatedAt}</div> : null}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Buyer">
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-muted-foreground">Name</dt>
            <dd className="text-foreground font-medium">{order.customer.name}</dd>
          </div>
          {order.customer.phone ? (
            <div>
              <dt className="text-muted-foreground">Phone</dt>
              <dd>{order.customer.phone}</dd>
            </div>
          ) : null}
          {order.customer.address ? (
            <div>
              <dt className="text-muted-foreground">Shipping address</dt>
              <dd className="whitespace-pre-line">{order.customer.address}</dd>
            </div>
          ) : null}
        </dl>
      </SectionCard>

      {order.shipment ? (
        <SectionCard title="Shipment">
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Status</dt>
              <dd>
                <StatusBadge status={order.shipment.status} />
              </dd>
            </div>
            {order.shipment.providerName ? (
              <div>
                <dt className="text-muted-foreground">Provider</dt>
                <dd>{order.shipment.providerName}</dd>
              </div>
            ) : null}
            {order.shipment.trackingNumber ? (
              <div>
                <dt className="text-muted-foreground">Tracking number</dt>
                <dd className="font-mono text-xs">{order.shipment.trackingNumber}</dd>
              </div>
            ) : null}
          </dl>
        </SectionCard>
      ) : null}
    </div>
  )
}

export function OrderSummarySection({ order }: { order: OrderRecord }) {
  return (
    <SectionCard title="Order summary" subtitle={`${order.itemCount} item(s) in this seller order`}>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="bg-muted/40 rounded-2xl border p-4">
          <div className="text-muted-foreground flex items-center gap-2 text-xs uppercase">
            <Package className="size-4" />
            Fulfillment
          </div>
          <div className="mt-2 text-lg font-semibold">{formatStatusLabel(order.status)}</div>
        </div>
        <div className="bg-muted/40 rounded-2xl border p-4">
          <div className="text-muted-foreground flex items-center gap-2 text-xs uppercase">
            <Truck className="size-4" />
            Shipment
          </div>
          <div className="mt-2 text-lg font-semibold">
            {order.shipment ? formatStatusLabel(order.shipment.status) : 'Not created'}
          </div>
        </div>
        <div className="bg-muted/40 rounded-2xl border p-4">
          <div className="text-muted-foreground text-xs uppercase">Order total</div>
          <div className="text-primary mt-2 text-lg font-semibold">
            {formatOrderCurrency(order.totalAmount)}
          </div>
        </div>
      </div>
    </SectionCard>
  )
}

export function OrderItemsSection({ order }: { order: OrderRecord }) {
  return (
    <SectionCard title="Items">
      <div className="overflow-x-auto">
        <table className="w-full min-w-180 text-sm">
          <thead>
            <tr className="border-border border-b">
              <th className="text-muted-foreground px-3 py-3 text-left text-xs font-semibold uppercase">
                Product
              </th>
              <th className="text-muted-foreground px-3 py-3 text-left text-xs font-semibold uppercase">
                Variant
              </th>
              <th className="text-muted-foreground px-3 py-3 text-left text-xs font-semibold uppercase">
                Qty
              </th>
              <th className="text-muted-foreground px-3 py-3 text-left text-xs font-semibold uppercase">
                Unit price
              </th>
              <th className="text-muted-foreground px-3 py-3 text-left text-xs font-semibold uppercase">
                Line total
              </th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-border border-b last:border-b-0">
                <td className="px-3 py-3">
                  <div className="flex items-center gap-3">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="h-12 w-12 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="bg-muted h-12 w-12 rounded-xl" />
                    )}
                    <div className="min-w-0">
                      {item.productHref ? (
                        <a
                          href={item.productHref}
                          className="text-foreground hover:text-foreground inline-block truncate font-medium underline-offset-4 hover:underline"
                        >
                          {item.productName}
                        </a>
                      ) : (
                        <div className="text-foreground truncate font-medium">
                          {item.productName}
                        </div>
                      )}
                      {item.sku ? (
                        <div className="text-muted-foreground text-xs">{item.sku}</div>
                      ) : null}
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">{item.variantLabel ?? '-'}</td>
                <td className="px-3 py-3">{item.quantity}</td>
                <td className="px-3 py-3">{formatOrderCurrency(item.unitPrice)}</td>
                <td className="px-3 py-3 font-medium">{formatOrderCurrency(item.totalPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  )
}

export function OrderActivityAndTotals({
  order,
  auditLogs,
}: {
  order: OrderRecord
  auditLogs: ReturnType<typeof ensureAuditLogs>
}) {
  const summaryRows = getOrderSummaryRows(
    order.totalAmount,
    order.subtotalAmount,
    order.shippingAmount,
  )

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <SectionCard title="Activity log">
        {auditLogs.length === 0 ? (
          <Typography variant="muted">No activity yet.</Typography>
        ) : (
          <div className="space-y-4">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="border-border flex gap-3 border-b pb-4 last:border-b-0 last:pb-0"
              >
                <div className="bg-info mt-2 h-2.5 w-2.5 rounded-full" />
                <div className="min-w-0">
                  <div className="text-foreground font-medium">{log.label}</div>
                  <div className="text-muted-foreground text-xs">{log.timestamp}</div>
                  {log.note ? (
                    <Typography variant="muted" className="mt-1">
                      {log.note}
                    </Typography>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Totals">
        <div className="space-y-3 text-sm">
          {summaryRows.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">{row.label}</span>
              <span className={row.emphasized ? 'text-foreground font-semibold' : 'font-medium'}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
