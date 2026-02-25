import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TenantUserRole } from '@generated/prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * SOLID Principle: Single Responsibility
 * This guard is ONLY responsible for granular permission checking 
 * within the tenant context.
 */
@Injectable()
export class TenantRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Get the roles required by the @Roles() decorator from the handler or class
    const requiredRoles = this.reflector.getAllAndOverride<TenantUserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 2. If no roles are specified, the endpoint is open to all tenant members
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    // This was attached by the TenantMembershipGuard in the previous step
    const userTenantRole = request['tenantMemberRole'] as TenantUserRole;

    // 3. Platform Safety: Super Admins bypass store-level role checks
    if (user?.globalRole === 'SUPER_ADMIN') {
      return true;
    }

    // 4. Permission Check: Does the user have one of the required roles?
    const hasPermission = requiredRoles.includes(userTenantRole);

    if (!hasPermission) {
      throw new ForbiddenException(
        `Insufficient permissions. Required: [${requiredRoles.join(', ')}]. Your role: ${userTenantRole}`
      );
    }

    return true;
  }
}