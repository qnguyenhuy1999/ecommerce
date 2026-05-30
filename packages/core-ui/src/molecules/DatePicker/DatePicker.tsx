'use client'

import { formatDate } from '@ecom/shared/utils/format'
import { useState } from 'react'
import { Popover } from 'radix-ui'
import { DayPicker } from 'react-day-picker'
import { parseISO, isValid } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../../primitives/ui/button'
import type { DatePickerProps, DateRangePickerProps, DateRangeValue } from './DatePicker.types'

import 'react-day-picker/style.css'

export function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  min,
  max,
  disabled,
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)

  const selected = value && isValid(parseISO(value)) ? parseISO(value) : undefined
  const fromDate = min && isValid(parseISO(min)) ? parseISO(min) : undefined
  const toDate = max && isValid(parseISO(max)) ? parseISO(max) : undefined

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button
          variant="outline"
          data-slot="date-picker-trigger"
          className={cn(
            'w-full justify-start text-left font-normal',
            !selected && 'text-muted-foreground',
            className,
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 size-4 shrink-0" />
          {selected ? formatDate(selected) : placeholder}
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="bg-card border-border z-50 rounded-2xl border p-0 shadow-lg"
          align="start"
          sideOffset={4}
        >
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={(date) => {
              onChange(date ? formatDate(date, 'yyyy-MM-dd') : '')
              setOpen(false)
            }}
            disabled={[
              ...(fromDate ? [{ before: fromDate }] : []),
              ...(toDate ? [{ after: toDate }] : []),
            ]}
            classNames={{
              root: 'p-3',
              month_caption: 'flex justify-center items-center h-7 mb-2 relative',
              caption_label: 'text-sm font-medium',
              nav: 'flex items-center',
              button_previous: 'absolute left-1',
              button_next: 'absolute right-1',
              month_grid: 'w-full border-collapse',
              weekdays: 'flex',
              weekday: 'text-muted-foreground w-9 text-center text-xs font-normal',
              week: 'flex w-full mt-1',
              day: 'h-9 w-9 text-center text-sm p-0 relative',
              day_button:
                'h-9 w-9 rounded-full hover:bg-accent hover:text-accent-foreground focus:outline-none',
              selected:
                '[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary',
              today: '[&>button]:font-semibold',
              outside: 'opacity-50',
              disabled: 'opacity-30 pointer-events-none',
            }}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = 'Pick a date range',
  min,
  max,
  disabled,
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false)

  const from = value?.from && isValid(parseISO(value.from)) ? parseISO(value.from) : undefined
  const to = value?.to && isValid(parseISO(value.to)) ? parseISO(value.to) : undefined
  const fromDate = min && isValid(parseISO(min)) ? parseISO(min) : undefined
  const toDate = max && isValid(parseISO(max)) ? parseISO(max) : undefined

  const label =
    from && to ? `${formatDate(from)} – ${formatDate(to)}` : from ? formatDate(from) : placeholder

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button
          variant="outline"
          data-slot="date-range-picker-trigger"
          className={cn(
            'w-full justify-start text-left font-normal',
            !from && 'text-muted-foreground',
            className,
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 size-4 shrink-0" />
          {label}
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="bg-card border-border z-50 rounded-2xl border p-0 shadow-lg"
          align="start"
          sideOffset={4}
        >
          <DayPicker
            mode="range"
            selected={from || to ? { from, to } : undefined}
            onSelect={(range) => {
              const nextRange: DateRangeValue = {}
              if (range?.from) {
                nextRange.from = formatDate(range.from, 'yyyy-MM-dd')
              }
              if (range?.to) {
                nextRange.to = formatDate(range.to, 'yyyy-MM-dd')
              }
              onChange(nextRange)
            }}
            disabled={[
              ...(fromDate ? [{ before: fromDate }] : []),
              ...(toDate ? [{ after: toDate }] : []),
            ]}
            numberOfMonths={2}
            classNames={{
              root: 'p-3',
              month_caption: 'flex justify-center items-center h-7 mb-2 relative',
              caption_label: 'text-sm font-medium',
              nav: 'flex items-center',
              button_previous: 'absolute left-1',
              button_next: 'absolute right-1',
              month_grid: 'w-full border-collapse',
              weekdays: 'flex',
              weekday: 'text-muted-foreground w-9 text-center text-xs font-normal',
              week: 'flex w-full mt-1',
              day: 'h-9 w-9 text-center text-sm p-0 relative',
              day_button:
                'h-9 w-9 rounded-full hover:bg-accent hover:text-accent-foreground focus:outline-none',
              selected: '[&>button]:bg-primary [&>button]:text-primary-foreground',
              range_middle:
                '[&>button]:bg-accent [&>button]:text-accent-foreground [&>button]:rounded-none',
              today: '[&>button]:font-semibold',
              outside: 'opacity-50',
              disabled: 'opacity-30 pointer-events-none',
            }}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
