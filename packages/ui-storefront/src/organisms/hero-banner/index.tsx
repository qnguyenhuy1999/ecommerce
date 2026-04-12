import { cn, Button } from '@ecom/ui'

export interface HeroBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  subtitle?: string
  ctaLabel?: string
  ctaHref?: string
  backgroundImage?: string
  overlay?: boolean
  align?: 'left' | 'center' | 'right'
  minHeight?: string
}

function HeroBanner({
  title,
  subtitle,
  ctaLabel,
  ctaHref = '#',
  backgroundImage,
  overlay = true,
  align = 'center',
  minHeight = '600px',
  className,
  ...props
}: HeroBannerProps) {
  const alignClass = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  }[align]

  return (
    <div className={cn('hero-banner w-full bg-muted', className)} style={{ minHeight }} {...props}>
      {backgroundImage && (
        <img
          src={backgroundImage}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {overlay && <div className="hero-banner__overlay" />}

      <div
        className={cn(
          'relative z-10 w-full max-w-7xl mx-auto h-full flex justify-center flex-col px-6 md:px-12',
          alignClass,
        )}
        style={{ minHeight }}
      >
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white max-w-3xl leading-tight mb-4 animate-[slide-up_500ms_ease-out]">
          {title}
        </h1>

        {subtitle && (
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-8 animate-[slide-up_700ms_ease-out] leading-relaxed">
            {subtitle}
          </p>
        )}

        {ctaLabel && (
          <div className="animate-[slide-up_900ms_ease-out]">
            <Button
              variant="brand"
              size="xl"
              asChild
              className="rounded-full px-10 text-base shadow-xl"
            >
              <a href={ctaHref}>{ctaLabel}</a>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export { HeroBanner }
