import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TenantContextService } from '@/common/tenant-context/tenant-context.service';

/**
 * Custom Decorator to get the current Tenant ID in any controller method.
 * Usage: @Get() getData(@TenantId() tenantId: string) { ... }
 */
export const TenantId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    // We access the storage via the static reference in the service
    // This is safer than the request header because it's guaranteed by the 'bubble'
    const tenantId = new TenantContextService().getTenantId();
    return tenantId;
  },
);