'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

import { useMutation } from '@tanstack/react-query'

import { sellerClient } from '@ecom/api-client'
import { Button, Input, Label, Textarea } from '@ecom/ui'
import { StorefrontFooter, StorefrontHeader } from '@ecom/ui-storefront'

import { useStorefrontChrome } from '@/components/storefront-chrome'

export default function SellPage() {
  const router = useRouter()
  const { promoBar, headerProps, footerProps } = useStorefrontChrome()
  const [storeName, setStoreName] = React.useState('')
  const [storeDescription, setStoreDescription] = React.useState('')
  const [businessRegistrationNumber, setBusinessRegistrationNumber] = React.useState('')
  const [bankAccountNumber, setBankAccountNumber] = React.useState('')
  const [bankCode, setBankCode] = React.useState('')
  const [identityDoc, setIdentityDoc] = React.useState('')

  const register = useMutation({
    mutationFn: () =>
      sellerClient.register({
        storeName,
        storeDescription,
        businessRegistrationNumber,
        bankAccountNumber,
        bankCode,
        kycDocuments: identityDoc ? { identityDoc } : undefined,
      }),
    onSuccess: () => router.push('/seller/dashboard'),
  })

  return (
    <div className="min-h-screen bg-[var(--surface-canvas)] text-[var(--text-primary)]">
      {promoBar}
      <StorefrontHeader {...headerProps} />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <section className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-base)] p-[var(--space-6)] shadow-[var(--elevation-card)]">
          <h1 className="text-[length:var(--text-3xl)] font-bold">Start selling</h1>
          <p className="mt-2 text-[var(--text-secondary)]">
            Submit your store profile and KYC details for admin approval.
          </p>
          <form
            className="mt-8 grid gap-5"
            onSubmit={(event) => {
              event.preventDefault()
              register.mutate()
            }}
          >
            <div>
              <Label htmlFor="storeName">Store name</Label>
              <Input id="storeName" value={storeName} onChange={(event) => setStoreName(event.target.value)} required />
            </div>
            <div>
              <Label htmlFor="storeDescription">Store description</Label>
              <Textarea id="storeDescription" value={storeDescription} onChange={(event) => setStoreDescription(event.target.value)} />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="businessRegistrationNumber">Business registration</Label>
                <Input id="businessRegistrationNumber" value={businessRegistrationNumber} onChange={(event) => setBusinessRegistrationNumber(event.target.value)} required />
              </div>
              <div>
                <Label htmlFor="bankAccountNumber">Bank account</Label>
                <Input id="bankAccountNumber" value={bankAccountNumber} onChange={(event) => setBankAccountNumber(event.target.value)} required />
              </div>
              <div>
                <Label htmlFor="bankCode">Bank code</Label>
                <Input id="bankCode" value={bankCode} onChange={(event) => setBankCode(event.target.value)} required />
              </div>
            </div>
            <div>
              <Label htmlFor="identityDoc">KYC document URL</Label>
              <Input id="identityDoc" type="url" value={identityDoc} onChange={(event) => setIdentityDoc(event.target.value)} placeholder="https://…" />
            </div>
            {register.isError && <p className="text-sm text-red-600">Seller registration failed. Sign in first and check details.</p>}
            <Button type="submit" disabled={register.isPending}>
              {register.isPending ? 'Submitting…' : 'Submit for approval'}
            </Button>
          </form>
        </section>
      </main>
      <StorefrontFooter {...footerProps} />
    </div>
  )
}
