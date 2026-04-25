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

const alignment: Record<NonNullable<HeroBannerProps['align']>, string> = {
  left: 'items-start text-left',
  center: 'items-center text-center',
  right: 'items-end text-right',
}

const sizing: Record<NonNullable<HeroBannerProps['size']>, string> = {
  sm: 'min-h-[18rem] md:min-h-[22rem]',
  md: 'min-h-[24rem] md:min-h-[30rem]',
  lg: 'min-h-[28rem] md:min-h-[36rem] lg:min-h-[40rem]',
  full: 'min-h-[100svh]',
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
  align = 'left',
  size = 'lg',
  className,
  ...props
}: HeroBannerProps) {
  return (
    <section
      className={cn(
        'hero-banner relative isolate flex w-full overflow-hidden',
        // Subtle brand-tinted gradient as fallback when no image
        'bg-gradient-to-br from-[var(--surface-muted)] via-[var(--surface-base)] to-[rgb(var(--brand-500-rgb)/0.08)]',
        sizing[size],
        className,
      )}
      {...props}
    >
      {backgroundImage && (
        <picture className="absolute inset-0 -z-10">
          {backgroundImageMobile && (
            <source srcSet={backgroundImageMobile} media="(max-width: 24rem)" />
          )}
          <img
            src={backgroundImage}
            alt={backgroundImageAlt ?? ''}
            className="h-full w-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
        </picture>
      )}

      {backgroundImage && overlay && <div className="hero-banner__overlay -z-10" />}

      <div
        className={cn(
          'relative mx-auto flex w-full flex-1 flex-col justify-center',
          'max-w-[var(--storefront-content-max-width)]',
          'px-[var(--space-6)] sm:px-[var(--space-8)] lg:px-[var(--space-12)]',
          'py-[var(--space-12)] md:py-[var(--space-16)] lg:py-[var(--space-20)]',
          alignment[align],
        )}
      >
        {eyebrow && (
          <p
            className={cn(
              'mb-[var(--space-4)] text-[length:var(--text-xs)] font-semibold uppercase tracking-[0.18em]',
              backgroundImage ? 'text-white/80' : 'text-[var(--text-brand)]',
              'animate-in fade-in slide-in-from-bottom-2 duration-[var(--motion-slow)] fill-mode-both',
            )}
          >
            {eyebrow}
          </p>
        )}

        <h1
          className={cn(
            'max-w-3xl tracking-[-0.02em] leading-[1.05]',
            'text-[length:var(--font-size-display-sm)] sm:text-[length:var(--font-size-display-md)] lg:text-[length:var(--font-size-display-lg)]',
            'font-bold',
            backgroundImage
              ? 'text-white [text-shadow:var(--text-shadow-md)]'
              : 'text-[var(--text-primary)]',
            'animate-in fade-in slide-in-from-bottom-4 duration-[var(--motion-slow)] fill-mode-both',
          )}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            className={cn(
              'mt-[var(--space-5)] max-w-xl text-[length:var(--text-base)] sm:text-[length:var(--text-lg)] leading-[var(--line-height-relaxed)]',
              backgroundImage ? 'text-white/85' : 'text-[var(--text-secondary)]',
              'animate-in fade-in slide-in-from-bottom-4 duration-[var(--motion-slow)] fill-mode-both [animation-delay:80ms]',
            )}
          >
            {subtitle}
          </p>
        )}

        {(ctaLabel || secondaryCtaLabel) && (
          <div
            className={cn(
              'mt-[var(--space-8)] flex flex-wrap items-center gap-[var(--space-3)]',
              align === 'center' && 'justify-center',
              align === 'right' && 'justify-end',
              'animate-in fade-in slide-in-from-bottom-4 duration-[var(--motion-slow)] fill-mode-both [animation-delay:160ms]',
            )}
          >
            {ctaLabel && (
              <a
                href={ctaHref}
                className={cn(
                  buttonVariants({ variant: 'brand', size: 'lg' }),
                  'rounded-full px-[var(--space-7)]',
                )}
              >
                {ctaLabel}
              </a>
            )}
            {secondaryCtaLabel && (
              <a
                href={secondaryCtaHref}
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'rounded-full px-[var(--space-7)]',
                  backgroundImage && 'border-white/40 bg-white/10 text-white hover:bg-white/20',
                )}
              >
                {secondaryCtaLabel}
              </a>
            )}
          </div>
        )}
      </div>

      {/* Scroll indicator on full-height hero */}
      {size === 'full' && (
        <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 animate-in fade-in duration-[var(--motion-slow)] fill-mode-both [animation-delay:600ms]">
          <span
            className={cn(
              'text-[length:var(--text-micro)] tracking-[0.2em] uppercase',
              backgroundImage ? 'text-white/60' : 'text-[var(--text-tertiary)]',
            )}
          >
            Scroll
          </span>
          <div
            className={cn(
              'flex h-8 w-5 items-start justify-center rounded-full border p-1',
              backgroundImage ? 'border-white/35' : 'border-[var(--border-default)]',
            )}
          >
            <div
              className={cn(
                'h-1.5 w-1 animate-bounce rounded-full',
                backgroundImage ? 'bg-white/75' : 'bg-[var(--text-tertiary)]',
              )}
            />
          </div>
        </div>
      )}
    </section>
  )
}

export { HeroBanner }
