import { Typography } from '@ecom/core-ui'
import type { LucideIcon } from 'lucide-react'

export interface TrustItemProps {
  title: string
  description: string
  icon: LucideIcon
}

export function TrustItem({ title, description, icon: Icon }: TrustItemProps) {
  return (
    <div className="flex items-center gap-4">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
        <Icon className="size-6" />
      </span>
      <div>
        <Typography variant="label" className="font-semibold">
          {title}
        </Typography>
        <Typography variant="caption" className="text-muted-foreground">
          {description}
        </Typography>
      </div>
    </div>
  )
}
