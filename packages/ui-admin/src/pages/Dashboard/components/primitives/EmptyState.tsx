import { Typography } from '@ecom/core-ui/atoms/Typography'

interface EmptyStateProps {
  title: string
  description: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="px-5 py-8 text-center sm:px-6" role="status">
      <div className="font-medium">{title}</div>
      <Typography variant="body-sm" className="text-muted-foreground mt-1">
        {description}
      </Typography>
    </div>
  )
}
