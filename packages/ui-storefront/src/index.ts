// @ecom/ui-storefront public API (named exports only)
// Atoms
export { AddToCartButton } from './atoms/AddToCartButton/AddToCartButton'
export { CartItem } from './atoms/CartItem/CartItem'
export type { CartItemProps } from './atoms/CartItem/CartItem'
export { PriceDisplay } from './atoms/PriceDisplay/PriceDisplay'
export { PromoBar } from './atoms/PromoBar/PromoBar'
export { Badge } from './atoms/Badge/Badge'
export { QuantityStepper } from './atoms/QuantityStepper/QuantityStepper'
export { Rating } from './atoms/Rating/Rating'
export type { RatingProps } from './atoms/Rating/Rating'
export { StockBadge } from './atoms/StockBadge/StockBadge'
export { StockBadgeClient } from './atoms/StockBadge/StockBadgeClient'
export { TrustBadge } from './atoms/TrustBadge/TrustBadge'
export type {
  TrustBadgeType,
  TrustBadgeProps,
  TrustBadgeGroupProps,
} from './atoms/TrustBadge/TrustBadge'
export { WishlistButton } from './atoms/WishlistButton/WishlistButton'

// Molecules
export { CategoryCard } from './molecules/CategoryCard/CategoryCard'
export { CheckoutStepper } from './molecules/CheckoutStepper/CheckoutStepper'
export type { CheckoutStep, CheckoutStepperProps } from './molecules/CheckoutStepper/CheckoutStepper'
export {
  FilterSidebar,
  FilterGroup,
  FilterCollapse,
  FilterCheckbox,
  FilterRange,
  FilterClear,
} from './molecules/FilterSidebar/FilterSidebar'
export type { FilterGroupSpec, FilterOption, FilterSidebarProps } from './molecules/FilterSidebar/FilterSidebar'
export { FilterSidebarClient } from './molecules/FilterSidebar/FilterSidebarClient'
export {
  ProductCard,
  ProductCardImage,
  ProductCardContent,
  ProductCardTitle,
  ProductCardSubtitle,
  ProductCardBadge,
  ProductCardMeta,
  ProductCardRating,
  ProductCardPrice,
  ProductCardActions,
  ProductCardSwatches,
  ProductCardHighlights,
} from './molecules/ProductCard/ProductCard'
export type { ProductCardProps } from './molecules/ProductCard/ProductCard'
export { ProductCardItem } from './molecules/ProductCard/ProductCardItem'
export type { ProductCardItemProps } from './molecules/ProductCard/ProductCardItem'
export { ReviewCard } from './molecules/ReviewCard/ReviewCard'
export type { ReviewCardProps } from './molecules/ReviewCard/ReviewCard'
export { SearchBar } from './molecules/SearchBar/SearchBar'
export { ShippingProgressBar } from './molecules/ShippingProgressBar/ShippingProgressBar'
export { VariantSelector } from './molecules/VariantSelector/VariantSelector'
export type { VariantSelectorProps } from './molecules/VariantSelector/VariantSelector'
export { VariantOption } from './molecules/VariantSelector/VariantOption'
export type { VariantOptionProps } from './molecules/VariantSelector/VariantOption'

// Organisms
export { CartDrawer } from './organisms/CartDrawer/CartDrawer'
export type { CartDrawerProps, CartItemData } from './organisms/CartDrawer/CartDrawer'
export { CategoryGrid } from './organisms/CategoryGrid/CategoryGrid'
export { HeroBanner } from './organisms/HeroBanner/HeroBanner'
export type { HeroBannerProps } from './organisms/HeroBanner/HeroBanner'
export { NewsletterSignup } from './organisms/NewsletterSignup/NewsletterSignup'
export { ProductCarousel } from './organisms/ProductCarousel/ProductCarousel'
export type { ProductCarouselProps } from './organisms/ProductCarousel/ProductCarousel'
export {
  ProductGallery,
  ProductGalleryMain,
  ProductGalleryThumbnails,
  useProductGallery,
} from './organisms/ProductGallery/ProductGallery'
export { useProductCard } from './molecules/ProductCard/ProductCard'
export { StorefrontSection } from './layouts/shared/StorefrontSection'
export { ProductGrid } from './organisms/ProductGrid/ProductGrid'
export type { Product, ProductGridProps } from './organisms/ProductGrid/ProductGrid'

// Layouts
export { StorefrontFooter } from './layouts/StorefrontFooter/StorefrontFooter'
export { StorefrontHeader } from './layouts/StorefrontHeader/StorefrontHeader'
export { StorefrontShell } from './layouts/StorefrontShell/StorefrontShell'
export { HomePageLayout } from './layouts/HomePageLayout/HomePageLayout'
export type { HomePageLayoutProps, HomeProductRail } from './layouts/HomePageLayout/HomePageLayout'
export { CollectionPageLayout } from './layouts/CollectionPageLayout/CollectionPageLayout'
export type { CollectionPageLayoutProps } from './layouts/CollectionPageLayout/CollectionPageLayout'
export { ProductDetailLayout } from './layouts/ProductDetailLayout/ProductDetailLayout'
export type {
  ProductDetailLayoutProps,
  ProductVariantGroup,
  ShippingProgressConfig,
  RelatedProductsSection,
} from './layouts/ProductDetailLayout/ProductDetailLayout'
