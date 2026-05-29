'use client'

import { useEffect, useState } from 'react'
import { Shipping, type ShippingProviderRow } from '@ecom/ui-seller'
import { getShippingBundle, toggleShippingMethod } from '@/features/shipping/api'
import { mapShippingProviders } from '@/features/shipping/mappers'

export default function ShippingPage() {
  const [rows, setRows] = useState<ShippingProviderRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const bundle = await getShippingBundle()
        setRows(mapShippingProviders(bundle.providers, bundle.methods))
      } catch {
        setRows([])
      } finally {
        setLoading(false)
      }
    }

    void fetchData()
  }, [])

  const handleToggle = async (providerId: string, enabled: boolean) => {
    try {
      const response = await toggleShippingMethod(providerId, enabled)
      setRows((current) =>
        current.map((row) =>
          row.id === providerId ? { ...row, isEnabled: response.isEnabled } : row,
        ),
      )
    } catch {
      /* empty */
    }
  }

  return (
    <Shipping
      rows={rows}
      loading={loading}
      onToggle={(providerId, enabled) => {
        void handleToggle(providerId, enabled)
      }}
    />
  )
}
