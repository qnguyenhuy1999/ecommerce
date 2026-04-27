import { CreditCard, HelpCircle, MapPin, MessageSquare, XCircle } from 'lucide-react'

import { Button, Separator } from '@ecom/ui'
import { cn } from '@ecom/ui/utils'

import { PriceDisplay } from '../../../atoms/PriceDisplay/PriceDisplay'
import type { OrderDetailItem } from '../../../organisms/OrderDetailSection/OrderDetailSection'
import type { ShippingAddress } from '../../../molecules/AddressForm/AddressForm'
import { DashboardCard } from './DashboardCard'

export interface OrderDetailSidebarProps {
  previewItems: OrderDetailItem[]
  remainingCount: number
  subtotal: number
  shippingFee: number
  totalAmount: number
  paymentMethod?: { label: string; last4?: string }
  shippingAddress: ShippingAddress
  onContactSeller?: () => void
  onContactSupport?: () => void
  onCancelOrder?: () => void
}

export function OrderDetailSidebar({
  previewItems,
  remainingCount,
  subtotal,
  shippingFee,
  totalAmount,
  paymentMethod,
  shippingAddress,
  onContactSeller,
  onContactSupport,
  onCancelOrder,
}: OrderDetailSidebarProps) {
  return (
    <aside className="space-y-6 lg:sticky lg:top-[calc(var(--storefront-header-total)+var(--space-6))] lg:self-start">
      <DashboardCard className="p-6">
        <h3 className="mb-4 text-[length:var(--font-size-heading-sm)] font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
          Order summary
        </h3>

        <ul className="mb-5 space-y-3">
          {previewItems.map((item) => (
            <li key={item.id} className="flex items-center gap-3">
              {item.image ? (
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-muted)]">
                  <img
                    src={item.image}
                    alt={item.productName}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-12 w-12 shrink-0 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-muted)]" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                  {item.productName}
                </p>
                <p className="text-[length:var(--text-xs)] text-[var(--text-tertiary)]">
                  Qty {item.quantity}
                </p>
              </div>
              <PriceDisplay price={item.unitPrice * item.quantity} size="sm" />
            </li>
          ))}
          {remainingCount > 0 && (
            <li className="text-[length:var(--text-xs)] text-[var(--text-tertiary)]">
              +{remainingCount} more item{remainingCount === 1 ? '' : 's'}
            </li>
          )}
        </ul>

        <Separator className="bg-[var(--border-subtle)]" />

        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-[var(--text-secondary)]">Subtotal</dt>
            <dd>
              <PriceDisplay price={subtotal} size="sm" />
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[var(--text-secondary)]">Shipping</dt>
            <dd>
              <PriceDisplay price={shippingFee} size="sm" />
            </dd>
          </div>
          <Separator className="my-2 bg-[var(--border-subtle)]" />
          <div className="flex justify-between font-bold">
            <dt className="text-[var(--text-primary)]">Total</dt>
            <dd>
              <PriceDisplay price={totalAmount} size="lg" />
            </dd>
          </div>
        </dl>

        {paymentMethod && (
          <>
            <Separator className="my-4 bg-[var(--border-subtle)]" />
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] bg-[var(--surface-muted)] text-[var(--text-secondary)]">
                <CreditCard className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-[length:var(--text-xs)] uppercase tracking-[0.1em] text-[var(--text-tertiary)]">
                  Paid with
                </p>
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  {paymentMethod.label}
                  {paymentMethod.last4 && (
                    <span className="ml-1 font-mono text-[var(--text-secondary)]">
                      •••• {paymentMethod.last4}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </>
        )}
      </DashboardCard>

      <DashboardCard className="p-6">
        <h3 className="mb-4 text-[length:var(--font-size-heading-sm)] font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
          Need help?
        </h3>
        <div className="space-y-2">
          <Button
            type="button"
            variant="outline"
            size="default"
            className="w-full justify-start gap-2 rounded-[var(--radius-lg)]"
            onClick={onContactSeller}
            disabled={!onContactSeller}
          >
            <MessageSquare className="h-4 w-4" aria-hidden="true" />
            Contact seller
          </Button>
          <Button
            type="button"
            variant="outline"
            size="default"
            className="w-full justify-start gap-2 rounded-[var(--radius-lg)]"
            onClick={onContactSupport}
            disabled={!onContactSupport}
          >
            <HelpCircle className="h-4 w-4" aria-hidden="true" />
            Help with this order
          </Button>
          {onCancelOrder && (
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={onCancelOrder}
              className={cn(
                'w-full justify-start gap-2 rounded-[var(--radius-lg)]',
                'border-[color-mix(in_srgb,var(--intent-danger)_30%,transparent)]',
                'text-[var(--intent-danger)]',
                'hover:bg-[var(--intent-danger-muted)] hover:text-[var(--intent-danger)] hover:border-[var(--intent-danger)]',
              )}
            >
              <XCircle className="h-4 w-4" aria-hidden="true" />
              Cancel order
            </Button>
          )}
        </div>
      </DashboardCard>

      <DashboardCard className="p-6">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--surface-muted)] text-[var(--text-secondary)]">
            <MapPin className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[length:var(--text-xs)] uppercase tracking-[0.1em] text-[var(--text-tertiary)]">
              Shipping to
            </p>
            <address className="not-italic mt-1 space-y-0.5 text-sm leading-[var(--line-height-relaxed)] text-[var(--text-secondary)]">
              <p className="font-semibold text-[var(--text-primary)]">{shippingAddress.fullName}</p>
              <p>{shippingAddress.addressLine1}</p>
              {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
              <p>
                {shippingAddress.city}, {shippingAddress.postalCode}
              </p>
              <p>{shippingAddress.country}</p>
              {shippingAddress.phone && (
                <p className="pt-1 font-mono text-[var(--text-tertiary)]">
                  {shippingAddress.phone}
                </p>
              )}
            </address>
          </div>
        </div>
      </DashboardCard>
    </aside>
  )
}
