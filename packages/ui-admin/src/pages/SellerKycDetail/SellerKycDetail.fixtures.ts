import type { SellerKycDetailProps } from './SellerKycDetail.types'

function buildPreview(label: string, accent: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 160">
      <defs>
        <linearGradient id="surface" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="oklch(0.96 0.01 250)" />
          <stop offset="100%" stop-color="${accent}" />
        </linearGradient>
      </defs>
      <rect width="240" height="160" rx="24" fill="url(#surface)" />
      <rect x="20" y="24" width="200" height="112" rx="16" fill="rgba(255,255,255,0.62)" />
      <text
        x="120"
        y="84"
        text-anchor="middle"
        fill="oklch(0.32 0.02 255)"
        font-family="Inter, Arial, sans-serif"
        font-size="18"
        font-weight="600"
      >
        ${label}
      </text>
    </svg>
  `.trim()

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export const sellerKycDetailDefaultProps: SellerKycDetailProps = {
  backHref: '#',
  approveDocumentLabel: 'Approve',
  rejectDocumentLabel: 'Reject',
  requestNewLabel: 'Request new',
  rejectSellerLabel: 'Reject',
  approveSellerLabel: 'Approve seller',
  item: {
    id: 'seller-2',
    sellerName: 'Northbloom Living',
    ownerName: 'Anya P.',
    ownerEmail: 'anya@northbloom.co',
    appliedAtLabel: 'May 28, 2022',
    status: 'APPROVED',
    tabs: [
      { value: 'KYC_REVIEW', label: 'KYC Review' },
      { value: 'VIOLATIONS', label: 'Violations' },
      { value: 'PROFILE', label: 'Profile' },
    ],
    applicant: [
      { label: 'Legal name', value: 'Northbloom Living LLC' },
      { label: 'Business type', value: 'Company' },
      { label: 'Country', value: 'PH' },
      { label: 'Tax ID', value: 'TX-1548' },
    ],
    bankName: 'DBS Bank',
    bankAccountLabel: '•• 4052',
    riskScore: 80,
    riskSummary:
      'Sanctions screening clean. PEP checks passed. Address mismatch flagged for review.',
    documentsApprovedLabel: '1 of 5 approved',
    documents: [
      {
        id: 'business-registration',
        title: 'Business registration',
        uploadedAtLabel: 'Uploaded May 9, 2026',
        typeLabel: 'business_reg',
        previewSrc: buildPreview('Business reg', 'oklch(0.78 0.08 240)'),
        previewAlt: 'Business registration preview',
        status: 'PENDING',
      },
      {
        id: 'tax-id-certificate',
        title: 'Tax ID certificate',
        uploadedAtLabel: 'Uploaded May 9, 2026',
        typeLabel: 'tax_id',
        previewSrc: buildPreview('Tax ID', 'oklch(0.78 0.08 170)'),
        previewAlt: 'Tax ID certificate preview',
        status: 'APPROVED',
      },
      {
        id: 'owner-id-front',
        title: 'Owner ID — front',
        uploadedAtLabel: 'Uploaded May 9, 2026',
        typeLabel: 'id_front',
        previewSrc: buildPreview('Owner ID front', 'oklch(0.82 0.11 92)'),
        previewAlt: 'Owner ID front preview',
        status: 'PENDING',
      },
      {
        id: 'owner-id-back',
        title: 'Owner ID — back',
        uploadedAtLabel: 'Uploaded May 9, 2026',
        typeLabel: 'id_back',
        previewSrc: buildPreview('Owner ID back', 'oklch(0.75 0.07 40)'),
        previewAlt: 'Owner ID back preview',
        status: 'PENDING',
      },
      {
        id: 'bank-statement',
        title: 'Bank statement',
        uploadedAtLabel: 'Uploaded May 9, 2026',
        typeLabel: 'bank_proof',
        previewSrc: buildPreview('Bank statement', 'oklch(0.78 0.08 115)'),
        previewAlt: 'Bank statement preview',
        status: 'PENDING',
      },
    ],
    approvalHint: 'Approve all documents before granting access.',
    auditTrail: [
      {
        id: 'audit-1',
        actor: 'Anya P.',
        action: 'submitted KYC',
        target: 'Northbloom Living',
        dateLabel: 'May 9, 2026',
      },
      {
        id: 'audit-2',
        actor: 'Anya P.',
        action: 'registered',
        target: 'anya@northbloom.co',
        dateLabel: 'May 28, 2022',
      },
    ],
  },
  onApproveDocument: () => {},
  onRejectDocument: () => {},
  onRequestNewDocument: () => {},
  onRejectSeller: () => {},
  onApproveSeller: () => {},
}
