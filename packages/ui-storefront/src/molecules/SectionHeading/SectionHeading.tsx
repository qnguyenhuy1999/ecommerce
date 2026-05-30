import { Button } from '@ecom/core-ui/atoms/Button'
import { Typography } from '@ecom/core-ui/atoms/Typography'
import { ArrowRight, type LucideIcon } from 'lucide-react'

interface SectionHeadingProps {
  title: string
  description?: string
  actionLabel?: string
  icon?: LucideIcon
}

export function SectionHeading({
  title,
  description,
  actionLabel = 'View all',
  icon: Icon,
}: SectionHeadingProps) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="text-primary size-5" />}
          <Typography variant="h3" className="text-foreground">
            {title}
          </Typography>
        </div>
        {description && (
          <Typography variant="muted" className="text-muted-foreground">
            {description}
          </Typography>
        )}
      </div>
      <Button variant="link" size="sm" className="hidden shrink-0 sm:inline-flex">
        {actionLabel}
        <ArrowRight />
      </Button>
    </div>
  )
}

export type { SectionHeadingProps }
