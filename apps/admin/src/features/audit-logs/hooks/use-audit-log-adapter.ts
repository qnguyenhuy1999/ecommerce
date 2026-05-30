'use client'

import type { AuditLogProps } from '@ecom/ui-admin/pages/AuditLog'
import { PAGINATION_DEFAULTS } from '@ecom/shared/pagination/core'
import { useAuditLogs } from '../hooks/use-audit-logs'
import { mapAuditLogToEntry } from '../mappers/audit-log.mapper'

export function useAuditLogAdapter(): AuditLogProps & { loading: boolean; error: Error | null } {
  const logsQuery = useAuditLogs({ page: 1, limit: PAGINATION_DEFAULTS.PAGE_SIZE })

  return {
    loading: logsQuery.isPending,
    error: logsQuery.error,
    items: (logsQuery.data?.items ?? []).map(mapAuditLogToEntry),
  }
}
