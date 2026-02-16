import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { TenantContextService } from '@/common/tenant-context/tenant-context.service';
import { TenantMemberRepository } from '@/tenant/repositories/tenant-member.repository';

/**
 * SOLID Principle: Single Responsibility
 * Verifies that the User identity matches the Tenant context.
 */
@Injectable()
export class TenantMembershipGuard implements CanActivate {
  constructor(
    private readonly tenantContext: TenantContextService,
    private readonly memberRepo: TenantMemberRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const tenantId = this.tenantContext.getTenantId();

    // 1. Identity Check
    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    // 2. Global Admin Bypass
    if (user.globalRole === 'SUPER_ADMIN') {
      return true;
    }

    // 3. Context Check
    if (!tenantId) {
      throw new ForbiddenException('No Store context identified (Missing X-Tenant-ID)');
    }

    /**
     * 4. Membership Check:
     * We use the repository. Even if the repository uses the base client 
     * with a compound key, our new Smart Extension will flatten it 
     * and inject the tenantId filter correctly.
     */
    const membership = await this.memberRepo.findByTenantAndUser(tenantId, user.id);

    if (!membership || !membership.isActive) {
      throw new ForbiddenException('You do not have access to this store');
    }

    // 5. Success: Attach role for downstream RoleGuards
    request['tenantMemberRole'] = membership.role;

    return true;
  }
}