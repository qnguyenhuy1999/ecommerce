'use client'

import React from 'react'

import { useMutation, useQuery } from '@tanstack/react-query'

import { Button, Input, Label } from '@ecom/ui'
import { adminCommissionClient } from '@ecom/api-client'

import { AdminShell } from '@/components/admin-shell'

const FORMATTER = new Intl.NumberFormat('en-SG', { style: 'currency', currency: 'SGD' })

export default function PayoutsPage() {
  const [sellerId, setSellerId] = React.useState('')
  const [from, setFrom] = React.useState('')
  const [to, setTo] = React.useState('')
  const filters = {
    ...(sellerId ? { sellerId } : {}),
    ...(from ? { from } : {}),
    ...(to ? { to } : {}),
  }
  const report = useQuery({
    queryKey: ['admin-payout-report', filters],
    queryFn: () => adminCommissionClient.payoutReport({ ...filters, limit: 50 }),
  })
  const exportCsv = useMutation({
    mutationFn: () => adminCommissionClient.payoutExport(filters),
  })

  const rows = report.data?.data ?? []
  const total = rows.reduce((sum, row) => sum + row.amount, 0)

  return (
    <AdminShell title="Payouts">
      <div className="space-y-[var(--space-6)]">
        <header>
          <h1 className="text-[length:var(--text-2xl)] font-bold">Seller finance</h1>
          <p className="text-[var(--text-secondary)]">
            Review commission ledger entries and export payout reports.
          </p>
        </header>

        <section className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-base)] p-[var(--space-4)]">
          <form
            className="grid gap-[var(--space-3)] md:grid-cols-[1fr_12rem_12rem_auto]"
            onSubmit={(event) => {
              event.preventDefault()
              void report.refetch()
            }}
          >
            <div>
              <Label htmlFor="sellerId">Seller ID</Label>
              <Input id="sellerId" value={sellerId} onChange={(event) => setSellerId(event.target.value)} />
            </div>
            <div>
              <Label htmlFor="from">From</Label>
              <Input id="from" type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
            </div>
            <div>
              <Label htmlFor="to">To</Label>
              <Input id="to" type="date" value={to} onChange={(event) => setTo(event.target.value)} />
            </div>
            <Button className="self-end" type="submit">
              Apply
            </Button>
          </form>
        </section>

        <section className="grid gap-[var(--space-4)] md:grid-cols-3">
          <Metric label="Rows" value={String(rows.length)} />
          <Metric label="Payout total" value={FORMATTER.format(total)} />
          <Metric label="Export rows" value={String(exportCsv.data?.totalRows ?? rows.length)} />
        </section>

        <section className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-base)] p-[var(--space-4)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Payout report</h2>
            <Button type="button" onClick={() => exportCsv.mutate()} disabled={exportCsv.isPending}>
              Generate CSV
            </Button>
          </div>
          {exportCsv.data && (
            <textarea
              className="mb-4 min-h-36 w-full rounded border border-[var(--border-subtle)] bg-[var(--surface-muted)] p-3 font-mono text-xs"
              readOnly
              value={exportCsv.data.content}
            />
          )}
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-[var(--text-secondary)]">
                <tr>
                  <th className="py-2">Seller</th>
                  <th className="py-2">Order</th>
                  <th className="py-2">Amount</th>
                  <th className="py-2">Rate</th>
                  <th className="py-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.commissionId} className="border-t border-[var(--border-subtle)]">
                    <td className="py-2">{row.storeName}</td>
                    <td className="py-2 font-mono text-xs">{row.orderId}</td>
                    <td className="py-2">{FORMATTER.format(row.amount)}</td>
                    <td className="py-2">{(row.rate * 100).toFixed(1)}%</td>
                    <td className="py-2">{new Date(row.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AdminShell>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-base)] p-[var(--space-4)]">
      <p className="text-xs uppercase tracking-wide text-[var(--text-tertiary)]">{label}</p>
      <p className="mt-2 text-xl font-semibold">{value}</p>
    </div>
  )
}
