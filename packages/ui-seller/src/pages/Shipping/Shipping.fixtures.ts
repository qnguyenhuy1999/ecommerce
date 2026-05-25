import type { ShippingProps } from './Shipping.types'

export const shippingDefaultProps = {
  title: 'Shipping Providers',
  description: 'Enable or disable shipping carriers for your store.',
  rows: [
    { id: '1', name: 'Express Delivery', code: 'EXPRESS', isEnabled: true },
    { id: '2', name: 'Standard Post', code: 'STANDARD', isEnabled: true },
    { id: '3', name: 'Same-Day Courier', code: 'SAMEDAY', isEnabled: false },
  ],
  loading: false,
  onToggle: (_id: string, _enabled: boolean) => {},
  emptyMessage: 'No shipping providers configured.',
} satisfies Required<ShippingProps>
