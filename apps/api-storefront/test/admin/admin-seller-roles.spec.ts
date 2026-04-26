import { Reflector } from '@nestjs/core'

import { RolesGuard } from '@ecom/nest-auth'

import { AdminSellerController } from '../../src/modules/admin/presentation/admin-seller.controller'

interface MockExecutionContext {
  getHandler: () => () => void
  getClass: () => typeof AdminSellerController
  switchToHttp: () => { getRequest: () => { user: { role: string } | undefined } }
}

function buildContext(role: string | undefined): MockExecutionContext {
  return {
    getHandler: () => AdminSellerController.prototype.approve as () => void,
    getClass: () => AdminSellerController,
    switchToHttp: () => ({
      getRequest: () => ({ user: role === undefined ? undefined : { role } }),
    }),
  }
}

describe('AdminSellerController role enforcement', () => {
  const guard = new RolesGuard(new Reflector())

  it('allows ADMIN callers through the controller-level RolesGuard', () => {
    const allowed = guard.canActivate(buildContext('ADMIN') as never)
    expect(allowed).toBe(true)
  })

  it('rejects USER callers', () => {
    expect(guard.canActivate(buildContext('USER') as never)).toBe(false)
  })

  it('rejects SELLER callers (escalation guard)', () => {
    expect(guard.canActivate(buildContext('SELLER') as never)).toBe(false)
  })

  it('rejects unauthenticated callers (no req.user)', () => {
    expect(guard.canActivate(buildContext(undefined) as never)).toBe(false)
  })
})
