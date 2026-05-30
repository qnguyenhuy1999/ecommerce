'use client'

import { AuditLog } from '@ecom/ui-admin/pages/AuditLog'
import { useAuditLogAdapter } from '@/features/audit-logs/hooks/use-audit-log-adapter'
import { stripAdapterMeta } from '@ecom/shared/utils/adapter-utils'

export function AuditLogPageClient() {
  return <AuditLog {...stripAdapterMeta(useAuditLogAdapter())} />
}
