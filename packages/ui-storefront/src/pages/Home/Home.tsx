import { StorefrontLayout } from '../../layouts'
import {
  CategorySection,
  FlashSaleSection,
  HeroSection,
  homeContent,
  ProductShelf,
  RecommendedSection,
  TrendingShopsSection,
  TrustSection,
  VoucherSection,
} from '../../organisms'
import type { HomeProps } from './Home.types'

export function Home({ content = {} }: HomeProps) {
  const data = { ...homeContent, ...content }
  const featuredSections =
    data.featuredSections.length > 0
      ? data.featuredSections
      : [
          { title: 'Electronics top picks', products: data.electronics },
          { title: 'Fashion edit', products: data.fashion },
        ]

  return (
    <StorefrontLayout>
      <StorefrontLayout.Content>
        <div className="space-y-10">
          <HeroSection {...data.hero} />
          <CategorySection categories={data.categories} />
          <VoucherSection vouchers={data.vouchers} />
          <FlashSaleSection products={data.flashSale} />
          <TrustSection items={data.trustItems} />
          {featuredSections.map((section) => (
            <ProductShelf
              key={section.title}
              title={section.title}
              {...(section.description ? { description: section.description } : {})}
              products={section.products}
            />
          ))}
          <TrendingShopsSection shops={data.shops} />
          <RecommendedSection products={data.recommended} />
          <ProductShelf
            title="New arrivals"
            description="Fresh picks from verified shops, added this week."
            products={data.newArrivals}
          />
        </div>
      </StorefrontLayout.Content>
    </StorefrontLayout>
  )
}
