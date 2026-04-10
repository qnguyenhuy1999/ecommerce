import * as React from 'react'
import { cn } from '@ecom/ui'
import { Button } from '@ecom/ui'
import { Checkbox } from '@ecom/ui'
import { Label } from '@ecom/ui'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@ecom/ui'
import { SlidersHorizontal } from 'lucide-react'
import type { FilterSidebarProps, FilterConfig, FilterOption } from './types'

const FilterSidebarContent = ({
  filters,
  onFilterChange,
  onClear,
  className,
}: Omit<FilterSidebarProps, 'open' | 'onOpenChange'>) => {
  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground text-xs h-7 px-2"
          onClick={onClear}
        >
          Clear all
        </Button>
      </div>

      {/* Filter groups */}
      {filters.map((filter) => (
        <div key={filter.id} className="flex flex-col gap-3">
          <h4 className="text-sm font-medium">{filter.label}</h4>
          {filter.type === 'checkbox' && filter.options && (
            <div className="flex flex-col gap-2">
              {filter.options.map((option) => (
                <div key={option.value} className="flex items-center gap-2">
                  <Checkbox
                    id={`${filter.id}-${option.value}`}
                    value={option.value}
                    onCheckedChange={() => {
                      onFilterChange(filter.id, [option.value])
                    }}
                  />
                  <Label
                    htmlFor={`${filter.id}-${option.value}`}
                    className="text-sm font-normal cursor-pointer flex-1"
                  >
                    {option.label}
                  </Label>
                  {option.count !== undefined && (
                    <span className="text-xs text-muted-foreground">{option.count}</span>
                  )}
                </div>
              ))}
            </div>
          )}
          {filter.type === 'radio' && filter.options && (
            <div className="flex flex-col gap-2">
              {filter.options.map((option) => (
                <div key={option.value} className="flex items-center gap-2">
                  <Checkbox
                    id={`${filter.id}-${option.value}`}
                    value={option.value}
                    onCheckedChange={() => onFilterChange(filter.id, [option.value])}
                  />
                  <Label
                    htmlFor={`${filter.id}-${option.value}`}
                    className="text-sm font-normal cursor-pointer flex-1"
                  >
                    {option.label}
                  </Label>
                  {option.count !== undefined && (
                    <span className="text-xs text-muted-foreground">{option.count}</span>
                  )}
                </div>
              ))}
            </div>
          )}
          {filter.type === 'price-range' && (
            <p className="text-xs text-muted-foreground italic">
              Price range controls coming soon.
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

const FilterSidebar = React.forwardRef<HTMLDivElement, FilterSidebarProps>(
  ({ filters, onFilterChange, onClear, open, onOpenChange, className }, ref) => {
    const isControlled = open !== undefined && onOpenChange !== undefined

    return (
      <>
        {/* Desktop inline sidebar */}
        <div
          ref={ref}
          className={cn('hidden md:block w-56 flex-shrink-0 p-4 border-r bg-background', className)}
        >
          <FilterSidebarContent
            filters={filters}
            onFilterChange={onFilterChange}
            onClear={onClear}
          />
        </div>

        {/* Mobile sheet overlay */}
        {isControlled && open && (
          <Sheet
            open={open}
            onOpenChange={(isOpen) => {
              if (!isOpen) onOpenChange?.(false)
            }}
          >
            <SheetContent className="w-80">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </SheetTitle>
              </SheetHeader>
              <div className="pt-4">
                <FilterSidebarContent
                  filters={filters}
                  onFilterChange={onFilterChange}
                  onClear={onClear}
                />
              </div>
              <SheetFooter className="pt-4">
                <Button variant="default" className="w-full">
                  Apply Filters
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        )}
      </>
    )
  },
)
FilterSidebar.displayName = 'FilterSidebar'

export { FilterSidebar }
export type { FilterSidebarProps, FilterConfig, FilterOption }
