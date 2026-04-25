'use client'

import React from 'react'

import { Send, CheckCircle2, Mail } from 'lucide-react'

import { cn, Button } from '@ecom/ui'

export interface NewsletterSignupProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  placeholder?: string
  onSubscribe?: (email: string) => Promise<void> | void
  /** When true, renders without a card surface (e.g. when placed inside a coloured section). */
  bare?: boolean
}

function NewsletterSignup({
  title = 'Join our newsletter',
  description = 'Get early access to new arrivals, members-only sales and styling tips. Unsubscribe anytime.',
  placeholder = 'Your email address',
  onSubscribe,
  bare = false,
  className,
  ...props
}: NewsletterSignupProps) {
  const [email, setEmail] = React.useState('')
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      setStatus('error')
      return
    }

    try {
      setStatus('loading')
      if (onSubscribe) {
        await onSubscribe(email)
      } else {
        await new Promise((r) => setTimeout(r, 800))
      }
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div
      className={cn(
        'mx-auto w-full',
        bare
          ? 'max-w-2xl'
          : cn(
              'max-w-3xl rounded-[var(--radius-2xl)]',
              'border border-[var(--border-subtle)] bg-[var(--surface-base)]',
              'px-[var(--space-6)] py-[var(--space-10)] sm:px-[var(--space-10)] sm:py-[var(--space-12)]',
              'shadow-[var(--elevation-card)]',
            ),
        'text-center',
        className,
      )}
      {...props}
    >
      <div className="mx-auto mb-[var(--space-4)] inline-flex h-11 w-11 items-center justify-center rounded-full bg-[rgb(var(--brand-500-rgb)/0.1)] text-[var(--brand-600)]">
        <Mail className="h-5 w-5" aria-hidden="true" />
      </div>

      <h2 className="text-[length:var(--font-size-heading-lg)] font-bold tracking-[-0.01em] text-[var(--text-primary)]">
        {title}
      </h2>
      <p className="mx-auto mt-[var(--space-2)] max-w-md text-[length:var(--text-sm)] leading-[var(--line-height-relaxed)] text-[var(--text-secondary)]">
        {description}
      </p>

      {status === 'success' ? (
        <div className="mt-[var(--space-6)] flex flex-col items-center animate-in fade-in slide-in-from-bottom-2 duration-[var(--motion-normal)] fill-mode-both">
          <div className="mb-[var(--space-3)] flex h-11 w-11 items-center justify-center rounded-full bg-[var(--intent-success-muted)] text-[var(--intent-success)]">
            <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
          </div>
          <p className="text-[length:var(--text-sm)] font-semibold text-[var(--text-primary)]">
            Thanks for subscribing!
          </p>
          <p className="mt-[var(--space-1)] text-[length:var(--text-xs)] text-[var(--text-tertiary)]">
            Keep an eye on your inbox.
          </p>
          <button
            type="button"
            className="mt-[var(--space-3)] text-[length:var(--text-xs)] font-medium text-[var(--text-link)] underline-offset-4 hover:underline"
            onClick={() => setStatus('idle')}
          >
            Subscribe another email
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-[var(--space-6)] flex w-full max-w-md flex-col gap-[var(--space-2)] sm:flex-row"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            placeholder={placeholder}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (status === 'error') setStatus('idle')
            }}
            disabled={status === 'loading'}
            className={cn(
              'h-11 flex-1 rounded-full px-[var(--space-5)]',
              'border border-[var(--border-default)] bg-[var(--surface-base)]',
              'text-[length:var(--text-sm)] text-[var(--text-primary)] placeholder:text-[var(--input-placeholder)]',
              'transition-[border-color,box-shadow] duration-[var(--motion-fast)]',
              'focus:outline-none focus:border-[var(--brand-500)] focus:ring-[var(--focus-ring-width)] focus:ring-[var(--focus-ring-color)]',
              status === 'error' &&
                'border-[var(--intent-danger)] focus:border-[var(--intent-danger)]',
            )}
          />
          <Button
            type="submit"
            variant="brand"
            size="lg"
            className="h-11 rounded-full px-[var(--space-6)] shrink-0"
            disabled={status === 'loading' || !email}
            iconRight={status === 'loading' ? undefined : <Send className="h-4 w-4" />}
          >
            {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
          </Button>
        </form>
      )}

      {status === 'error' && (
        <p className="mt-[var(--space-2)] text-[length:var(--text-xs)] text-[var(--intent-danger)]">
          Please enter a valid email address.
        </p>
      )}
    </div>
  )
}

export { NewsletterSignup }
