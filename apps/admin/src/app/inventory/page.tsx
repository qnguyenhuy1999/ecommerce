'use client'

import React from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { Button, Input, Label } from '@ecom/ui'
import { inventoryClient } from '@ecom/api-client'

import { AdminShell } from '@/components/admin-shell'

export default function InventoryPage() {
  const queryClient = useQueryClient()
  const [variantId, setVariantId] = React.useState('')
  const [delta, setDelta] = React.useState('')
  const [reason, setReason] = React.useState('')

  const lowStock = useQuery({
    queryKey: ['inventory-low-stock'],
    queryFn: () => inventoryClient.lowStock({ threshold: 10, limit: 25 }),
  })
  const reservations = useQuery({
    queryKey: ['inventory-reservations'],
    queryFn: () => inventoryClient.reservations({ limit: 25 }),
  })
  const adjust = useMutation({
    mutationFn: () =>
      inventoryClient.adjustStock(variantId, {
        delta: Number(delta),
        reason,
      }),
    onSuccess: async () => {
      setVariantId('')
      setDelta('')
      setReason('')
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['inventory-low-stock'] }),
        queryClient.invalidateQueries({ queryKey: ['inventory-reservations'] }),
      ])
    },
  })

  return (
    <AdminShell title="Inventory">
      <div className="space-y-[var(--space-6)]">
        <header>
          <h1 className="text-[length:var(--text-2xl)] font-bold">Inventory operations</h1>
          <p className="text-[var(--text-secondary)]">
            Monitor low stock, active reservations, and apply stock adjustments.
          </p>
        </header>

        <section className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-base)] p-[var(--space-4)]">
          <h2 className="mb-[var(--space-4)] font-semibold">Adjust stock</h2>
          <form
            className="grid gap-[var(--space-3)] md:grid-cols-[1fr_8rem_1fr_auto]"
            onSubmit={(event) => {
              event.preventDefault()
              adjust.mutate()
            }}
          >
            <div>
              <Label htmlFor="variantId">Variant ID</Label>
              <Input id="variantId" value={variantId} onChange={(event) => setVariantId(event.target.value)} required />
            </div>
            <div>
              <Label htmlFor="delta">Delta</Label>
              <Input id="delta" type="number" value={delta} onChange={(event) => setDelta(event.target.value)} required />
            </div>
            <div>
              <Label htmlFor="reason">Reason</Label>
              <Input id="reason" value={reason} onChange={(event) => setReason(event.target.value)} required />
            </div>
            <Button className="self-end" type="submit" disabled={adjust.isPending}>
              Apply
            </Button>
          </form>
          {adjust.isError && <p className="mt-3 text-sm text-red-600">Stock adjustment failed.</p>}
        </section>

        <section className="grid gap-[var(--space-6)] xl:grid-cols-2">
          <Panel title="Low stock">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-[var(--text-secondary)]">
                  <tr>
                    <th className="py-2">Product</th>
                    <th className="py-2">SKU</th>
                    <th className="py-2">Available</th>
                    <th className="py-2">Reserved</th>
                  </tr>
                </thead>
                <tbody>
                  {(lowStock.data?.data ?? []).map((row) => (
                    <tr key={row.variantId} className="border-t border-[var(--border-subtle)]">
                      <td className="py-2">{row.productName}</td>
                      <td className="py-2 font-mono text-xs">{row.sku}</td>
                      <td className="py-2">{row.availableStock}</td>
                      <td className="py-2">{row.reservedStock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel title="Reservations">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-[var(--text-secondary)]">
                  <tr>
                    <th className="py-2">Reservation</th>
                    <th className="py-2">Order</th>
                    <th className="py-2">Qty</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(reservations.data?.data ?? []).map((row) => (
                    <tr key={row.id} className="border-t border-[var(--border-subtle)]">
                      <td className="py-2 font-mono text-xs">{row.id}</td>
                      <td className="py-2 font-mono text-xs">{row.orderId}</td>
                      <td className="py-2">{row.quantity}</td>
                      <td className="py-2">{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </section>
      </div>
    </AdminShell>
  )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-base)] p-[var(--space-4)]">
      <h2 className="mb-[var(--space-4)] font-semibold">{title}</h2>
      {children}
    </section>
  )
}
