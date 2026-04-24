export type UserRole = 'USER' | 'SELLER' | 'ADMIN'
export type UserStatus = 'UNVERIFIED' | 'ACTIVE' | 'SUSPENDED'

export interface UserProps {
  id: string
  email: string
  passwordHash: string
  role: UserRole
  status: UserStatus
  emailVerified: Date | null
  createdAt: Date
}

export class UserEntity {
  constructor(readonly props: UserProps) {}
  get id() { return this.props.id }
  get email() { return this.props.email }
  get passwordHash() { return this.props.passwordHash }
  get role() { return this.props.role }
  get status() { return this.props.status }
  isActive(): boolean { return this.props.status === 'ACTIVE' }
  canLogin(): boolean { return this.props.status === 'ACTIVE' || this.props.status === 'UNVERIFIED' }
}
