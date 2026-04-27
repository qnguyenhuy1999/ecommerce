'use client'

import Link from 'next/link'

import { useQuery } from '@tanstack/react-query'

import { sellerConsoleClient } from '@ecom/api-client'
import { StorefrontFooter, StorefrontHeader } from '@ecom/ui-storefront'

import { useStorefrontChrome } from '@/components/storefront-chrome'

const FORMATTER = new Intl.NumberFormat('en-SG', { style: 'currency', currency: 'SGD' })

export default function SellerDashboardPage() {
  const { promoBar, headerProps, footerProps } = useStorefrontChrome()
  const consoleQuery = useQuery({
    queryKey: ['seller-console'],
    queryFn: sellerConsoleClient.get,
  })
  const data = consoleQuery.data

  return (
    <div className="min-h-screen bg-[var(--surface-canvas)] text-[var(--text-primary)]">
      {promoBar}
      <StorefrontHeader {...headerProps} />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[length:var(--text-3xl)] font-bold">Seller dashboard</h1>
            <p className="text-[var(--text-secondary)]">
              {data ? `${data.seller.storeName} · KYC ${data.seller.kycStatus}` : 'Loading seller console…'}
            </p>
          </div>
          <Link className="rounded-md bg-[var(--action-primary)] px-4 py-2 text-[var(--action-primary-foreground)]" href="/seller/products/new">
            Add product
          </Link>
        </div>

        {consoleQuery.isError && (
          <div className="mt-6 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-base)] p-6">
            <p>Seller profile not found. <Link className="underline" href="/sell">Apply to sell</Link>.</p>
          </div>
        )}

        {data && (
          <div className="mt-8 space-y-8">
            <section className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
              <Metric label="Products" value={String(data.metrics.products)} />
              <Metric label="Active" value={String(data.metrics.activeProducts)} />
              <Metric label="Open orders" value={String(data.metrics.pendingOrders)} />
              <Metric label="Revenue" value={FORMATTER.format(data.metrics.revenue)} />
              <Metric label="Commission" value={FORMATTER.format(data.metrics.commission)} />
              <Metric label="Balance" value={FORMATTER.format(data.metrics.availableBalance)} />
            </section>

            <section className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-base)] p-4">
              <h2 className="mb-4 font-semibold">Products</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="text-[var(--text-secondary)]">
                    <tr>
                      <th className="py-2">Name</th>
                      <th className="py-2">SKU</th>
                      <th className="py-2">Status</th>
                      <th className="py-2">Price</th>
                      <th className="py-2">Variants</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.products.map((product) => (
                      <tr key={product.id} className="border-t border-[var(--border-subtle)]">
                        <td className="py-2">{product.name}</td>
                        <td className="py-2 font-mono text-xs">{product.sku}</td>
                        <td className="py-2">{product.status}</td>
                        <td className="py-2">{FORMATTER.format(product.price)}</td>
                        <td className="py-2">{product.variants?.length ?? 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="grid gap-8 lg:grid-cols-2">
              <Panel title="Inventory">
                {data.inventory.map((row) => (
                  <div key={row.variantId} className="flex items-center justify-between border-t border-[var(--border-subtle)] py-2 text-sm">
                    <span>{row.productName} · {row.sku}</span>
                    <span>{row.availableStock} available</span>
                  </div>
                ))}
              </Panel>
              <Panel title="Finance ledger">
                {data.ledger.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between border-t border-[var(--border-subtle)] py-2 text-sm">
                    <span>{entry.description ?? entry.referenceType ?? entry.type}</span>
                    <span>{FORMATTER.format(entry.amount)}</span>
                  </div>
                ))}
              </Panel>
            </section>
          </div>
        )}
      </main>
      <StorefrontFooter {...footerProps} />
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-base)] p-4">
      <p className="text-xs uppercase tracking-wide text-[var(--text-tertiary)]">{label}</p>
      <p className="mt-2 text-lg font-semibold">{value}</p>
    </div>
  )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-base)] p-4">
      <h2 className="mb-4 font-semibold">{title}</h2>
      {children}
    </section>
  )
}
