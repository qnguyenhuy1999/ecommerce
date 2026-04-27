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
  /**
   * Strength of the dark gradient overlay applied over a `backgroundImage`.
   * `cinematic` is darker on the left and is recommended for left-aligned heroes.
   */
  overlayTone?: 'subtle' | 'standard' | 'cinematic'
}

const alignment: Record<NonNullable<HeroBannerProps['align']>, string> = {
  left: 'items-start text-left',
  center: 'items-center text-center',
  right: 'items-end text-right',
}

const sizing: Record<NonNullable<HeroBannerProps['size']>, string> = {
  sm: 'min-h-[18rem] md:min-h-[22rem]',
  md: 'min-h-[24rem] md:min-h-[30rem]',
  lg: 'min-h-[28rem] md:min-h-[34rem] lg:min-h-[38rem]',
  full: 'min-h-[80svh] lg:min-h-[88svh]',
}

const overlayClassByTone: Record<NonNullable<HeroBannerProps['overlayTone']>, string> = {
  subtle: 'bg-gradient-to-b from-black/30 via-black/20 to-black/40',
  standard: 'bg-gradient-to-b from-black/45 via-black/25 to-black/55',
  cinematic:
    'bg-gradient-to-r from-black/70 via-black/45 to-black/15 lg:from-black/80 lg:via-black/55 lg:to-black/10',
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
  overlayTone,
  className,
  ...props
}: HeroBannerProps) {
  const resolvedOverlayTone = overlayTone ?? (align === 'left' ? 'cinematic' : 'standard')

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
            className={cn(
              'h-full w-full object-cover',
              'animate-in fade-in zoom-in-105 duration-[1200ms] fill-mode-both',
            )}
            loading="eager"
            fetchPriority="high"
          />
        </picture>
      )}

      {backgroundImage && overlay && (
        <div className={cn('absolute inset-0 -z-10', overlayClassByTone[resolvedOverlayTone])} />
      )}

      <div
        className={cn(
          'relative mx-auto flex w-full flex-1 flex-col justify-center',
          'max-w-[var(--storefront-content-max-width)]',
          'px-6 sm:px-8 lg:px-12',
          'py-12 md:py-16 lg:py-20',
          alignment[align],
        )}
      >
        {eyebrow && (
          <p
            className={cn(
              'mb-4 text-[length:var(--text-xs)] font-semibold uppercase tracking-[0.18em]',
              backgroundImage ? 'text-white/85' : 'text-[var(--text-brand)]',
              'animate-in fade-in slide-in-from-bottom-2 duration-[var(--motion-slow)] fill-mode-both',
            )}
          >
            {eyebrow}
          </p>
        )}

        <h1
          className={cn(
            'tracking-[-0.025em] leading-[1.02]',
            align === 'left' ? 'max-w-xl' : 'max-w-3xl',
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
              'mt-5 max-w-xl text-[length:var(--text-base)] sm:text-[length:var(--text-lg)] leading-[var(--line-height-relaxed)]',
              backgroundImage ? 'text-white/90' : 'text-[var(--text-secondary)]',
              'animate-in fade-in slide-in-from-bottom-4 duration-[var(--motion-slow)] fill-mode-both [animation-delay:80ms]',
            )}
          >
            {subtitle}
          </p>
        )}

        {(ctaLabel || secondaryCtaLabel) && (
          <div
            className={cn(
              'mt-8 flex flex-wrap items-center gap-3',
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
                  'rounded-full px-7',
                  'transition-transform duration-[var(--motion-fast)] hover:scale-[1.03] active:scale-[0.98]',
                )}
              >
                {ctaLabel}
              </a>
            )}
            {secondaryCtaLabel && (
              <a
                href={secondaryCtaHref}
                className={cn(
                  buttonVariants({ variant: backgroundImage ? 'ghost' : 'outline', size: 'lg' }),
                  'rounded-full px-7',
                  'transition-transform duration-[var(--motion-fast)] hover:scale-[1.03] active:scale-[0.98]',
                  backgroundImage &&
                    'border border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white',
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
