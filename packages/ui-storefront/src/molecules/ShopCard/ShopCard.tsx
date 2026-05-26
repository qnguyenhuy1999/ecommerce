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
      <div className="bg-primary h-20" />
      <div className="-mt-9 space-y-4 p-4">
        <img
          className="border-card size-16 rounded-full border-2 object-cover"
          src={imageUrl}
          alt=""
          aria-hidden="true"
        />
        <div className="flex items-center gap-2">
          <Typography variant="label" className="font-semibold">
            {name}
          </Typography>
          {verified && <BadgeCheck className="text-info size-4" />}
          {mall && <PromotionalBadge kind="mall" label="MALL" />}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-warning flex items-center gap-1">
            <Star className="size-4 fill-current" />
            <Typography variant="caption" className="text-muted-foreground">
              {rating}
            </Typography>
          </span>
          <Typography variant="caption" className="text-muted-foreground">
            {followers} followers
          </Typography>
        </div>
        <Button variant="outline" className="border-primary text-primary w-full">
          Follow shop
        </Button>
      </div>
    </Card>
  )
}
