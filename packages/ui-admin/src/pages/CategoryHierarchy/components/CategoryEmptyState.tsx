import { Typography } from '@ecom/core-ui/atoms/Typography'
import { Card, CardContent } from '@ecom/core-ui/molecules/Card'
import { SECTION_CARD_CLASS_NAME } from '../CategoryHierarchy.constants'

interface CategoryEmptyStateProps {
  message: string
}

export function CategoryEmptyState({ message }: CategoryEmptyStateProps) {
  return (
    <Card className={SECTION_CARD_CLASS_NAME}>
      <CardContent className="flex min-h-80 items-center justify-center p-6">
        <Typography variant="body" className="text-muted-foreground">
          {message}
        </Typography>
      </CardContent>
    </Card>
  )
}
