import { Button, Card, Typography } from '@ecom/core-ui'
import { BadgeCheck, Star } from 'lucide-react'
import { PromotionalBadge } from '../../atoms/PromotionalBadge'

export interface ShopCardProps {
  name: string
  imageUrl: string
  rating: string
  followers: string
  mall?: boolean
  verified?: boolean
}

export function ShopCard({
  name,
  imageUrl,
  rating,
  followers,
  mall = false,
  verified = false,
}: ShopCardProps) {
  return (
    <Card className="min-w-64 gap-0 py-0">
      <div className="h-20 bg-primary" />
      <div className="-mt-9 space-y-4 p-4">
        <img
          className="size-16 rounded-full border-2 border-card object-cover"
          src={imageUrl}
          alt=""
          aria-hidden="true"
        />
        <div className="flex items-center gap-2">
          <Typography variant="label" className="font-semibold">
            {name}
          </Typography>
          {verified && <BadgeCheck className="size-4 text-info" />}
          {mall && <PromotionalBadge kind="mall" label="MALL" />}
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-warning">
            <Star className="size-4 fill-current" />
            <Typography variant="caption" className="text-muted-foreground">
              {rating}
            </Typography>
          </span>
          <Typography variant="caption" className="text-muted-foreground">
            {followers} followers
          </Typography>
        </div>
        <Button variant="outline" className="w-full border-primary text-primary">
          Follow shop
        </Button>
      </div>
    </Card>
  )
}
