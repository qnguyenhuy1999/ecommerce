import { Badge, Button, Typography } from '@ecom/core-ui'
import { ArrowRight, Star, WandSparkles } from 'lucide-react'
import type { HeroContent } from './HomeSections.types'

export function HeroSection({ eyebrow, title, highlight, description, gallery }: HeroContent) {
  return (
    <section className="bg-card grid gap-8 rounded-3xl border p-6 lg:grid-cols-2 lg:p-8">
      <div className="flex flex-col justify-center gap-5">
        <Badge className="bg-primary-soft text-primary">
          <WandSparkles data-icon="inline-start" />
          {eyebrow}
        </Badge>
        <Typography variant="h1" className="text-4xl font-bold sm:text-5xl">
          {title} <span className="text-primary">{highlight}</span>
          <br />
          {description}
        </Typography>
        <Typography variant="body" className="text-muted-foreground max-w-xl">
          Verified shops · flash deals every hour · free-ship vouchers for new accounts. Built for
          the way you actually shop.
        </Typography>
        <div className="flex flex-wrap gap-3">
          <Button size="lg">
            Start browsing <ArrowRight />
          </Button>
          <Button variant="outline" size="lg">
            Open a shop
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <span className="flex items-center gap-1">
            <Star className="text-warning size-4 fill-current" />
            <Typography variant="label">4.9</Typography>
          </span>
          <Typography variant="caption" className="text-muted-foreground">
            2.1M reviews
          </Typography>
          <Typography variant="caption" className="font-semibold">
            120k+ verified shops
          </Typography>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {gallery.map((image, index) => (
          <img
            key={image}
            className={
              index === 1
                ? 'row-span-2 h-full rounded-2xl object-cover'
                : 'aspect-square rounded-2xl object-cover'
            }
            src={image}
            alt=""
            aria-hidden="true"
          />
        ))}
      </div>
    </section>
  )
}
