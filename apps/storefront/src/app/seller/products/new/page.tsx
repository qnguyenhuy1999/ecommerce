'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { productClient } from '@ecom/api-client'
import { Button, Input, Label, Textarea } from '@ecom/ui'
import { StorefrontFooter, StorefrontHeader } from '@ecom/ui-storefront'

import { useStorefrontChrome } from '@/components/storefront-chrome'

export default function NewSellerProductPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { promoBar, headerProps, footerProps } = useStorefrontChrome()
  const [name, setName] = React.useState('')
  const [sku, setSku] = React.useState('')
  const [price, setPrice] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [stock, setStock] = React.useState('0')

  const create = useMutation({
    mutationFn: () =>
      productClient.create({
        name,
        sku,
        price: Number(price),
        description,
        status: 'DRAFT',
        variants: [{ sku, attributes: {}, stock: Number(stock) }],
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['seller-console'] })
      router.push('/seller/dashboard')
    },
  })

  return (
    <div className="min-h-screen bg-[var(--surface-canvas)] text-[var(--text-primary)]">
      {promoBar}
      <StorefrontHeader {...headerProps} />
      <main className="mx-auto max-w-2xl px-4 py-10">
        <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-base)] p-6">
          <h1 className="text-2xl font-bold">Add product</h1>
          <form
            className="mt-6 grid gap-4"
            onSubmit={(event) => {
              event.preventDefault()
              create.mutate()
            }}
          >
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(event) => setName(event.target.value)} required />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" value={sku} onChange={(event) => setSku(event.target.value)} required />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input id="price" type="number" min="0.01" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} required />
              </div>
            </div>
            <div>
              <Label htmlFor="stock">Initial stock</Label>
              <Input id="stock" type="number" min="0" value={stock} onChange={(event) => setStock(event.target.value)} />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={(event) => setDescription(event.target.value)} />
            </div>
            {create.isError && <p className="text-sm text-red-600">Product creation failed. Ensure seller KYC is approved.</p>}
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? 'Creating…' : 'Create draft'}
            </Button>
          </form>
        </section>
      </main>
      <StorefrontFooter {...footerProps} />
    </div>
  )
}
