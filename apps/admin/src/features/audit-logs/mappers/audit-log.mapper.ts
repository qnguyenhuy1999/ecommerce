import { formatDateTime } from '@ecom/shared/utils/format'
import type { AuditLogEntry, AuditLogResource } from '@ecom/ui-admin/pages/AuditLog'
import type { AuditLog } from '../api/audit-logs.api'

function toAuditLogResource(entityType: string | null): AuditLogResource {
  const map: Record<string, AuditLogResource> = {
    Seller: 'Seller',
    seller: 'Seller',
    Product: 'Product',
    product: 'Product',
    Order: 'Order',
    order: 'Order',
    User: 'User',
    user: 'User',
    Setting: 'Setting',
    setting: 'Setting',
    Dispute: 'Dispute',
    dispute: 'Dispute',
    Campaign: 'Campaign',
    campaign: 'Campaign',
    Role: 'Role',
    role: 'Role',
    Session: 'Session',
    session: 'Session',
  }
  return map[entityType ?? ''] ?? 'User'
}

export function mapAuditLogToEntry(log: AuditLog): AuditLogEntry {
  const actorName = log.admin
    ? `${log.admin.firstName} ${log.admin.lastName}`.trim() || log.admin.email
    : 'System'

  return {
    id: log.id,
    timestampLabel: formatDateTime(log.createdAt),
    timestamp: log.createdAt,
    actorName,
    actorRole: 'Admin',
    action: log.action,
    resource: toAuditLogResource(log.entityType),
    target: log.entityId ?? '—',
    ip: log.ipAddress ?? '—',
  } satisfies AuditLogEntry
}
