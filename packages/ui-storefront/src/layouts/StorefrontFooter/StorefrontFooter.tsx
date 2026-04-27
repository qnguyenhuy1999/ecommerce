import { Instagram, Twitter, Facebook, Youtube } from 'lucide-react'

import { cn } from '@ecom/ui'

export interface StorefrontFooterProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode
  description?: string
  /** Newsletter slot — pass <NewsletterSignup /> from the consumer. Layouts must not import organisms. */
  newsletter?: React.ReactNode
  columns?: {
    title: string
    links: { label: string; href: string }[]
  }[]
  socials?: { platform: 'instagram' | 'twitter' | 'facebook' | 'youtube'; href: string }[]
  copyright?: string
}

const socialIcons = {
  instagram: <Instagram className="h-4 w-4" aria-hidden="true" />,
  twitter: <Twitter className="h-4 w-4" aria-hidden="true" />,
  facebook: <Facebook className="h-4 w-4" aria-hidden="true" />,
  youtube: <Youtube className="h-4 w-4" aria-hidden="true" />,
}

const paymentMethods = ['VISA', 'Mastercard', 'AMEX', 'PayPal']

function StorefrontFooter({
  logo,
  description,
  newsletter,
  columns = [],
  socials = [],
  copyright = `© ${new Date().getFullYear()} Ecommerce Inc. All rights reserved.`,
  className,
  ...props
}: StorefrontFooterProps) {
  return (
    <div
      className={cn('w-full bg-[var(--surface-subtle)] text-[var(--text-secondary)]', className)}
      {...props}
    >
      {newsletter && (
        <div className="border-b border-[var(--border-subtle)]">
          <div className="mx-auto w-full max-w-[var(--storefront-content-max-width)] px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            {newsletter}
          </div>
        </div>
      )}

      <div className="mx-auto w-full max-w-[var(--storefront-content-max-width)] px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-12">
          {/* Brand column */}
          <div className="col-span-2 lg:col-span-4">
            {logo && (
              <div className="mb-5 inline-flex items-center text-[var(--text-primary)]">{logo}</div>
            )}
            {description && (
              <p className="max-w-sm text-sm leading-[var(--line-height-relaxed)]">{description}</p>
            )}
            {socials.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center gap-2">
                {socials.map((social) => (
                  <a
                    key={social.platform}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.platform}
                    className={cn(
                      'inline-flex h-9 w-9 items-center justify-center rounded-full',
                      'border border-[var(--border-subtle)] bg-[var(--surface-base)]',
                      'text-[var(--text-secondary)]',
                      'transition-[background-color,border-color,color] duration-[var(--motion-fast)]',
                      'hover:border-[var(--border-default)] hover:text-[var(--text-primary)]',
                      'focus-visible:outline-none focus-visible:ring-[var(--focus-ring-width)] focus-visible:ring-[var(--focus-ring-color)]',
                    )}
                  >
                    {socialIcons[social.platform]}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--text-primary)]">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <a
                      href={link.href}
                      className={cn(
                        'inline-flex text-sm text-[var(--text-secondary)]',
                        'transition-colors duration-[var(--motion-fast)]',
                        'hover:text-[var(--text-primary)]',
                      )}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-4 border-t border-[var(--border-subtle)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[length:var(--text-xs)] text-[var(--text-tertiary)]">{copyright}</p>
          <div className="flex items-center gap-2" aria-label="Accepted payment methods">
            {paymentMethods.map((method) => (
              <span
                key={method}
                className={cn(
                  'inline-flex h-7 items-center justify-center px-2',
                  'rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--surface-base)]',
                  'text-[length:var(--text-micro)] font-bold uppercase tracking-[0.06em] text-[var(--text-tertiary)]',
                )}
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export { StorefrontFooter }
