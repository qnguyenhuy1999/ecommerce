'use client'

import React from 'react'

import { Send, CheckCircle2 } from 'lucide-react'

import { cn, Input, Button } from '@ecom/ui'

export interface NewsletterSignupProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  placeholder?: string
  onSubscribe?: (email: string) => Promise<void> | void
}

function NewsletterSignup({
  title = 'Join our newsletter',
  description = 'Sign up for updates, new arrivals and insider-only discounts.',
  placeholder = 'Your email address',
  onSubscribe,
  className,
  ...props
}: NewsletterSignupProps) {
  const [email, setEmail] = React.useState('')
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) return

    try {
      setStatus('loading')
      if (onSubscribe) {
        await onSubscribe(email)
      } else {
        // Simulate network request if no handler provided
        await new Promise((r) => setTimeout(r, 1000))
      }
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className={cn('newsletter max-w-4xl mx-auto', className)} {...props}>
      <h2 className="text-3xl font-bold tracking-tight mb-3">{title}</h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">{description}</p>

      {status === 'success' ? (
        <div className="flex flex-col items-center justify-center p-4 animate-in slide-in-from-bottom-2 fade-in duration-[var(--motion-normal)] fill-mode-both">
          <div className="w-12 h-12 bg-success-muted rounded-full flex items-center justify-center mb-3">
            <CheckCircle2 className="w-6 h-6 text-success" />
          </div>
          <p className="font-semibold">Thanks for subscribing!</p>
          <p className="text-sm text-muted-foreground mt-1">Keep an eye on your inbox.</p>
          <Button
            variant="ghost"
            className="mt-4"
            onClick={() => {
              setStatus('idle')
            }}
          >
            Subscribe another email
          </Button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto relative"
        >
          <div className="flex-1 relative">
            <Input
              type="email"
              required
              placeholder={placeholder}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              className="h-12 rounded-full pl-5 pr-4 bg-background border-transparent shadow-sm focus-visible:ring-brand"
              disabled={status === 'loading'}
            />
          </div>
          <Button
            type="submit"
            variant="brand"
            className="h-12 rounded-full px-8 shrink-0 font-semibold text-sm shadow-md"
            disabled={status === 'loading' || !email.includes('@')}
          >
            {status === 'loading' ? (
              'Subscribing...'
            ) : (
              <>
                Subscribe
                <Send className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </form>
      )}
    </div>
  )
}

export { NewsletterSignup }
