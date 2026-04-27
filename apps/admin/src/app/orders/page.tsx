'use client'

import React from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { adminOrderClient } from '@ecom/api-client'
import type {
  AdminOrderDetail,
  AdminOrderSummary,
  AdminUpdateOrderStatusRequest,
  AdminUpdateSubOrderStatusRequest,
} from '@ecom/api-types'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ecom/ui'
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableColumn,
  DataTableEmpty,
  DataTableHeader,
  DataTableRow,
  StatusBadge,
} from '@ecom/ui-admin'
import type { StatusValue } from '@ecom/ui-admin'
import { AdminShell } from '../../components/admin-shell'

const ORDER_STATUSES = [
  'PENDING_PAYMENT',
  'PAID',
  'PROCESSING',
  'SHIPPED',
  'COMPLETED',
  'CANCELLED',
  'REFUNDED',
  'PENDING_REFUND',
] as const

type OrderStatus = (typeof ORDER_STATUSES)[number]

const ADMIN_ORDER_TARGETS = ['PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED'] as const
const ADMIN_SUB_ORDER_TARGETS = ['PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED'] as const

type AdminOrderTarget = (typeof ADMIN_ORDER_TARGETS)[number]
type AdminSubOrderTarget = (typeof ADMIN_SUB_ORDER_TARGETS)[number]

const STATUS_TO_BADGE: Record<OrderStatus, StatusValue> = {
  PENDING_PAYMENT: 'pending',
  PAID: 'processing',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  COMPLETED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
  PENDING_REFUND: 'refunded',
}

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING_PAYMENT: 'Pending payment',
  PAID: 'Paid',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  REFUNDED: 'Refunded',
  PENDING_REFUND: 'Pending refund',
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

interface Filters {
  status: OrderStatus | 'ALL'
  buyerEmail: string
  sellerId: string
  placedFrom: string
  placedTo: string
}

const INITIAL_FILTERS: Filters = {
  status: 'ALL',
  buyerEmail: '',
  sellerId: '',
  placedFrom: '',
  placedTo: '',
}

