'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { authClient } from '@ecom/api-client'
import { Button, Input, Label } from '@ecom/ui'
import { StorefrontFooter, StorefrontHeader } from '@ecom/ui-storefront'

import { useStorefrontChrome } from '@/components/storefront-chrome'

export default function RegisterPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { promoBar, headerProps, footerProps } = useStorefrontChrome()

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')

  const register = useMutation({
    mutationFn: () =>
      authClient.register({
        email,
        password,
        ...(firstName.trim() ? { firstName: firstName.trim() } : {}),
        ...(lastName.trim() ? { lastName: lastName.trim() } : {}),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries()
      router.push('/verify-email?registered=1')
    },
  })

  return (
    <div className="min-h-screen bg-[var(--surface-canvas)] text-[var(--text-primary)]">
      {promoBar}
      <StorefrontHeader {...headerProps} />
      <main className="mx-auto flex min-h-[60vh] w-full max-w-md flex-col justify-center px-4 py-12">
        <section className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-base)] p-[var(--space-6)] shadow-[var(--elevation-card)]">
          <div className="mb-[var(--space-6)] space-y-[var(--space-2)]">
            <h1 className="text-[length:var(--text-2xl)] font-bold">Create account</h1>
            <p className="text-[length:var(--text-sm)] text-[var(--text-secondary)]">
              Register once to shop, track orders, and apply as a seller.
            </p>
          </div>
          <form
            className="space-y-[var(--space-4)]"
            onSubmit={(event) => {
              event.preventDefault()
              register.mutate()
            }}
          >
            <div className="grid gap-[var(--space-3)] sm:grid-cols-2">
              <div className="space-y-[var(--space-2)]">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                />
              </div>
              <div className="space-y-[var(--space-2)]">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                />
              </div>
            </div>
            <div className="space-y-[var(--space-2)]">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div className="space-y-[var(--space-2)]">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            {register.isError && (
              <p className="text-[length:var(--text-sm)] text-[var(--intent-danger)]">
                Registration failed. The email may already be in use.
              </p>
            )}
            <Button type="submit" className="w-full" disabled={register.isPending}>
              {register.isPending ? 'Creating account…' : 'Create account'}
            </Button>
          </form>
          <p className="mt-[var(--space-4)] text-center text-[length:var(--text-sm)] text-[var(--text-secondary)]">
            Already have an account?{' '}
            <Link className="font-medium underline" href="/login">
              Sign in
            </Link>
          </p>
        </section>
      </main>
      <StorefrontFooter {...footerProps} />
    </div>
  )
}
