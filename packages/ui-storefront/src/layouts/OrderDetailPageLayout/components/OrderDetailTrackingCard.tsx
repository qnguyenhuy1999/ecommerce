import { OrderTimeline } from '../../../molecules/OrderTimeline/OrderTimeline'
import type { OrderDetailSectionProps } from '../../../organisms/OrderDetailSection/OrderDetailSection'
import { DashboardCard } from './DashboardCard'

export interface OrderDetailTrackingCardProps {
  timelineSteps?: OrderDetailSectionProps['timelineSteps']
}

export function OrderDetailTrackingCard({ timelineSteps }: OrderDetailTrackingCardProps) {
  return (
    <DashboardCard className="p-6 sm:p-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="text-[length:var(--font-size-heading-md)] font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
          Tracking
        </h2>
        {timelineSteps && (
          <span className="text-[length:var(--text-xs)] text-[var(--text-tertiary)]">
            {timelineSteps.filter((step) => step.status === 'complete').length} of{' '}
            {timelineSteps.length} steps complete
          </span>
        )}
      </div>
      {timelineSteps ? (
        <OrderTimeline steps={timelineSteps} />
      ) : (
        <p className="text-sm text-[var(--text-secondary)]">
          Tracking information is not available yet. Check back once your order has been processed.
        </p>
      )}
    </DashboardCard>
  )
}
