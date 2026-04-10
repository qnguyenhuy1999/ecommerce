export interface FilterOption {
  value: string
  label: string
  count?: number
}

export interface FilterConfig {
  id: string
  label: string
  type: 'checkbox' | 'radio' | 'price-range'
  options?: FilterOption[]
}

export interface FilterSidebarProps {
  filters: FilterConfig[]
  onFilterChange: (filterId: string, values: string[]) => void
  onClear: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}
