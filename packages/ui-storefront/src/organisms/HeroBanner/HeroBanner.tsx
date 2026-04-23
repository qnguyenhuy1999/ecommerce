import { cn, buttonVariants } from '@ecom/ui'

export interface HeroBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  subtitle?: string
  eyebrow?: string
  ctaLabel?: string
  ctaHref?: string
  secondaryCtaLabel?: string
  secondaryCtaHref?: string
  backgroundImage?: string
  backgroundImageMobile?: string
  backgroundImageAlt?: string
  overlay?: boolean
  align?: 'left' | 'center' | 'right'
  size?: 'sm' | 'md' | 'lg' | 'full'
}

function HeroBanner({
  title,
  subtitle,
  eyebrow,
  ctaLabel,
  ctaHref = '#',
  secondaryCtaLabel,
  secondaryCtaHref = '#',
  backgroundImage,
  backgroundImageMobile,
  backgroundImageAlt,
  overlay = true,
  align = 'center',
  size = 'lg',
  className,
  ...props
}: HeroBannerProps) {
  const alignClass = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  }[align]

  const sizeClass = {
    sm: 'min-h-[18rem] md:min-h-[22rem]',
    md: 'min-h-[22rem] md:min-h-[28rem]',
    lg: 'min-h-[26rem] md:min-h-[36rem]',
    full: 'min-h-[100svh]',
  }[size]

  return (
    <div
      className={cn(
        'hero-banner relative w-full bg-muted overflow-hidden flex flex-col',
        sizeClass,
        className,
      )}
      {...props}
    >
      {backgroundImage && (
        <picture>
          {backgroundImageMobile && (
            <source srcSet={backgroundImageMobile} media="(max-width: var(--space-96))" />
          )}
          <img
            src={backgroundImage}
            alt={backgroundImageAlt ?? title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </picture>
      )}

      {overlay && <div className="hero-banner__overlay" />}

      <div
        className={cn(
          'relative z-10 w-full max-w-[var(--storefront-content-max-width)] mx-auto flex-1 flex justify-center flex-col px-6 md:px-12 py-12 md:py-20',
          alignClass,
        )}
      >
        {eyebrow && (
          <p className="text-sm sm:text-base font-semibold tracking-[0.15em] uppercase text-white/70 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-[var(--motion-slow)] fill-mode-both">
            {eyebrow}
          </p>
        )}

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl leading-[1.05] mb-5 animate-in fade-in slide-in-from-bottom-8 duration-[var(--motion-slow)] fill-mode-both [text-shadow:var(--text-shadow-md)]">
          {title}
        </h1>

        {subtitle && (
          <p
            className="text-lg md:text-xl text-white/85 max-w-2xl mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-[var(--motion-slow)] fill-mode-both [animation-delay:100ms]"
          >
            {subtitle}
          </p>
        )}

        {(ctaLabel || secondaryCtaLabel) && (
          <div
            className="flex flex-wrap items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-[var(--motion-slow)] fill-mode-both [animation-delay:200ms]"
          >
            {ctaLabel && (
              <a
                href={ctaHref}
                className={cn(
                  buttonVariants({ size: 'xl' }),
                  'shadow-[var(--elevation-modal)] hover:shadow-[var(--elevation-dropdown)] transition-shadow',
                )}
              >
                {ctaLabel}
              </a>
            )}
            {secondaryCtaLabel && (
              <a
                href={secondaryCtaHref}
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'xl' }),
                  'border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-white/50 shadow-sm',
                )}
              >
                {secondaryCtaLabel}
              </a>
            )}
          </div>
        )}
      </div>

      {/* Scroll indicator — only on full-height banners */}
      {size === 'full' && (
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 animate-in fade-in duration-[var(--motion-slow)] fill-mode-both [animation-delay:600ms]"
        >
          <span className="text-white/50 text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-white/30 flex items-start justify-center p-1">
            <div className="w-1 h-1.5 rounded-full bg-white/70 animate-bounce" />
          </div>
        </div>
      )}
    </div>
  )
}

export { HeroBanner }
