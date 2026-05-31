import { Button } from '@ecom/core-ui/atoms/Button'
import { Typography } from '@ecom/core-ui/atoms/Typography'
import { WalletCards } from 'lucide-react'
import { cn } from '@ecom/shared/utils/cn'
import { formatFinanceAmount, getFinanceMetricTone } from './Finance.utils'
import type { FinanceBalanceMetric } from './Finance.types'

export interface WalletSummarySectionProps {
  walletBalanceLabel: string
  walletBalance: number
  balanceMetrics: FinanceBalanceMetric[]
  withdrawHref: string
}

export function WalletSummarySection({
  walletBalanceLabel,
  walletBalance,
  balanceMetrics,
  withdrawHref,
}: WalletSummarySectionProps) {
  return (
    <section className="surface-card grid gap-4 rounded-[28px] p-5 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
        <div className="flex items-center gap-4">
          <div className="bg-primary-soft text-primary flex size-14 shrink-0 items-center justify-center rounded-full">
            <WalletCards className="size-6" />
          </div>
          <div>
            <Typography
              variant="caption"
              className="text-muted-foreground font-semibold tracking-[0.16em] uppercase"
            >
              {walletBalanceLabel}
            </Typography>
            <Typography variant="h1" as="div" className="text-foreground text-4xl">
              {formatFinanceAmount(walletBalance)}
            </Typography>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {balanceMetrics.map((metric) => (
            <div
              key={metric.label}
              className="bg-background border-border min-w-44 rounded-2xl border px-4 py-3"
            >
              <Typography variant="muted">{metric.label}</Typography>
              <Typography
                variant="h3"
                as="div"
                className={cn(
                  'mt-1 text-2xl font-semibold tracking-tight',
                  getFinanceMetricTone(metric.tone),
                )}
              >
                {formatFinanceAmount(metric.amount)}
              </Typography>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-start xl:justify-end">
        <Button asChild size="lg" className="rounded-2xl px-6 font-semibold">
          <a href={withdrawHref}>Withdraw</a>
        </Button>
      </div>
    </section>
  )
}
