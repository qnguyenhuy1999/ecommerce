import { ConsolePageLayout } from '@ecom/core-ui'
import { orderDetailDefaultProps } from './OrderDetail.fixtures'
import { EmptyState, LoadingState, OrderDetailActions } from './OrderDetail.client'
import {
  OrderActivityAndTotals,
  OrderDetailSidebar,
  OrderItemsSection,
  OrderSummarySection,
} from './OrderDetail.server'
import { ensureAuditLogs } from './OrderDetail.utils'
import type { OrderDetailProps } from './OrderDetail.types'

export function OrderDetail({
  title = orderDetailDefaultProps.title,
  description = orderDetailDefaultProps.description,
  breadcrumb = orderDetailDefaultProps.breadcrumb,
  backHref = orderDetailDefaultProps.backHref,
  order = orderDetailDefaultProps.order,
  loading = orderDetailDefaultProps.loading,
  statusActions = orderDetailDefaultProps.statusActions,
  emptyMessage = orderDetailDefaultProps.emptyMessage,
  onStatusAction,
  actionInFlight = orderDetailDefaultProps.actionInFlight,
}: OrderDetailProps) {
  if (loading) {
    return (
      <ConsolePageLayout title={title} description={description} breadcrumb={breadcrumb}>
        <LoadingState />
      </ConsolePageLayout>
    )
  }

  const resolvedOrder = order ?? null

  if (!resolvedOrder) {
    return (
      <ConsolePageLayout title={title} description={description} breadcrumb={breadcrumb}>
        <EmptyState message={emptyMessage} />
      </ConsolePageLayout>
    )
  }

  const auditLogs = ensureAuditLogs(resolvedOrder.auditLogs)
  const optionalActionProps = {
    ...(onStatusAction ? { onStatusAction } : {}),
  }

  return (
    <ConsolePageLayout
      title={resolvedOrder.orderNumber}
      description={description}
      breadcrumb={breadcrumb}
      actions={
        <OrderDetailActions
          backHref={backHref}
          statusActions={statusActions ?? []}
          actionInFlight={actionInFlight ?? null}
          {...optionalActionProps}
        />
      }
      aside={<OrderDetailSidebar order={resolvedOrder} />}
    >
      <div className="space-y-4">
        <OrderSummarySection order={resolvedOrder} />
        <OrderItemsSection order={resolvedOrder} />
        <OrderActivityAndTotals order={resolvedOrder} auditLogs={auditLogs} />
      </div>
    </ConsolePageLayout>
  )
}
