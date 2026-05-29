'use client'

import { Shipping } from '@ecom/ui-seller/pages/Shipping'
import { useShippingAdapter } from '@/features/shipping/hooks/use-shipping-adapter'

export default function ShippingPage() {
  const { loading, rows, onToggle } = useShippingAdapter()

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
