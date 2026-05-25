import type { CategoryTileProps, ProductCardData, ShopCardProps, TrustItemProps, VoucherCardProps } from '../../molecules'

export interface HeroContent {
  eyebrow: string
  title: string
  highlight: string
  description: string
  gallery: string[]
}

export interface HomeContent {
  hero: HeroContent
  categories: CategoryTileProps[]
  vouchers: VoucherCardProps[]
  flashSale: ProductCardData[]
  trustItems: TrustItemProps[]
  electronics: ProductCardData[]
  fashion: ProductCardData[]
  shops: ShopCardProps[]
  recommended: ProductCardData[]
  newArrivals: ProductCardData[]
}
