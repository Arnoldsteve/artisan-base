import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client/management';

/**
 * A custom decorator to associate roles with a route handler.
 * @param roles An array of roles that are allowed to access the route.
 */
export const Roles = Reflector.createDecorator<UserRole []>();

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get the roles required for the specific route handler being called.
    const requiredRoles = this.reflector.get(Roles, context.getHandler());
    Logger.log(`Required roles for this route: ${requiredRoles}`, 'RolesGuard');

    // If no @Roles() decorator is used on the route, allow access.
    if (!requiredRoles) {
      return true;
    }

    // Get the user object that should have been attached to the request by a preceding auth guard (e.g., JwtAuthGuard).
    const { user } = context.switchToHttp().getRequest();

    // If there is no user or the user doesn't have a role property, deny access.
    if (!user || !user.role) {
      return false;
    }

    // Check if the user's role is included in the list of required roles.
    return requiredRoles.some((role) => user.role === role);
  }
}