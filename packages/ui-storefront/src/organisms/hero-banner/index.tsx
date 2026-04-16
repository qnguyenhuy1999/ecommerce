import { cn, buttonVariants } from '@ecom/ui'

export interface HeroBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  subtitle?: string
  ctaLabel?: string
  ctaHref?: string
  backgroundImage?: string
  overlay?: boolean
  align?: 'left' | 'center' | 'right'
  size?: 'sm' | 'md' | 'lg' | 'full'
}

function HeroBanner({
  title,
  subtitle,
  ctaLabel,
  ctaHref = '#',
  backgroundImage,
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
    sm: 'min-h-[300px]',
    md: 'min-h-[450px]',
    lg: 'min-h-[600px]',
    full: 'min-h-[100vh]',
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
        <img
          src={backgroundImage}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {overlay && <div className="hero-banner__overlay" />}

      <div
        className={cn(
          'relative z-10 w-full max-w-7xl mx-auto flex-1 flex justify-center flex-col px-6 md:px-12',
          alignClass,
        )}
      >
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white max-w-3xl leading-tight mb-4 animate-in fade-in slide-in-from-bottom-8 duration-[var(--motion-slow)] fill-mode-both">
          {title}
        </h1>

        {subtitle && (
          <p
            className="text-lg md:text-xl text-white/90 max-w-2xl mb-8 animate-in fade-in slide-in-from-bottom-8 duration-[var(--motion-slow)] fill-mode-both"
            style={{ animationDelay: '100ms' }}
          >
            {subtitle}
          </p>
        )}

        {ctaLabel && (
          <div
            className="animate-in fade-in slide-in-from-bottom-8 duration-[var(--motion-slow)] fill-mode-both"
            style={{ animationDelay: '200ms' }}
          >
            <a
              href={ctaHref}
              className={cn(
                buttonVariants({ size: 'lg' }),
                "h-12 px-10 text-base shadow-[var(--elevation-card)] hover:shadow-[var(--elevation-hover)]"
              )}
            >
              {ctaLabel}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export { HeroBanner }
