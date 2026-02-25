import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TenantContextService } from '@/common/tenant-context/tenant-context.service';
import { TenantMemberRepository } from '@/tenant/repositories/tenant-member.repository';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';


@Injectable()
export class TenantMembershipGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tenantContext: TenantContextService,
    private readonly memberRepo: TenantMemberRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Check if the route is @Public()
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // If it's public, we don't need to check user membership
    if (isPublic ) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const tenantId = this.tenantContext.getTenantId();

    // 2. Identity Check (Only for non-public routes)
    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    if (user.globalRole === 'SUPER_ADMIN') {
      return true;
    }

    if (!tenantId) {
      throw new ForbiddenException(
        'No Store context identified (Missing X-Tenant-ID)',
      );
    }

    // 3. Membership Check
    const membership = await this.memberRepo.findByTenantAndUser(
      tenantId,
      user.id,
    );

    if (!membership || !membership.isActive) {
      throw new ForbiddenException('You do not have access to this store');
    }

    request['tenantMemberRole'] = membership.role;

    return true;
  }
}
