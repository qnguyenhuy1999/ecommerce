/**
 * Generic status mapper types.
 * Domain-specific status values and mappings stay in the domain layer.
 */

export type StatusVariant = 'default' | 'success' | 'warning' | 'danger' | 'info'

export interface StatusMapping {
  [key: string]: {
    label: string
    variant: StatusVariant
  }
}

export const DEFAULT_STATUS_MAPPING: StatusMapping = {
  PENDING: { label: 'Pending', variant: 'warning' },
  ACTIVE: { label: 'Active', variant: 'success' },
  INACTIVE: { label: 'Inactive', variant: 'default' },
  DELETED: { label: 'Deleted', variant: 'danger' },
}

export function mapStatus<T extends string>(
  status: T,
  mapping: StatusMapping = DEFAULT_STATUS_MAPPING,
): { label: string; variant: StatusVariant } {
  return mapping[status] ?? { label: status, variant: 'default' }
}
