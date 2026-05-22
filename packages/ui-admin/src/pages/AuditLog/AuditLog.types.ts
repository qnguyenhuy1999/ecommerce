export type AuditLogActorRole = 'Admin' | 'Moderator' | 'Support'

export type AuditLogResource =
  | 'Seller'
  | 'Product'
  | 'Order'
  | 'User'
  | 'Setting'
  | 'Dispute'
  | 'Campaign'
  | 'Role'
  | 'Session'

export type AuditLogDateRange = 'LAST_7_DAYS' | 'LAST_30_DAYS' | 'LAST_90_DAYS' | 'ALL_TIME'

export interface AuditLogFilterOption<TValue extends string = string> {
  value: TValue
  label: string
}

export interface AuditLogEntry {
  id: string
  timestampLabel: string
  timestamp: string
  actorName: string
  actorRole: AuditLogActorRole
  action: string
  resource: AuditLogResource
  target: string
  ip: string
}

export interface AuditLogProps {
  title?: string
  description?: string
  searchPlaceholder?: string
  exportLabel?: string
  emptyStateMessage?: string
  actorOptions?: AuditLogFilterOption<'ALL' | AuditLogActorRole>[]
  resourceOptions?: AuditLogFilterOption<'ALL' | AuditLogResource>[]
  actionOptions?: AuditLogFilterOption<'ALL' | string>[]
  dateRangeOptions?: AuditLogFilterOption<AuditLogDateRange>[]
  items?: AuditLogEntry[]
  onExport?: (() => void | Promise<void>) | undefined
}
