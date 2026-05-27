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
  const optionalProps = {
    ...(onToggle ? { onToggle } : {}),
  }
  return (
    <ShippingClient
      title={title}
      description={description}
      rows={rows}
      loading={loading}
      {...optionalProps}
      emptyMessage={emptyMessage}
    />
  )
}
