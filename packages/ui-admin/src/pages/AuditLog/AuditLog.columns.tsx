import { type DataTableColumn, Typography } from '@ecom/core-ui'
import type { AuditLogEntry } from './AuditLog.types'

export function buildAuditLogColumns(): DataTableColumn<AuditLogEntry>[] {
  return [
    {
      accessorKey: 'timestampLabel',
      header: 'Timestamp',
      cell: ({ row }) => (
        <Typography variant="body-sm" className="text-muted-foreground whitespace-nowrap">
          {row.original.timestampLabel}
        </Typography>
      ),
    },
    {
      id: 'actor',
      header: 'Actor',
      cell: ({ row }) => (
        <div>
          <Typography as="div" variant="label" className="text-foreground whitespace-nowrap">
            {row.original.actorName}
          </Typography>
          <Typography variant="body-sm" className="text-muted-foreground">
            {row.original.actorRole}
          </Typography>
        </div>
      ),
    },
    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }) => (
        <Typography variant="body-sm" className="font-mono">
          {row.original.action}
        </Typography>
      ),
    },
    {
      accessorKey: 'resource',
      header: 'Resource',
    },
    {
      accessorKey: 'target',
      header: 'Target',
    },
    {
      accessorKey: 'ip',
      header: 'IP',
      cell: ({ row }) => (
        <Typography variant="body-sm" className="text-muted-foreground font-mono whitespace-nowrap">
          {row.original.ip}
        </Typography>
      ),
    },
  ]
}
