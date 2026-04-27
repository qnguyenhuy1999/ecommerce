import React from 'react'

import { buttonVariants } from '@ecom/ui/variants'
import { cn } from '@ecom/ui/utils'

export interface VisualBannerProps extends React.HTMLAttributes<HTMLElement> {
  eyebrow?: string
  title: string
  description?: string
  ctaLabel?: string
  ctaHref?: string
  secondaryCtaLabel?: string
  secondaryCtaHref?: string
  image: string
  imageAlt?: string
  /** Position the text content on the left or right of the banner. */
  align?: 'left' | 'right' | 'center'
  /** Banner height tier. */
  size?: 'sm' | 'md' | 'lg'
  /** Strength of the dark gradient overlay applied to make the text readable. */
  overlayTone?: 'subtle' | 'standard' | 'cinematic'
}

const sizing: Record<NonNullable<VisualBannerProps['size']>, string> = {
  sm: 'min-h-[18rem] md:min-h-[22rem]',
  md: 'min-h-[22rem] md:min-h-[28rem]',
  lg: 'min-h-[26rem] md:min-h-[34rem] lg:min-h-[38rem]',
}

const alignment: Record<NonNullable<VisualBannerProps['align']>, string> = {
  left: 'items-start text-left',
  center: 'items-center text-center',
  right: 'items-end text-right',
}

const overlayClassByTone: Record<NonNullable<VisualBannerProps['overlayTone']>, string> = {
  subtle: 'bg-gradient-to-b from-black/30 via-black/20 to-black/40',
  standard: 'bg-gradient-to-b from-black/45 via-black/25 to-black/55',
  cinematic:
    'bg-gradient-to-r from-black/75 via-black/45 to-black/15 lg:from-black/80 lg:via-black/45 lg:to-black/5',
}

/**
 * Full-width "emotional break" banner used to separate product-heavy sections.
 * Pure presentation — no business logic.
 */
export function VisualBanner({
  eyebrow,
  title,
  description,
  ctaLabel,
  ctaHref = '#',
  secondaryCtaLabel,
  secondaryCtaHref = '#',
  image,
  imageAlt = '',
  align = 'left',
  size = 'md',
  overlayTone,
  className,
  ...props
}: VisualBannerProps) {
  const resolvedTone =
    overlayTone ?? (align === 'center' ? 'standard' : align === 'right' ? 'cinematic' : 'cinematic')

  return (
    <section
      className={cn(
        'relative isolate flex w-full overflow-hidden rounded-[var(--radius-2xl)]',
        sizing[size],
        className,
      )}
      {...props}
    >
      <img
        src={image}
        alt={imageAlt}
        loading="lazy"
        className={cn(
          'absolute inset-0 -z-10 h-full w-full object-cover',
          'transition-transform duration-[1200ms] ease-[var(--motion-ease-out)]',
          'will-change-transform',
          'hover:scale-[1.02]',
        )}
      />
      <div
        aria-hidden="true"
        className={cn('absolute inset-0 -z-10', overlayClassByTone[resolvedTone])}
      />

      <div
        className={cn(
          'relative mx-auto flex w-full flex-1 flex-col justify-center',
          'max-w-[var(--storefront-content-max-width)]',
          'px-6 sm:px-8 lg:px-12',
          'py-12 md:py-16',
          alignment[align],
        )}
      >
        {eyebrow && (
          <p
            className={cn(
              'mb-3 text-[length:var(--text-xs)] font-semibold uppercase tracking-[0.18em] text-white/85',
              'animate-in fade-in slide-in-from-bottom-2 duration-[var(--motion-slow)] fill-mode-both',
            )}
          >
            {eyebrow}
          </p>
        )}

        <h2
          className={cn(
            'max-w-xl tracking-[-0.02em] leading-[1.05] font-bold text-white',
            'text-[length:var(--font-size-display-sm)] sm:text-[length:var(--font-size-display-md)]',
            '[text-shadow:var(--text-shadow-md)]',
            'animate-in fade-in slide-in-from-bottom-4 duration-[var(--motion-slow)] fill-mode-both',
          )}
        >
          {title}
        </h2>

        {description && (
          <p
            className={cn(
              'mt-4 max-w-xl text-[length:var(--text-base)] sm:text-[length:var(--text-lg)] leading-[var(--line-height-relaxed)] text-white/85',
              'animate-in fade-in slide-in-from-bottom-4 duration-[var(--motion-slow)] fill-mode-both [animation-delay:80ms]',
            )}
          >
            {description}
          </p>
        )}

        {(ctaLabel || secondaryCtaLabel) && (
          <div
            className={cn(
              'mt-7 flex flex-wrap items-center gap-3',
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
                  buttonVariants({ variant: 'ghost', size: 'lg' }),
                  'rounded-full px-7 border border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white',
                  'transition-transform duration-[var(--motion-fast)] hover:scale-[1.03] active:scale-[0.98]',
                )}
              >
                {secondaryCtaLabel}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
