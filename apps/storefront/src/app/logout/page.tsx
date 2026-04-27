'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { authClient } from '@ecom/api-client'
import { Button } from '@ecom/ui'
import { StorefrontFooter, StorefrontHeader } from '@ecom/ui-storefront'

import { useStorefrontChrome } from '@/components/storefront-chrome'

export default function LogoutPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { promoBar, headerProps, footerProps } = useStorefrontChrome()

  const logout = useMutation({
    mutationFn: () => authClient.logout(),
    onSettled: async () => {
      queryClient.clear()
      router.push('/login')
    },
  })

  React.useEffect(() => {
    logout.mutate()
  }, [])

  return (
    <div className="min-h-screen bg-[var(--surface-canvas)] text-[var(--text-primary)]">
      {promoBar}
      <StorefrontHeader {...headerProps} />
      <main className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <h1 className="text-[length:var(--text-2xl)] font-bold">Signing you out…</h1>
        <p className="mt-[var(--space-2)] text-[var(--text-secondary)]">
          Your session is being cleared from this browser.
        </p>
        <Button className="mt-[var(--space-6)]" onClick={() => logout.mutate()}>
          Retry sign out
        </Button>
      </main>
      <StorefrontFooter {...footerProps} />
    </div>
  )
}
