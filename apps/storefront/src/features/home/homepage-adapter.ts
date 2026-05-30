import { formatCurrency, formatDateIntl } from '@ecom/shared/utils/format'
import { homeContent } from '@ecom/ui-storefront/organisms/HomeSections'
import type { HomeContent } from '@ecom/ui-storefront/organisms/HomeSections'
import type { HomepageData } from '../../lib/storefront-contracts'

type ProductCardData = HomeContent['recommended'][number]
type ShopCardProps = HomeContent['shops'][number]
type TrustItemProps = HomeContent['trustItems'][number]
type VoucherCardProps = HomeContent['vouchers'][number]

const fallbackImage = homeContent.hero.gallery[0] ?? '/media/home/camera.png'
const fallbackCategoryIcon = homeContent.categories[0]?.icon
const trustItems: TrustItemProps[] = homeContent.trustItems

function formatHomepageCurrency(value: number) {
  return formatCurrency(value, {
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
    minimumFractionDigits: 0,
  })
}

function formatSoldLabel(reviewCount: number): string | null {
  if (reviewCount <= 0) {
    return null
  }

  if (reviewCount >= 1000) {
    return `${(reviewCount / 1000).toFixed(reviewCount >= 10_000 ? 0 : 1)}k sold`
  }

  return `${reviewCount} sold`
}

function normalizeKey(value: string) {
  return value.trim().toLowerCase().replace('&', '').replaceAll(/\s+/g, '-')
}

type CategoryIcon = NonNullable<(typeof homeContent.categories)[number]['icon']>

function getCategoryIcon(slug: string, name: string): CategoryIcon | undefined {
  const normalizedSlug = normalizeKey(slug)
  const normalizedName = normalizeKey(name)
  const match = homeContent.categories.find((category) => {
    const labelKey = normalizeKey(category.label)
    return labelKey === normalizedSlug || labelKey === normalizedName
  })

  return match?.icon ?? fallbackCategoryIcon
}

function mapProduct(product: HomepageData['recommendedProducts'][number]): ProductCardData {
  const sold = formatSoldLabel(product.reviewCount)

  return {
    id: product.id,
    name: product.name,
    imageUrl: product.coverImage ?? fallbackImage,
    price: formatHomepageCurrency(product.price),
    ...(product.originalPrice !== null
      ? { originalPrice: formatHomepageCurrency(product.originalPrice) }
      : {}),
    ...(product.discountPercent !== null ? { discount: `-${product.discountPercent}%` } : {}),
    ...(product.rating !== null ? { rating: product.rating.toFixed(1) } : {}),
    ...(sold ? { sold } : {}),
    ...(product.stockLeft !== null ? { stockLabel: `${product.stockLeft} left` } : {}),
    flash: product.isFlash,
    freeShipping: false,
    mall: false,
  }
}

function mapFlashProduct(
  product: NonNullable<HomepageData['flashSale']>['products'][number],
): ProductCardData {
  const soldPercent =
    product.totalStock > 0
      ? Math.min(100, Math.round((product.soldCount / product.totalStock) * 100))
      : 0

  return {
    id: product.id,
    name: product.name,
    imageUrl: product.coverImage ?? fallbackImage,
    price: formatHomepageCurrency(product.salePrice),
    originalPrice: formatHomepageCurrency(product.originalPrice),
    discount: `-${product.discountPercent}%`,
    ...(product.rating !== null ? { rating: product.rating.toFixed(1) } : {}),
    sold: `${product.soldCount} sold`,
    soldPercent,
    ...(product.stockLeft > 0 ? { stockLabel: `${product.stockLeft} left` } : {}),
    flash: true,
  }
}

function mapVoucher(voucher: HomepageData['vouchers'][number]): VoucherCardProps {
  const title =
    voucher.type === 'PERCENTAGE'
      ? `${voucher.discountValue}% OFF`
      : `${formatHomepageCurrency(voucher.discountValue)} OFF`

  const minimum =
    voucher.minOrderAmount !== null
      ? `Min spend ${formatHomepageCurrency(voucher.minOrderAmount)}`
      : voucher.maxDiscountAmount !== null
        ? `Cap ${formatHomepageCurrency(voucher.maxDiscountAmount)}`
        : `Expires ${formatDateIntl(voucher.expiresAt)}`

  return {
    title,
    minimum,
    code: voucher.code,
  }
}

function mapShop(shop: HomepageData['trendingShops'][number]): ShopCardProps {
  return {
    name: shop.name,
    imageUrl: shop.banner ?? shop.logo ?? fallbackImage,
    ...(shop.logo !== null ? { verified: true } : {}),
  }
}

export function mapHomepageToHomeContent(homepage: HomepageData): Partial<HomeContent> {
  return {
    hero: homeContent.hero,
    categories: homepage.categories.map((category) => {
      const icon = getCategoryIcon(category.slug, category.name)

      return icon ? { label: category.name, icon } : { label: category.name }
    }),
    vouchers: homepage.vouchers.map(mapVoucher),
    flashSale: homepage.flashSale?.products.map(mapFlashProduct) ?? [],
    trustItems,
    featuredSections: homepage.featuredSections.map((section) => ({
      title: section.title,
      description: `Popular picks in ${section.title}.`,
      products: section.products.map(mapProduct),
    })),
    shops: homepage.trendingShops.map(mapShop),
    recommended: homepage.recommendedProducts.map(mapProduct),
    newArrivals: homepage.newArrivals.map(mapProduct),
  }
}
