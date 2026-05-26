export interface UserSessionRecord {
  id: string
  userAgent: string | null
  ipAddress: string | null
  createdAtLabel: string
}

export interface UserDetailRecord {
  id: string
  email: string
  name: string
  phone: string | null
  emailVerified: boolean
  status: string
  joinedAtLabel: string
  canSuspend: boolean
  canBan: boolean
  canActivate: boolean
  sessions: UserSessionRecord[]
}

export interface UserDetailProps {
  user?: UserDetailRecord
  loading?: boolean
  backHref?: string
  suspendLabel?: string
  banLabel?: string
  activateLabel?: string
  onSuspend?: (() => void | Promise<void>) | undefined
  onBan?: (() => void | Promise<void>) | undefined
  onActivate?: (() => void | Promise<void>) | undefined
}
