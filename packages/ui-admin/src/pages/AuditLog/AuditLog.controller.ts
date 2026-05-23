import { useMemo, useState } from 'react'
import { AUDIT_LOG_REFERENCE_DATE } from './AuditLog.constants'
import type {
  AuditLogActorRole,
  AuditLogDateRange,
  AuditLogEntry,
  AuditLogResource,
} from './AuditLog.types'

function matchesDateRange(timestamp: string, range: AuditLogDateRange): boolean {
  if (range === 'ALL_TIME') return true
  const entryDate = new Date(`${timestamp}T00:00:00Z`)
  const dayDiff = Math.floor(
    (AUDIT_LOG_REFERENCE_DATE.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24),
  )
  switch (range) {
    case 'LAST_7_DAYS':
      return dayDiff <= 7
    case 'LAST_30_DAYS':
      return dayDiff <= 30
    case 'LAST_90_DAYS':
      return dayDiff <= 90
  }
}

export function useAuditLogController({ items }: { items: AuditLogEntry[] }) {
  const [search, setSearch] = useState('')
  const [actorFilter, setActorFilter] = useState<'ALL' | AuditLogActorRole>('ALL')
  const [resourceFilter, setResourceFilter] = useState<'ALL' | AuditLogResource>('ALL')
  const [actionFilter, setActionFilter] = useState<string>('ALL')
  const [dateRange, setDateRange] = useState<AuditLogDateRange>('LAST_7_DAYS')

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()
    return items.filter((item) => {
      const matchesSearch =
        query.length === 0 ||
        item.actorName.toLowerCase().includes(query) ||
        item.action.toLowerCase().includes(query) ||
        item.target.toLowerCase().includes(query)
      const matchesActor = actorFilter === 'ALL' || item.actorRole === actorFilter
      const matchesResource = resourceFilter === 'ALL' || item.resource === resourceFilter
      const matchesAction = actionFilter === 'ALL' || item.action === actionFilter
      const matchesDate = matchesDateRange(item.timestamp, dateRange)
      return matchesSearch && matchesActor && matchesResource && matchesAction && matchesDate
    })
  }, [actionFilter, actorFilter, dateRange, items, resourceFilter, search])

  return {
    state: {
      search,
      actorFilter,
      resourceFilter,
      actionFilter,
      dateRange,
    },
    computed: {
      filteredItems,
    },
    handlers: {
      setSearch,
      setActorFilter,
      setResourceFilter,
      setActionFilter,
      setDateRange,
    },
  }
}
