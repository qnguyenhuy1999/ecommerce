'use client'

import { AuditLog } from '@ecom/ui-admin'
import { useAuditLogAdapter } from '@/features/audit-logs/hooks/use-audit-log-adapter'
import { stripAdapterMeta } from '@/lib/adapter-utils'

export function AuditLogPageClient() {
  return <AuditLog {...stripAdapterMeta(useAuditLogAdapter())} />
}
