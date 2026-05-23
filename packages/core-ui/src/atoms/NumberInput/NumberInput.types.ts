export interface NumberInputProps extends Omit<
  React.ComponentProps<'input'>,
  'value' | 'onChange'
> {
  value: number | ''
  onChange: (value: number | '') => void
  min?: number
  max?: number
  step?: number
  locale?: string
}
