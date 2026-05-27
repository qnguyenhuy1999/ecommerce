import { Typography } from '@ecom/core-ui'
import type { LucideIcon } from 'lucide-react'

export interface CategoryTileProps {
  label: string
  icon?: LucideIcon
}

export function CategoryTile({ label, icon: Icon }: CategoryTileProps) {
  return (
    <a href="#" className="group flex min-w-20 flex-col items-center gap-3 text-center">
      {Icon ? (
        <span className="bg-primary-soft text-primary group-hover:bg-primary group-hover:text-primary-foreground flex size-14 items-center justify-center rounded-full transition-colors">
          <Icon className="size-6" />
        </span>
      ) : null}
      <Typography variant="label" className="text-foreground">
        {label}
      </Typography>
    </a>
  )
}
