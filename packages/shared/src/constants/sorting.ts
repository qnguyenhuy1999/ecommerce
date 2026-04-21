export type SortDirection = 'asc' | 'desc'

export const SORT_ASC: SortDirection = 'asc'
export const SORT_DESC: SortDirection = 'desc'

export const DEFAULT_SORT_DIRECTION: SortDirection = SORT_DESC

export interface SortOption {
  field: string
  label: string
  direction?: SortDirection
}

export const DEFAULT_SORT_OPTIONS: SortOption[] = [
  { field: 'createdAt', label: 'Date Created', direction: SORT_DESC },
  { field: 'updatedAt', label: 'Last Updated', direction: SORT_DESC },
  { field: 'name', label: 'Name', direction: SORT_ASC },
]

export function getSortParam(field: string, direction: SortDirection = SORT_DESC): string {
  return direction === SORT_ASC ? field : `-${field}`
}

export function parseSortParam(sort: string): {
  field: string
  direction: SortDirection
} {
  const descending = sort.startsWith('-')
  return {
    field: descending ? sort.slice(1) : sort,
    direction: descending ? SORT_DESC : SORT_ASC,
  }
}
