import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantContextService } from 'src/common/tenant-context.service';

@Injectable()
export class TenantContextMiddleware implements NestMiddleware {
  constructor(private readonly tenantContext: TenantContextService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Example: extract from req.tenant and req.user (set by previous middleware/guard)
    const tenantId = (req as any).tenant?.id;
    const userId = (req as any).user?.id;
    this.tenantContext.setContext(tenantId, userId);
    next();
  }
}
