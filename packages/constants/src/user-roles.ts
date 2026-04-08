// ─── User Roles ───────────────────────────────────────────────
export const UserRole = {
  USER: 'USER',
  SELLER: 'SELLER',
  ADMIN: 'ADMIN',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

// ─── User Status ──────────────────────────────────────────────
export const UserStatus = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  DELETED: 'DELETED',
} as const;
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];
