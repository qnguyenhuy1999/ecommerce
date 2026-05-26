import { Button, Input, Separator, Typography } from '@ecom/core-ui'
import { Globe, Mail, MessageCircle, Send, ShieldCheck, Truck } from 'lucide-react'
import type { StorefrontFooterColumn } from './StorefrontLayout.types'

export function StorefrontFooter({ columns }: { columns: StorefrontFooterColumn[] }) {
  return (
    <footer className="bg-card mt-16 border-t">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2">
            <span className="bg-primary-soft text-primary flex size-11 items-center justify-center rounded-2xl">
              <span className="size-4 rounded-full border-2 border-current" />
            </span>
            <Typography variant="h3" className="border-0 p-0">
              Halo Market
            </Typography>
          </div>
          <Typography variant="muted" className="max-w-sm">
            Discover trusted shops, daily arrivals, and protected shopping for every style.
          </Typography>
          <div className="flex max-w-sm gap-2">
            <Input placeholder="Email for new drops" />
            <Button aria-label="Subscribe">
              <Mail />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" aria-label="Community">
              <MessageCircle />
            </Button>
            <Button variant="outline" size="icon" aria-label="Website">
              <Globe />
            </Button>
            <Button variant="outline" size="icon" aria-label="Updates">
              <Send />
            </Button>
          </div>
        </div>
        {columns.map((column) => (
          <div key={column.title} className="space-y-4">
            <Typography variant="label" className="font-semibold">
              {column.title}
            </Typography>
            <ul className="space-y-3">
              {column.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href ?? '#'}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <Separator />
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-4 py-6 sm:flex-row sm:items-center sm:px-6">
        <Typography variant="caption" className="text-muted-foreground">
          Copyright 2026 Halo Market. All rights reserved.
        </Typography>
        <div className="text-muted-foreground flex flex-wrap items-center gap-5">
          <span className="flex items-center gap-2 text-xs">
            <ShieldCheck className="text-primary size-4" /> Secure payments
          </span>
          <span className="flex items-center gap-2 text-xs">
            <Truck className="text-primary size-4" /> Fast shipping
          </span>
          <a className="text-xs" href="#">
            Privacy
          </a>
          <a className="text-xs" href="#">
            Terms
          </a>
        </div>
      </div>
    </footer>
  )
}
