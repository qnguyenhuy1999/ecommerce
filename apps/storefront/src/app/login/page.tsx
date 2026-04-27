'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { authClient } from '@ecom/api-client'
import {
  Button,
  Input,
  Label,
} from '@ecom/ui'
import {
  StorefrontFooter,
  StorefrontHeader,
} from '@ecom/ui-storefront'

import { useStorefrontChrome } from '@/components/storefront-chrome'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const { promoBar, headerProps, footerProps } = useStorefrontChrome()
  const redirectTo = searchParams.get('next') || '/account/orders'

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  const login = useMutation({
    mutationFn: () => authClient.login({ email, password }),
    onSuccess: async () => {
      await queryClient.invalidateQueries()
      router.push(redirectTo)
    },
  })

  return (
    <div className="min-h-screen bg-[var(--surface-canvas)] text-[var(--text-primary)]">
      {promoBar}
      <StorefrontHeader {...headerProps} />
      <main className="mx-auto flex min-h-[60vh] w-full max-w-md flex-col justify-center px-4 py-12">
        <section className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-base)] p-[var(--space-6)] shadow-[var(--elevation-card)]">
          <div className="mb-[var(--space-6)] space-y-[var(--space-2)]">
            <h1 className="text-[length:var(--text-2xl)] font-bold">Sign in</h1>
            <p className="text-[length:var(--text-sm)] text-[var(--text-secondary)]">
              Continue to checkout, orders, seller tools, and notifications.
            </p>
          </div>
          <form
            className="space-y-[var(--space-4)]"
            onSubmit={(event) => {
              event.preventDefault()
              login.mutate()
            }}
          >
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
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            {login.isError && (
              <p className="text-[length:var(--text-sm)] text-[var(--intent-danger)]">
                Sign-in failed. Check your email and password.
              </p>
            )}
            <Button type="submit" className="w-full" disabled={login.isPending}>
              {login.isPending ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
          <p className="mt-[var(--space-4)] text-center text-[length:var(--text-sm)] text-[var(--text-secondary)]">
            New here?{' '}
            <Link className="font-medium underline" href="/register">
              Create an account
            </Link>
          </p>
          <p className="mt-[var(--space-2)] text-center text-[length:var(--text-sm)] text-[var(--text-secondary)]">
            Forgot your password?{' '}
            <Link className="font-medium underline" href="/forgot-password">
              Reset it
            </Link>
          </p>
        </section>
      </main>
      <StorefrontFooter {...footerProps} />
    </div>
  )
}