export default function OrdersPage() {
  const [filters, setFilters] = React.useState<Filters>(INITIAL_FILTERS)
  const [page, setPage] = React.useState(1)
  const [activeOrderId, setActiveOrderId] = React.useState<string | null>(null)
  const limit = 20

  const queryParams = React.useMemo(
    () => ({
      page,
      limit,
      status: filters.status !== 'ALL' ? filters.status : undefined,
      buyerEmail: filters.buyerEmail.trim() || undefined,
      sellerId: filters.sellerId.trim() || undefined,
      placedFrom: filters.placedFrom || undefined,
      placedTo: filters.placedTo || undefined,
    }),
    [filters, page],
  )

  const list = useQuery({
    queryKey: ['admin-orders', queryParams],
    queryFn: () => adminOrderClient.list(queryParams),
  })

  const orders = list.data?.data ?? []
  const total = list.data?.meta.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / limit))

  return (
    <AdminShell title="Orders">
      <div className="space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Order monitoring</h1>
          <p className="text-[var(--text-secondary)]">
            Live operational view of buyer orders across all sellers.
          </p>
        </header>

        <FiltersBar
          filters={filters}
          onChange={(next) => {
            setFilters(next)
            setPage(1)
          }}
        />

        <DataTable card title="Recent orders" totalRows={total}>
          <DataTableHeader>
            <DataTableRow>
              <DataTableColumn>Order</DataTableColumn>
              <DataTableColumn>Buyer</DataTableColumn>
              <DataTableColumn>Placed</DataTableColumn>
              <DataTableColumn align="right">Items</DataTableColumn>
              <DataTableColumn align="right">Total</DataTableColumn>
              <DataTableColumn>Status</DataTableColumn>
              <DataTableColumn align="right">Actions</DataTableColumn>
            </DataTableRow>
          </DataTableHeader>
          <DataTableBody>
            {list.isLoading ? (
              <DataTableEmpty colSpan={7}>Loading orders…</DataTableEmpty>
            ) : list.isError ? (
              <DataTableEmpty colSpan={7}>Failed to load orders. Try again.</DataTableEmpty>
            ) : orders.length === 0 ? (
              <DataTableEmpty colSpan={7}>No orders match the current filters.</DataTableEmpty>
            ) : (
              orders.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  onInspect={() => setActiveOrderId(order.id)}
                />
              ))
            )}
          </DataTableBody>
        </DataTable>

        {total > limit && (
          <div className="flex items-center justify-end gap-3">
            <Button
              size="sm"
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="text-sm text-[var(--text-secondary)]">
              Page {page} of {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      <OrderDetailDialog orderId={activeOrderId} onClose={() => setActiveOrderId(null)} />
    </AdminShell>
  )
}

function FiltersBar({
  filters,
  onChange,
}: {
  filters: Filters
  onChange: (next: Filters) => void
}) {
  return (
    <div className="grid gap-3 md:grid-cols-5">
      <div className="space-y-1">
        <Label htmlFor="status">Status</Label>
        <Select
          value={filters.status}
          onValueChange={(value) => onChange({ ...filters, status: value as Filters['status'] })}
        >
          <SelectTrigger id="status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            {ORDER_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {STATUS_LABEL[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <Label htmlFor="buyerEmail">Buyer email</Label>
        <Input
          id="buyerEmail"
          placeholder="buyer@example.com"
          value={filters.buyerEmail}
          onChange={(event) => onChange({ ...filters, buyerEmail: event.target.value })}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="sellerId">Seller ID</Label>
        <Input
          id="sellerId"
          placeholder="sel_…"
          value={filters.sellerId}
          onChange={(event) => onChange({ ...filters, sellerId: event.target.value })}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="placedFrom">Placed from</Label>
        <Input
          id="placedFrom"
          type="date"
          value={filters.placedFrom}
          onChange={(event) => onChange({ ...filters, placedFrom: event.target.value })}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="placedTo">Placed to</Label>
        <Input
          id="placedTo"
          type="date"
          value={filters.placedTo}
          onChange={(event) => onChange({ ...filters, placedTo: event.target.value })}
        />
      </div>
    </div>
  )
}

function OrderRow({ order, onInspect }: { order: AdminOrderSummary; onInspect: () => void }) {
  return (
    <DataTableRow rowKey={order.id}>
      <DataTableCell className="font-semibold">{order.orderNumber}</DataTableCell>
      <DataTableCell muted>{order.buyerEmail}</DataTableCell>
      <DataTableCell muted>{formatDate(order.placedAt)}</DataTableCell>
      <DataTableCell align="right" className="tabular-nums">
        {order.itemCount}
      </DataTableCell>
      <DataTableCell align="right" className="tabular-nums font-medium">
        {formatCurrency(order.totalAmount)}
      </DataTableCell>
      <DataTableCell>
        <StatusBadge
          status={STATUS_TO_BADGE[order.status as OrderStatus]}
          label={STATUS_LABEL[order.status as OrderStatus]}
        />
      </DataTableCell>
      <DataTableCell align="right">
        <Button size="sm" variant="outline" onClick={onInspect}>
          Inspect
        </Button>
      </DataTableCell>
    </DataTableRow>
  )
}

function OrderDetailDialog({ orderId, onClose }: { orderId: string | null; onClose: () => void }) {
  const queryClient = useQueryClient()
  const detail = useQuery({
    queryKey: ['admin-order', orderId],
    queryFn: () => adminOrderClient.getById(orderId as string),
    enabled: !!orderId,
  })

  const invalidate = React.useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
    if (orderId) {
      void queryClient.invalidateQueries({ queryKey: ['admin-order', orderId] })
    }
  }, [queryClient, orderId])

  const updateOrderStatus = useMutation({
    mutationFn: (payload: AdminUpdateOrderStatusRequest) =>
      adminOrderClient.updateStatus(orderId as string, payload),
    onSuccess: invalidate,
  })

  const updateSubOrderStatus = useMutation({
    mutationFn: ({
      subOrderId,
      payload,
    }: {
      subOrderId: string
      payload: AdminUpdateSubOrderStatusRequest
    }) => adminOrderClient.updateSubOrderStatus(subOrderId, payload),
    onSuccess: invalidate,
  })

  const data = detail.data

  return (
    <Dialog open={!!orderId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{data ? `Order ${data.orderNumber}` : 'Order detail'}</DialogTitle>
          <DialogDescription>Inspect sub-orders and update fulfillment status.</DialogDescription>
        </DialogHeader>

        {detail.isLoading && <p>Loading…</p>}
        {detail.isError && <p>Failed to load order detail.</p>}

        {data && (
          <div className="space-y-4">
            <OrderSummaryPanel
              detail={data}
              onChangeStatus={(status) => updateOrderStatus.mutate({ status })}
              isPending={updateOrderStatus.isPending}
            />

            <section className="space-y-3">
              <h3 className="text-[length:var(--text-base)] font-semibold">Sub-orders</h3>
              {data.subOrders.map((sub) => (
                <SubOrderCard
                  key={sub.id}
                  sub={sub}
                  onUpdate={(payload) =>
                    updateSubOrderStatus.mutate({ subOrderId: sub.id, payload })
                  }
                  isPending={updateSubOrderStatus.isPending}
                />
              ))}
            </section>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function OrderSummaryPanel({
  detail,
  onChangeStatus,
  isPending,
}: {
  detail: AdminOrderDetail
  onChangeStatus: (status: AdminOrderTarget) => void
  isPending: boolean
}) {
  const [next, setNext] = React.useState<AdminOrderTarget | ''>('')
  return (
    <section className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-secondary)] p-4 space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-[var(--text-secondary)]">Buyer</p>
          <p className="font-medium">{detail.buyerEmail}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-[var(--text-secondary)]">Placed</p>
          <p className="font-medium">{formatDate(detail.placedAt)}</p>
        </div>
        <StatusBadge
          status={STATUS_TO_BADGE[detail.status as OrderStatus]}
          label={STATUS_LABEL[detail.status as OrderStatus]}
        />
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <span>Subtotal: {formatCurrency(detail.subtotal)}</span>
        <span>Shipping: {formatCurrency(detail.shippingFee)}</span>
        <span className="font-semibold">Total: {formatCurrency(detail.totalAmount)}</span>
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <div className="space-y-1">
          <Label htmlFor="order-status">Transition order to</Label>
          <Select value={next} onValueChange={(value) => setNext(value as AdminOrderTarget)}>
            <SelectTrigger id="order-status" className="min-w-[12rem]">
              <SelectValue placeholder="Select target status" />
            </SelectTrigger>
            <SelectContent>
              {ADMIN_ORDER_TARGETS.map((status) => (
                <SelectItem key={status} value={status}>
                  {STATUS_LABEL[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          disabled={!next || isPending}
          onClick={() => {
            if (next) onChangeStatus(next)
          }}
        >
          Apply
        </Button>
      </div>
    </section>
  )
}

function SubOrderCard({
  sub,
  onUpdate,
  isPending,
}: {
  sub: AdminOrderDetail['subOrders'][number]
  onUpdate: (payload: AdminUpdateSubOrderStatusRequest) => void
  isPending: boolean
}) {
  const [next, setNext] = React.useState<AdminSubOrderTarget | ''>('')
  const [carrier, setCarrier] = React.useState(sub.shippingTracking?.carrier ?? '')
  const [trackingNumber, setTrackingNumber] = React.useState(
    sub.shippingTracking?.trackingNumber ?? '',
  )

  const requiresTracking = next === 'SHIPPED'
  const trackingProvided = !!carrier.trim() && !!trackingNumber.trim()
  const canSubmit = !!next && (!requiresTracking || trackingProvided) && !isPending

  return (
    <article className="rounded-[var(--radius-md)] border border-[var(--border-default)] p-3 space-y-2">
      <header className="flex items-center justify-between gap-3">
        <div>
          <p className="font-semibold">{sub.storeName}</p>
          <p className="text-sm text-[var(--text-secondary)]">
            Subtotal {formatCurrency(sub.subtotal)}
          </p>
        </div>
        <StatusBadge
          status={STATUS_TO_BADGE[sub.status as OrderStatus]}
          label={STATUS_LABEL[sub.status as OrderStatus]}
        />
      </header>

      <ul className="space-y-1 text-sm">
        {sub.items.map((item) => (
          <li key={item.id} className="flex items-baseline justify-between gap-3">
            <span>
              <span className="font-medium">{item.productName}</span>{' '}
              <span className="text-[var(--text-tertiary)]">({item.variantSku})</span>
            </span>
            <span className="tabular-nums">
              {item.quantity} × {formatCurrency(item.unitPrice)}
            </span>
          </li>
        ))}
      </ul>

      <div className="grid gap-2 md:grid-cols-3">
        <div className="space-y-1">
          <Label htmlFor={`sub-${sub.id}-status`}>Transition to</Label>
          <Select value={next} onValueChange={(value) => setNext(value as AdminSubOrderTarget)}>
            <SelectTrigger id={`sub-${sub.id}-status`}>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {ADMIN_SUB_ORDER_TARGETS.map((status) => (
                <SelectItem key={status} value={status}>
                  {STATUS_LABEL[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor={`sub-${sub.id}-carrier`}>Carrier</Label>
          <Input
            id={`sub-${sub.id}-carrier`}
            placeholder="UPS, FedEx…"
            value={carrier}
            onChange={(event) => setCarrier(event.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`sub-${sub.id}-tracking`}>Tracking number</Label>
          <Input
            id={`sub-${sub.id}-tracking`}
            placeholder="1Z…"
            value={trackingNumber}
            onChange={(event) => setTrackingNumber(event.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          size="sm"
          disabled={!canSubmit}
          onClick={() => {
            if (!next) return
            const payload: AdminUpdateSubOrderStatusRequest = { status: next }
            if (trackingProvided) {
              payload.shippingTracking = {
                carrier: carrier.trim(),
                trackingNumber: trackingNumber.trim(),
              }
            }
            onUpdate(payload)
          }}
        >
          Update
        </Button>
      </div>
    </article>
  )
}
