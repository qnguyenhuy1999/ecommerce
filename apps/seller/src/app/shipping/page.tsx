'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '../../components/dashboard-layout'
import { api } from '../../lib/api'
import { Shipping } from '@ecom/ui-seller'
import type { ShippingProviderRow } from '@ecom/ui-seller'

interface ApiProvider {
  id: string
  name: string
  code: string
  isActive: boolean
}

interface ApiMethod {
  id: string
  providerId: string
  isEnabled: boolean
}

interface ProvidersResponse {
  data: ApiProvider[]
}

interface MethodsResponse {
  data: ApiMethod[]
}

interface ToggleResponse {
  data: ApiMethod
}

function mergeProviders(providers: ApiProvider[], methods: ApiMethod[]): ShippingProviderRow[] {
  return providers.map((p) => ({
    id: p.id,
    name: p.name,
    code: p.code,
    isEnabled: methods.some((m) => m.providerId === p.id && m.isEnabled),
  }))
}

export default function ShippingPage() {
  const [rows, setRows] = useState<ShippingProviderRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [providersRes, methodsRes] = await Promise.all([
          api<ProvidersResponse>('/shipping/providers'),
          api<MethodsResponse>('/shipping/methods'),
        ])
        setRows(mergeProviders(providersRes.data, methodsRes.data))
      } catch {
        /* empty */
      } finally {
        setLoading(false)
      }
    }
    void fetchData()
  }, [])

  const handleToggle = async (providerId: string, enabled: boolean) => {
    try {
      const res = await api<ToggleResponse>(`/shipping/methods/${providerId}/toggle`, {
        method: 'POST',
        body: JSON.stringify({ isEnabled: enabled }),
      })
      setRows((prev) =>
        prev.map((r) => (r.id === providerId ? { ...r, isEnabled: res.data.isEnabled } : r)),
      )
    } catch {
      /* empty */
    }
  }

  return (
    <DashboardLayout>
      <Shipping
        rows={rows}
        loading={loading}
        onToggle={(providerId, enabled) => {
          void handleToggle(providerId, enabled)
        }}
      />
    </DashboardLayout>
  )
}
