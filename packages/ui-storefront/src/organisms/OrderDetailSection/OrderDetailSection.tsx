import { Package, MapPin, CreditCard, ExternalLink, ArrowLeft } from 'lucide-react'

import { Button, Separator, Tabs, TabsContent, TabsList, TabsTrigger } from '@ecom/ui'
import { cn } from '@ecom/ui/utils'

import { PriceDisplay } from '../../atoms/PriceDisplay/PriceDisplay'
import { OrderStatusBadge } from '../../atoms/OrderStatusBadge/OrderStatusBadge'
import type { OrderStatus } from '../../atoms/OrderStatusBadge/OrderStatusBadge'
import { OrderTimeline } from '../../molecules/OrderTimeline/OrderTimeline'
import type { TimelineStep, TrackingInfo } from '../../molecules/OrderTimeline/OrderTimeline'
import type { ShippingAddress } from '../../molecules/AddressForm/AddressForm'

export interface OrderDetailItem {
  id: string
  productName: string
  variantSku: string
  attributes: Record<string, string>
  quantity: number
  unitPrice: number
  image?: string
  storeName?: string
}

export interface OrderDetailSubOrder {
  id: string
  storeName: string
  status: OrderStatus
  items: OrderDetailItem[]
  subtotal: number
  trackingInfo?: TrackingInfo
}

export interface OrderDetailSectionProps {
  orderNumber: string
  status: OrderStatus
  createdAt: string
  subtotal: number
  shippingFee: number
  totalAmount: number
  shippingAddress: ShippingAddress
  subOrders: OrderDetailSubOrder[]
  timelineSteps?: TimelineStep[]
  paymentMethod?: { label: string; last4?: string }
  onBack?: () => void
  className?: string
}

function OrderDetailSection({
  orderNumber,
  status,
  createdAt,
  subtotal,
  shippingFee,
  totalAmount,
  shippingAddress,
  subOrders,
  timelineSteps,
  paymentMethod,
  onBack,
  className,
}: OrderDetailSectionProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="h-8 gap-1.5 text-[length:var(--text-xs)] -ml-2 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders
            </Button>
          )}
          <p className="text-[length:var(--text-xs)] text-[var(--text-tertiary)] uppercase tracking-wide font-medium">
            Order
          </p>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] font-mono">
            #{orderNumber}
          </h1>
          <p className="text-[length:var(--text-xs)] text-[var(--text-tertiary)]">
            Placed on {createdAt}
          </p>
        </div>
        <OrderStatusBadge status={status} />
      </div>

      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="timeline" className="gap-1.5 text-[length:var(--text-xs)]">
            <Package className="w-3.5 h-3.5" /> Tracking
          </TabsTrigger>
          <TabsTrigger value="items" className="gap-1.5 text-[length:var(--text-xs)]">
            Items
          </TabsTrigger>
          <TabsTrigger value="details" className="gap-1.5 text-[length:var(--text-xs)]">
            Details
          </TabsTrigger>
        </TabsList>

        {/* Tracking tab */}
        <TabsContent value="timeline" className="mt-6">
          {timelineSteps ? (
            <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-base)] p-6">
              <OrderTimeline steps={timelineSteps} trackingInfo={subOrders[0]?.trackingInfo} />
            </div>
          ) : (
            <p className="text-[var(--text-secondary)] text-sm">
              Tracking information not yet available.
            </p>
          )}
        </TabsContent>

        {/* Items tab */}
        <TabsContent value="items" className="mt-6 space-y-4">
          {subOrders.map((sub) => (
            <div
              key={sub.id}
              className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-base)] overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-3 bg-[var(--surface-muted)]/50 border-b border-[var(--border-subtle)]">
                <p className="text-sm font-semibold text-[var(--text-primary)]">{sub.storeName}</p>
                <OrderStatusBadge status={sub.status} size="sm" />
              </div>
              <div className="p-5 space-y-4">
                {sub.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    {item.image && (
                      <div className="w-14 h-14 rounded-[var(--radius-md)] overflow-hidden bg-[var(--surface-muted)] border border-[var(--border-subtle)] shrink-0">
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                        {item.productName}
                      </p>
                      <p className="text-[length:var(--text-xs)] text-[var(--text-tertiary)] font-mono">
                        {item.variantSku}
                      </p>
                      {Object.entries(item.attributes).length > 0 && (
                        <p className="text-[length:var(--text-xs)] text-[var(--text-secondary)]">
                          {Object.entries(item.attributes)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(' · ')}
                        </p>
                      )}
                      <p className="text-[length:var(--text-xs)] text-[var(--text-secondary)]">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <PriceDisplay price={item.unitPrice * item.quantity} size="sm" />
                  </div>
                ))}
                {sub.trackingInfo && (
                  <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
                    <div className="text-[length:var(--text-xs)] text-[var(--text-secondary)]">
                      <span className="font-medium">{sub.trackingInfo.carrier}:</span>{' '}
                      <span className="font-mono">{sub.trackingInfo.trackingNumber}</span>
                    </div>
                    {sub.trackingInfo.trackingUrl && (
                      <a
                        href={sub.trackingInfo.trackingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[length:var(--text-xs)] text-[var(--action-primary)] flex items-center gap-1 hover:underline"
                      >
                        Track <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </TabsContent>

        {/* Details tab */}
        <TabsContent value="details" className="mt-6 grid gap-4 sm:grid-cols-2">
          {/* Shipping */}
          <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-base)] p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] mb-3">
              <MapPin className="w-4 h-4 text-[var(--action-primary)]" /> Shipping Address
            </h3>
            <address className="not-italic text-sm text-[var(--text-secondary)] space-y-0.5">
              <p className="font-semibold text-[var(--text-primary)]">{shippingAddress.fullName}</p>
              <p>{shippingAddress.addressLine1}</p>
              {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
              <p>
                {shippingAddress.city}, {shippingAddress.postalCode}
              </p>
              <p>{shippingAddress.country}</p>
              <p className="pt-1">{shippingAddress.phone}</p>
            </address>
          </div>

          {/* Payment + Totals */}
          <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-base)] p-5">
            {paymentMethod && (
              <>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] mb-3">
                  <CreditCard className="w-4 h-4 text-[var(--action-primary)]" /> Payment
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  {paymentMethod.label}
                  {paymentMethod.last4 && (
                    <span className="font-mono ml-1">•••• {paymentMethod.last4}</span>
                  )}
                </p>
                <Separator className="mb-4 bg-[var(--border-subtle)]" />
              </>
            )}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Subtotal</span>
                <PriceDisplay price={subtotal} size="sm" />
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Shipping</span>
                <PriceDisplay price={shippingFee} size="sm" />
              </div>
              <Separator className="bg-[var(--border-subtle)]" />
              <div className="flex justify-between font-bold">
                <span className="text-[var(--text-primary)]">Total</span>
                <PriceDisplay price={totalAmount} size="lg" />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export { OrderDetailSection }
