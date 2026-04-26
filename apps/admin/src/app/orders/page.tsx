'use client'

import React from 'react'

import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableColumn,
  DataTableHeader,
  DataTableRow,
  StatusBadge,
} from '@ecom/ui-admin'
import type { StatusValue } from '@ecom/ui-admin'

import { AdminShell } from '@/components/admin-shell'

interface OrderRow {
  id: string
  orderNumber: string
  buyerEmail: string
  placedAt: string
  total: number
  itemCount: number
  status: StatusValue
}

/**
 * Mock orders feed for operational monitoring. Will be replaced with a real
 * `orderClient.list()` call once an admin-scoped endpoint is exposed.
 */
const ORDERS: OrderRow[] = [
  {
    id: 'ord_01',
    orderNumber: 'ORD-1042',
    buyerEmail: 'sasha@buyer.io',
    placedAt: '2026-04-25 14:02',
    total: 184.5,
    itemCount: 3,
    status: 'pending',
  },
  {
    id: 'ord_02',
    orderNumber: 'ORD-1041',
    buyerEmail: 'leo@buyer.io',
    placedAt: '2026-04-25 13:18',
    total: 64.0,
    itemCount: 1,
    status: 'processing',
  },
  {
    id: 'ord_03',
    orderNumber: 'ORD-1040',
    buyerEmail: 'maria@buyer.io',
    placedAt: '2026-04-25 12:45',
    total: 218.75,
    itemCount: 4,
    status: 'shipped',
  },
  {
    id: 'ord_04',
    orderNumber: 'ORD-1039',
    buyerEmail: 'jamie@buyer.io',
    placedAt: '2026-04-25 11:30',
    total: 39.0,
    itemCount: 1,
    status: 'delivered',
  },
  {
    id: 'ord_05',
    orderNumber: 'ORD-1038',
    buyerEmail: 'noah@buyer.io',
    placedAt: '2026-04-25 09:08',
    total: 102.0,
    itemCount: 2,
    status: 'cancelled',
  },
]

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

export default function OrdersPage() {
  return (
    <AdminShell title="Orders">
      <div className="space-y-[var(--space-6)]">
        <header className="space-y-[var(--space-1)]">
          <h1 className="text-[length:var(--text-2xl)] font-bold tracking-tight">
            Order monitoring
          </h1>
          <p className="text-[var(--text-secondary)]">
            Live operational view of buyer orders across all sellers.
          </p>
        </header>

        <DataTable card title="Recent orders" totalRows={ORDERS.length}>
          <DataTableHeader>
            <DataTableRow>
              <DataTableColumn>Order</DataTableColumn>
              <DataTableColumn>Buyer</DataTableColumn>
              <DataTableColumn>Placed</DataTableColumn>
              <DataTableColumn align="right">Items</DataTableColumn>
              <DataTableColumn align="right">Total</DataTableColumn>
              <DataTableColumn>Status</DataTableColumn>
            </DataTableRow>
          </DataTableHeader>
          <DataTableBody>
            {ORDERS.map((order) => (
              <DataTableRow key={order.id} rowKey={order.id}>
                <DataTableCell className="font-semibold">{order.orderNumber}</DataTableCell>
                <DataTableCell muted>{order.buyerEmail}</DataTableCell>
                <DataTableCell muted>{order.placedAt}</DataTableCell>
                <DataTableCell align="right" className="tabular-nums">
                  {order.itemCount}
                </DataTableCell>
                <DataTableCell align="right" className="tabular-nums font-medium">
                  {formatCurrency(order.total)}
                </DataTableCell>
                <DataTableCell>
                  <StatusBadge status={order.status} />
                </DataTableCell>
              </DataTableRow>
            ))}
          </DataTableBody>
        </DataTable>
      </div>
    </AdminShell>
  )
}
