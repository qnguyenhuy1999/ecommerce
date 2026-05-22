import { SellerListPage } from '../../organisms'
import { AuditLogClient } from './AuditLog.client'
import { auditLogDefaultProps } from './AuditLog.fixtures'
import type { AuditLogProps } from './AuditLog.types'

export function AuditLog({
  title = auditLogDefaultProps.title,
  description = auditLogDefaultProps.description,
  searchPlaceholder = auditLogDefaultProps.searchPlaceholder,
  exportLabel = auditLogDefaultProps.exportLabel,
  emptyStateMessage = auditLogDefaultProps.emptyStateMessage,
  actorOptions = auditLogDefaultProps.actorOptions,
  resourceOptions = auditLogDefaultProps.resourceOptions,
  actionOptions = auditLogDefaultProps.actionOptions,
  dateRangeOptions = auditLogDefaultProps.dateRangeOptions,
  items = auditLogDefaultProps.items,
  onExport = auditLogDefaultProps.onExport,
}: AuditLogProps) {
  return (
    <SellerListPage
      title={title}
      description={description}
      breadcrumb={[{ label: 'Admin', href: '#' }, { label: 'Audit' }]}
      mainClassName="space-y-5"
    >
      <AuditLogClient
        searchPlaceholder={searchPlaceholder ?? 'Actor, action, target...'}
        exportLabel={exportLabel ?? 'Export CSV'}
        emptyStateMessage={emptyStateMessage ?? 'No log entries match current filters.'}
        actorOptions={actorOptions ?? []}
        resourceOptions={resourceOptions ?? []}
        actionOptions={actionOptions ?? []}
        dateRangeOptions={dateRangeOptions ?? []}
        items={items ?? []}
        onExport={onExport}
      />
    </SellerListPage>
  )
}
