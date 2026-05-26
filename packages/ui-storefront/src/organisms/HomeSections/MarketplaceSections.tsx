import { Card, Typography } from '@ecom/core-ui'
import { Clock3, Flame } from 'lucide-react'
import {
  CategoryTile,
  ProductCard,
  SectionHeading,
  ShopCard,
  TrustItem,
  VoucherCard,
} from '../../molecules'
import type {
  ProductCardData,
  ShopCardProps,
  TrustItemProps,
  VoucherCardProps,
  CategoryTileProps,
} from '../../molecules'

export function CategorySection({ categories }: { categories: CategoryTileProps[] }) {
  return (
    <section className="space-y-5">
      <Typography variant="h3">Shop by category</Typography>
      <Card className="no-scrollbar flex-row justify-between gap-7 overflow-x-auto p-7 py-7">
        {categories.map((category) => (
          <CategoryTile key={category.label} {...category} />
        ))}
      </Card>
    </section>
  )
}

export function VoucherSection({ vouchers }: { vouchers: VoucherCardProps[] }) {
  return (
    <section>
      <SectionHeading
        title="Collect vouchers"
        description="Stack platform and shop vouchers at checkout."
        actionLabel="See all"
      />
      <div className="no-scrollbar flex gap-3 overflow-x-auto">
        {vouchers.map((voucher) => (
          <VoucherCard key={voucher.code} {...voucher} />
        ))}
      </div>
    </section>
  )
}

export function FlashSaleSection({ products }: { products: ProductCardData[] }) {
  return (
    <section className="bg-card overflow-hidden rounded-3xl border">
      <div className="bg-primary text-primary-foreground flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="flex items-center gap-3">
          <span className="bg-primary-foreground/20 flex size-12 items-center justify-center rounded-xl">
            <Flame className="size-6" />
          </span>
          <div>
            <Typography variant="h4">Flash Sale</Typography>
            <Typography variant="caption">ENDS IN</Typography>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock3 className="size-4" />
          {['03', '27', '32'].map((unit) => (
            <span
              key={unit}
              className="bg-primary-foreground/20 rounded-md px-2 py-1 text-sm font-semibold"
            >
              {unit}
            </span>
          ))}
        </div>
      </div>
      <div className="no-scrollbar flex gap-3 overflow-x-auto p-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} compact />
        ))}
      </div>
    </section>
  )
}

export function TrustSection({ items }: { items: TrustItemProps[] }) {
  return (
    <Card className="grid gap-7 p-6 py-6 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <TrustItem key={item.title} {...item} />
      ))}
    </Card>
  )
}

export function ProductShelf({
  title,
  description,
  products,
  icon,
}: {
  title: string
  description?: string
  products: ProductCardData[]
  icon?: typeof Flame
}) {
  return (
    <section>
      <SectionHeading
        title={title}
        {...(description ? { description } : {})}
        {...(icon ? { icon } : {})}
      />
      <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
        {products.map((product) => (
          <div key={product.id} className="w-48 shrink-0 sm:w-52">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  )
}

export function TrendingShopsSection({ shops }: { shops: ShopCardProps[] }) {
  return (
    <section>
      <SectionHeading title="Trending shops" />
      <div className="no-scrollbar flex gap-3 overflow-x-auto">
        {shops.map((shop) => (
          <ShopCard key={shop.name} {...shop} />
        ))}
      </div>
    </section>
  )
}

export function RecommendedSection({ products }: { products: ProductCardData[] }) {
  return (
    <ProductShelf
      title="Recommended for you"
      description="Updated daily based on what shoppers love."
      products={products}
      icon={Flame}
    />
  )
}
