import type { OrderDetailProps } from './OrderDetail.types'

export type OrderDetailClientProps = Required<
  Pick<
    OrderDetailProps,
    'title' | 'description' | 'breadcrumb' | 'backHref' | 'emptyMessage' | 'loading'
  >
> &
  Pick<OrderDetailProps, 'order' | 'statusActions' | 'onStatusAction' | 'actionInFlight'>

export type OrderRecord = NonNullable<OrderDetailClientProps['order']>
