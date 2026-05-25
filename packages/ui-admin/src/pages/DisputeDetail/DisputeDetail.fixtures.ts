import { disputesDefaultProps } from '../Disputes/Disputes.fixtures'
import type { RefundDetailProps } from './DisputeDetail.types'

const defaultItem = disputesDefaultProps.items?.[0]
const disputePlaceholderImage =
  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80'

if (!defaultItem) {
  throw new Error('Dispute detail fixture requires at least one dispute item.')
}

export const refundDetailDefaultProps: RefundDetailProps = {
  backHref: '/disputes',
  item: {
    ...defaultItem,
    shopName: 'Lumen Audio Official',
    placedAtLabel: 'May 11, 2026',
    itemTitle: 'Wireless ANC Headphones - Studio Edition',
    itemImageSrc: disputePlaceholderImage,
    itemImageAlt: 'Wireless ANC Headphones - Studio Edition',
    itemQuantityLabel: 'x1',
    orderStatusLabel: 'to_pay',
    statusLabel: 'Open',
    internalNotePlaceholder: 'Internal note (visible to admins only)',
    resolutionActionLabel: 'Apply resolution',
    selectedResolution: 'BUYER_REFUND_FULL',
    conversation: [
      {
        id: 'msg-buyer',
        role: 'BUYER',
        message: 'Item not received. Please refund.',
        dateLabel: 'May 11, 2026',
      },
      {
        id: 'msg-seller',
        role: 'SELLER',
        message: 'We dispatched on time. Tracking confirms delivery.',
        dateLabel: 'May 11, 2026',
      },
      {
        id: 'msg-admin',
        role: 'ADMIN',
        message: 'Reviewing evidence. Response within 24h.',
        dateLabel: 'May 11, 2026',
      },
    ],
    evidence: [
      {
        id: 'evidence-1',
        label: '#1',
        caption: 'City-view photo uploaded by buyer',
        imageSrc: disputePlaceholderImage,
        imageAlt: 'Buyer evidence upload',
      },
    ],
    resolutionOptions: [
      {
        value: 'BUYER_REFUND_FULL',
        title: 'Refund buyer in full',
        description: '$9 back to original payment',
      },
      {
        value: 'BUYER_REFUND_PARTIAL',
        title: 'Refund buyer partially',
        description: 'Enter amount below',
      },
      {
        value: 'SELLER_DENIED',
        title: "Deny refund - close in seller's favor",
        description: 'Buyer notified with reason',
      },
      {
        value: 'ESCALATE',
        title: 'Escalate to senior reviewer',
        description: 'Pause SLA and reassign',
      },
    ],
    auditTrail: [
      {
        id: 'audit-1',
        actor: 'Alex Tan',
        action: 'opened dispute DSP-5200',
        dateLabel: 'May 11, 2026',
      },
      {
        id: 'audit-2',
        actor: 'Lumen Audio',
        action: 'responded DSP-5200',
        dateLabel: 'May 11, 2026',
      },
      {
        id: 'audit-3',
        actor: 'Ops Admin',
        action: 'assigned reviewer DSP-5200',
        dateLabel: 'May 11, 2026',
      },
    ],
  },
}
