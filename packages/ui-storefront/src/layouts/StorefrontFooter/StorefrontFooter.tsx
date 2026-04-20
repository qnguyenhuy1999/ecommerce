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
  const socialIcons = {
    instagram: <Instagram className="w-4 h-4" />,
    twitter: <Twitter className="w-4 h-4" />,
    facebook: <Facebook className="w-4 h-4" />,
    youtube: <Youtube className="w-4 h-4" />,
  }

  return (
    <footer
      className={cn('bg-surface-muted border-t border-border/50 pt-16 pb-8', className)}
      {...props}
    >
      {newsletter && (
        <div className="max-w-[var(--storefront-content-max-width)] mx-auto px-4 md:px-8 mb-16 border-b border-border/50 pb-16">
          {newsletter}
        </div>
      )}

      <div className="max-w-[var(--storefront-content-max-width)] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2">
            {logo && <div className="mb-5">{logo}</div>}
            {description && (
              <p className="text-muted-foreground text-sm max-w-sm mb-6 leading-relaxed">
                {description}
              </p>
            )}
            {socials.length > 0 && (
              <div className="flex items-center gap-2.5">
                {socials.map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.platform}
                    className={cn(
                      'w-9 h-9 rounded-full border border-border bg-background',
                      'flex items-center justify-center text-muted-foreground',
                      'hover:text-foreground hover:border-foreground hover:shadow-sm',
                      'transition-all duration-[var(--motion-fast)]',
                    )}
                  >
                    {socialIcons[social.platform]}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Link Columns */}
          {columns.map((col, i) => (
            <div key={i}>
              <h3 className="font-semibold text-sm mb-4 text-foreground tracking-wide">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link, j) => (
                  <li key={j}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-[var(--motion-fast)]"
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
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-border/50 gap-4 text-xs text-muted-foreground">
          <p>{copyright}</p>

          {/* Payment method badges */}
          <div className="flex items-center gap-2">
            {['VISA', 'MC', 'AMEX', 'PAYPAL'].map((method) => (
              <div
                key={method}
                className="h-6 px-2 bg-background border border-border rounded flex items-center justify-center text-[length:var(--text-micro)] font-bold text-muted-foreground tracking-wide"
              >
                {method}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export { StorefrontFooter }
