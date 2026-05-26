import type { UserDetailProps } from './UserDetail.types'

export const userDetailDefaultProps: UserDetailProps = {
  loading: false,
  backHref: '/buyers',
  suspendLabel: 'Suspend',
  banLabel: 'Ban',
  activateLabel: 'Activate',
  user: {
    id: 'usr-001-aaaa-bbbb',
    email: 'alice@example.com',
    name: 'Alice Johnson',
    phone: '+1 555-0100',
    emailVerified: true,
    status: 'ACTIVE',
    joinedAtLabel: 'January 15, 2025',
    canSuspend: true,
    canBan: true,
    canActivate: false,
    sessions: [
      {
        id: 'ses-001',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        ipAddress: '198.51.100.42',
        createdAtLabel: 'May 20, 2026',
      },
      {
        id: 'ses-002',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)',
        ipAddress: '203.0.113.8',
        createdAtLabel: 'May 24, 2026',
      },
    ],
  },
}
