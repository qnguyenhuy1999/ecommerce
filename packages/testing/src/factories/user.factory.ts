import { UserStatus } from '@ecom/contracts/enums'
import type { FactoryOverrides } from './types'

export interface TestUser {
  id: string
  email: string
  firstName: string
  lastName: string
  emailVerified: boolean
  status: UserStatus
}

export function createUserFactory(overrides: FactoryOverrides<TestUser> = {}): TestUser {
  return {
    id: 'user-1',
    email: 'buyer@example.com',
    firstName: 'Test',
    lastName: 'Buyer',
    emailVerified: true,
    status: UserStatus.ACTIVE,
    ...overrides,
  }
}
