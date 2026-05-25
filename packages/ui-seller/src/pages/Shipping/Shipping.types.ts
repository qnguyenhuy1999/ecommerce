export interface ShippingProviderRow {
  id: string
  name: string
  code: string
  isEnabled: boolean
}

export interface ShippingProps {
  title?: string
  description?: string
  rows?: ShippingProviderRow[]
  loading?: boolean
  onToggle?: (providerId: string, enabled: boolean) => void
  emptyMessage?: string
}
