import type {
  CategoryTileProps,
  ProductCardData,
  ShopCardProps,
  TrustItemProps,
  VoucherCardProps,
} from '../../molecules'

export interface HeroContent {
  eyebrow: string
  title: string
  highlight: string
  description: string
  gallery: string[]
}

export interface FeaturedShelfContent {
  title: string
  description?: string
  products: ProductCardData[]
}

export interface HomeContent {
  hero: HeroContent
  categories: CategoryTileProps[]
  vouchers: VoucherCardProps[]
  flashSale: ProductCardData[]
  trustItems: TrustItemProps[]
  featuredSections: FeaturedShelfContent[]
  electronics: ProductCardData[]
  fashion: ProductCardData[]
  shops: ShopCardProps[]
  recommended: ProductCardData[]
  newArrivals: ProductCardData[]
}
