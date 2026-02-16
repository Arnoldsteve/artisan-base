import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TenantUserRole } from '@generated/prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class TenantRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Get the roles required by the @Roles() decorator
    const requiredRoles = this.reflector.getAllAndOverride<TenantUserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 2. If no roles are specified, allow access (open to all members)
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const userTenantRole = request['tenantRole']; // Attached by TenantMembershipGuard

    // 3. Super Admins bypass role checks
    if (user?.globalRole === 'SUPER_ADMIN') {
      return true;
    }

    // 4. Check if the user's role in this tenant matches the requirement
    return requiredRoles.includes(userTenantRole);
  }
}