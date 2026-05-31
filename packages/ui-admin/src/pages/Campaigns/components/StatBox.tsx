import { Typography } from '@ecom/core-ui/atoms/Typography'

interface StatBoxProps {
  label: string
  value: string
}

export function StatBox({ label, value }: StatBoxProps) {
  return (
    <div className="border-border flex flex-1 flex-col gap-0.5 rounded-lg border p-2">
      <Typography variant="caption" className="text-muted-foreground leading-none">
        {label}
      </Typography>
      <Typography variant="body-sm" className="leading-tight font-semibold">
        {value}
      </Typography>
    </div>
  )
}
