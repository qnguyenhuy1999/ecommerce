'use client'

import { Shipping } from '@ecom/ui-seller/pages/Shipping'
import { useShippingAdapter } from '@/features/shipping/hooks/use-shipping-adapter'

type ShippingPageClientProps = { initialData?: Parameters<typeof useShippingAdapter>[0] }

export function ShippingPageClient({ initialData }: ShippingPageClientProps) {
  const { loading, rows, onToggle } = useShippingAdapter(initialData)

  return (
    <Shipping
      rows={rows}
      loading={loading}
      onToggle={(providerId, enabled) => {
        void onToggle(providerId, enabled)
      }}
    />
  )
}
