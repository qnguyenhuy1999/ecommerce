export interface RefreshTokenProps {
  id: string; userId: string; tokenHash: string; family: string
  expiresAt: Date; revokedAt: Date | null; createdAt: Date; replacedBy: string | null
}
export class RefreshTokenEntity {
  constructor(readonly props: RefreshTokenProps) {}
  isValid(): boolean { return this.props.revokedAt === null && this.props.expiresAt > new Date() }
  isExpired(): boolean { return this.props.expiresAt <= new Date() }
  isRevoked(): boolean { return this.props.revokedAt !== null }
}
