import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { TenantContextService } from '@/common/tenant-context/tenant-context.service';

/**
 * SOLID Principle: Single Responsibility
 * This guard is ONLY responsible for verifying that the authenticated user
 * is a registered member of the tenant currently in the context.
 */
@Injectable()
export class TenantMembershipGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Populated by your JWT Strategy
    const tenantId = this.tenantContext.getTenantId();

    // 1. Safety check: If no user is logged in, the AuthGuard should have caught this.
    if (!user) {
      return false;
    }

    // 2. Platform Admins bypass membership checks
    if (user.globalRole === 'SUPER_ADMIN') {
      return true;
    }

    // 3. Safety check: Ensure we actually have a tenant context
    if (!tenantId) {
      throw new ForbiddenException('No tenant context identified');
    }

    // 4. Database Check: Does this user have a membership record for this tenant?
    // Note: We use the 'raw' prisma client here because our extended client 
    // would filter the 'TenantMember' table by tenantId anyway.
    const membership = await this.prisma.tenantMember.findUnique({
      where: {
        tenantId_userId: {
          tenantId: tenantId,
          userId: user.id,
        },
      },
    });

    if (!membership || !membership.isActive) {
      throw new ForbiddenException('You do not have access to this tenant');
    }

    // 5. Attach the membership role to the request for use in RoleGuards
    request['tenantRole'] = membership.role;

    return true;
  }
}