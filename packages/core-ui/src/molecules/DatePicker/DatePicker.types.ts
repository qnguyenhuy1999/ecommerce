export interface DatePickerProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  min?: string
  max?: string
  disabled?: boolean
  className?: string
}

export interface DateRangeValue {
  from?: string
  to?: string
}

export interface DateRangePickerProps {
  value?: DateRangeValue
  onChange: (value: DateRangeValue) => void
  placeholder?: string
  min?: string
  max?: string
  disabled?: boolean
  className?: string
}
