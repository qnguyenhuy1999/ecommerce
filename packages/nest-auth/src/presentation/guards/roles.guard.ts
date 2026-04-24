import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import type { Request } from 'express'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[] | undefined>('roles', [
      context.getHandler(),
      context.getClass(),
    ])
    if (!roles || roles.length === 0) return true
    const request = context.switchToHttp().getRequest<Request & { user?: { role: string } }>()
    return roles.includes(request.user?.role ?? '')
  }
}
