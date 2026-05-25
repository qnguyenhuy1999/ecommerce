import { ShippingClient } from './Shipping.client'
import { shippingDefaultProps } from './Shipping.fixtures'
import type { ShippingProps } from './Shipping.types'

export function Shipping({
  title = shippingDefaultProps.title,
  description = shippingDefaultProps.description,
  rows = shippingDefaultProps.rows,
  loading = shippingDefaultProps.loading,
  onToggle,
  emptyMessage = shippingDefaultProps.emptyMessage,
}: ShippingProps) {
  return (
    <ShippingClient
      title={title}
      description={description}
      rows={rows}
      loading={loading}
      onToggle={onToggle}
      emptyMessage={emptyMessage}
    />
  )
}
