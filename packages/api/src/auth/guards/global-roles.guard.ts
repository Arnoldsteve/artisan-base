import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GlobalRole } from '@generated/prisma/client';
import { GLOBAL_ROLES_KEY } from '../decorators/global-roles.decorator';

@Injectable()
export class GlobalRolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<GlobalRole[]>(
      GLOBAL_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // No roles required — allow through
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const { user } = context.switchToHttp().getRequest();

    if (!user) throw new ForbiddenException('Not authenticated');

    if (!requiredRoles.includes(user.globalRole)) {
      throw new ForbiddenException(
        `Access denied — requires role: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}