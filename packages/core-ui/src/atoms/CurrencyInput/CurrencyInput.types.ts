export interface CurrencyInputProps extends Omit<
  React.ComponentProps<'input'>,
  'value' | 'onChange'
> {
  value: number | ''
  onChange: (value: number | '') => void
  currency?: string
  locale?: string
  min?: number
  max?: number
}
