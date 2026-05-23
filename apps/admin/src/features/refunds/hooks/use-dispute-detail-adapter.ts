'use client'

import type { DisputeDetailRecord, DisputeDetailSubmitPayload } from '@ecom/ui-admin'
import { useRefund, useApproveRefund, useRejectRefund } from '../hooks/use-refunds'
import { mapRefundToDisputeRecord } from '../mappers/dispute.mapper'

export function useDisputeDetailAdapter(id: string) {
  const refundQuery = useRefund(id)
  const approve = useApproveRefund()
  const reject = useRejectRefund()

  const base = refundQuery.data ? mapRefundToDisputeRecord(refundQuery.data) : undefined
  const item: DisputeDetailRecord | undefined = base
    ? {
        ...base,
        shopName: '—',
        placedAtLabel: '—',
        itemTitle: '—',
        itemImageSrc: '',
        itemImageAlt: '',
        itemQuantityLabel: '—',
        orderStatusLabel: '—',
        statusLabel: base.status,
        internalNotePlaceholder: 'Add internal note…',
        resolutionActionLabel: 'Apply resolution',
        selectedResolution: base.resolution,
        conversation: [],
        evidence:
          refundQuery.data?.evidence.map((e) => ({
            id: e.id,
            label: e.type,
            caption: e.type,
            imageSrc: e.url,
            imageAlt: e.type,
          })) ?? [],
        resolutionOptions: [
          {
            value: 'BUYER_REFUND',
            title: 'Refund buyer',
            description: 'Issue full refund to buyer.',
          },
          {
            value: 'SELLER_CLOSED',
            title: 'Close for seller',
            description: 'Close in seller favour.',
          },
          { value: 'UNRESOLVED', title: 'Unresolved', description: 'Mark as unresolved.' },
        ],
        auditTrail:
          refundQuery.data?.timeline.map((t) => ({
            id: t.id,
            actor: 'System',
            action: `${t.fromStatus} → ${t.toStatus}`,
            dateLabel: new Date(t.createdAt).toLocaleDateString(),
          })) ?? [],
      }
    : undefined

  return {
    loading: refundQuery.isPending,
    error: refundQuery.error,
    ...(item !== undefined && { item }),
    backHref: '/refunds',
    onApplyResolution: async (payload: DisputeDetailSubmitPayload) => {
      if (payload.resolution === 'BUYER_REFUND') {
        await approve.mutateAsync({ id, note: payload.note })
      } else {
        await reject.mutateAsync({ id, note: payload.note })
      }
    },
  }
}
