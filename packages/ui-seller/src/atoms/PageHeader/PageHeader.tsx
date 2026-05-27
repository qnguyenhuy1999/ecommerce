import { Typography } from '@ecom/core-ui'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <Typography as="h1" variant="h3">
          {title}
        </Typography>
        {description ? (
          <Typography as="p" variant="muted" className="mt-1 text-sm">
            {description}
          </Typography>
        ) : null}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
