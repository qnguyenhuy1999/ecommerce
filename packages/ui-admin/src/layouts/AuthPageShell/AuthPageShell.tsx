import { Typography } from '@ecom/core-ui/atoms/Typography'
import { Activity, Fingerprint, ShieldCheck, Waves, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import {
  authShellActiveRequestClassName,
  authShellBadgeClassName,
  authShellBrandKickerClassName,
  authShellBrandPanelClassName,
  authShellBrandTitleClassName,
  authShellFeatureClassName,
  authShellFeatureLabelClassName,
  authShellFooterClassName,
  authStatusToneClassNames,
} from '../../lib/auth-theme'

interface AuthFeature {
  icon: LucideIcon
  label: string
}

interface AuthPageShellProps {
  title: string
  children: ReactNode
}

const authFeatures: AuthFeature[] = [
  {
    icon: ShieldCheck,
    label: 'Hardware-key & TOTP enforced',
  },
  {
    icon: Waves,
    label: 'Full audit trail - SOC2-aligned',
  },
  {
    icon: Fingerprint,
    label: 'Geo & device fingerprint checks',
  },
]

const authGradientStyle = {
  backgroundImage:
    'radial-gradient(circle at top right, color-mix(in oklab, var(--primary) 18%, transparent), transparent 30%), radial-gradient(circle at bottom left, color-mix(in oklab, var(--warning) 10%, transparent), transparent 32%)',
}

const authGridStyle = {
  backgroundImage:
    'linear-gradient(color-mix(in oklab, var(--foreground) 8%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklab, var(--foreground) 8%, transparent) 1px, transparent 1px)',
  backgroundSize: '40px 40px',
}

const authPanelStyle = {
  backgroundImage:
    'radial-gradient(circle at top left, color-mix(in oklab, var(--background) 24%, transparent), transparent 32%), linear-gradient(180deg, color-mix(in oklab, var(--background) 18%, transparent), color-mix(in oklab, var(--background) 64%, transparent))',
}

const authFormPanelStyle = {
  backgroundImage:
    'radial-gradient(circle at top right, color-mix(in oklab, var(--primary) 14%, transparent), transparent 26%), linear-gradient(180deg, color-mix(in oklab, var(--background) 18%, transparent), color-mix(in oklab, var(--background) 72%, transparent))',
}

export function AuthPageShell({ title, children }: AuthPageShellProps) {
  return (
    <div className="bg-background flex min-h-screen flex-col justify-center">
      <div className="bg-background relative mx-auto flex min-h-[calc(100vh-1.5rem)] w-full flex-col overflow-hidden sm:min-h-[calc(100vh-2rem)] lg:min-h-[calc(100vh-3rem)]">
        <div className="absolute inset-0" style={authGradientStyle} />

        <div className="relative grid min-h-[calc(100vh-1.5rem)] flex-1 sm:min-h-[calc(100vh-2rem)] lg:min-h-[calc(100vh-3rem)] lg:grid-cols-[minmax(0,1.08fr)_minmax(420px,0.92fr)]">
          <section className={authShellBrandPanelClassName}>
            <div className="absolute inset-0 opacity-60" style={authGridStyle} />
            <div className="absolute inset-0" style={authPanelStyle} />

            <div className="relative flex h-full flex-col px-6 py-7 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
              <div className="flex items-center gap-4">
                <div className="bg-primary text-primary-foreground flex size-12 items-center justify-center rounded-full shadow-sm">
                  <ShieldCheck className="size-5.5" />
                </div>
                <div className="space-y-0.5">
                  <Typography
                    variant="label"
                    className={`text-lg font-semibold ${authShellBrandTitleClassName}`}
                  >
                    Halo Admin
                  </Typography>
                  <Typography
                    variant="caption"
                    className={`text-xs ${authShellBrandKickerClassName}`}
                  >
                    Platform console
                  </Typography>
                </div>
              </div>

              <div className={`mt-10 ${authShellBadgeClassName}`}>
                <Activity className={`size-3.5 ${authStatusToneClassNames.success.text}`} />
                <span>All systems operational</span>
              </div>

              <div className="mt-8 max-w-160 space-y-4">
                <Typography
                  as="h1"
                  variant="h1"
                  className={`max-w-132 text-3xl leading-[1.05] font-semibold tracking-[-0.03em] sm:text-[2.8rem] lg:text-[3.25rem] ${authShellBrandTitleClassName}`}
                >
                  Operate the marketplace with <span className="text-primary">confidence.</span>
                </Typography>
                <Typography
                  variant="body"
                  className="text-muted-foreground max-w-xl text-[0.975rem] leading-7"
                >
                  Sign in to manage vendors, disputes, payouts and platform safety. Every action is
                  signed, logged and reversible.
                </Typography>
              </div>

              {/* Sleek, active session indicator instead of a massive, redundant block */}
              <div className="mt-6 max-w-132">
                <div className={authShellActiveRequestClassName}>
                  <span className="bg-primary size-1.5 animate-pulse rounded-full" />
                  <span>Active Request: {title}</span>
                </div>
              </div>

              <div className="mt-8 grid max-w-140 gap-3">
                {authFeatures.map(({ icon: Icon, label }) => (
                  <div key={label} className={authShellFeatureClassName}>
                    <div className="bg-primary-soft text-primary flex size-9 shrink-0 items-center justify-center rounded-xl">
                      <Icon className="size-4.5" />
                    </div>
                    <Typography
                      variant="body-sm"
                      className={`text-[0.925rem] font-medium ${authShellFeatureLabelClassName}`}
                    >
                      {label}
                    </Typography>
                  </div>
                ))}
              </div>

              <div
                className={`mt-auto hidden items-end justify-between gap-6 pt-8 text-xs lg:flex ${authShellFooterClassName}`}
              >
                <span>&copy; Halo Market. Restricted access.</span>
                <span>v4.18.2 - region: ap-sg-1</span>
              </div>
            </div>
          </section>

          <section className="relative flex items-center justify-center overflow-y-auto px-4 py-8 sm:px-8 lg:px-10 lg:py-10">
            <div className="absolute inset-0" style={authFormPanelStyle} />
            <div className="relative my-auto w-full max-w-md">{children}</div>
          </section>
        </div>
      </div>
    </div>
  )
}
