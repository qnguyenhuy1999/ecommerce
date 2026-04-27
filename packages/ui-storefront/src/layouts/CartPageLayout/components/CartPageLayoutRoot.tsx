import { StorefrontPageShell } from '../../shared/StorefrontPageShell'
import { PageContainer } from '../../shared/PageContainer'
import { CartPageLayoutLoading } from './CartPageLayoutLoading'
import type { StorefrontFooter } from '../../StorefrontFooter/StorefrontFooter'
import type { StorefrontHeader } from '../../StorefrontHeader/StorefrontHeader'

export interface CartPageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  loading?: boolean
  promoBar?: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  headerProps?: React.ComponentProps<typeof StorefrontHeader>
  footerProps?: React.ComponentProps<typeof StorefrontFooter>
  newsletter?: React.ReactNode
}

export function CartPageLayoutRoot({
  children,
  loading = false,
  promoBar,
  header,
  footer,
  headerProps,
  footerProps,
  newsletter,
  className,
  ...props
}: CartPageLayoutProps) {
  if (loading) {
    return (
      <StorefrontPageShell
        className={className}
        promoBar={promoBar}
        header={header}
        footer={footer}
        headerProps={headerProps}
        footerProps={footerProps}
        newsletter={newsletter}
        {...props}
      >
        <CartPageLayoutLoading className={className} {...props} />
      </StorefrontPageShell>
    )
  }

  return (
    <StorefrontPageShell
      className={className}
      promoBar={promoBar}
      header={header}
      footer={footer}
      headerProps={headerProps}
      footerProps={footerProps}
      newsletter={newsletter}
      {...props}
    >
      <PageContainer>
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-[var(--text-primary)]">
          Your Cart
        </h1>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          {children}
        </div>
      </PageContainer>
    </StorefrontPageShell>
  )
}
