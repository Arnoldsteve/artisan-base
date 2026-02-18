import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantContextService } from './tenant-context.service';

/**
 * SOLID Principle: Open/Closed
 * This middleware manages the entry into the Tenant Isolation context.
 * It is updated to exempt the "Store Creation" action from the Tenant ID requirement.
 */
@Injectable()
export class TenantContextMiddleware implements NestMiddleware {
  constructor(private readonly tenantContextService: TenantContextService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const tenantId = req.headers['x-tenant-id'] as string;

    // 1. Identify standard Global Platform routes
    const publicPaths = [
      '/onboarding',
      '/auth/login',
      '/auth/bootstrap', 
      '/health'
    ];

    const isPublicPath = publicPaths.some(path => req.originalUrl.includes(path));

    /**
     * 2. SCENARIO 2 EXEMPTION:
     * POST /api/v1/tenant is the action of creating a new store.
     * We check if the URL ends with '/tenant' AND the method is 'POST'.
     */
    const isStoreCreation = req.originalUrl.endsWith('/tenant') && req.method === 'POST';

    const isPublicRoute = isPublicPath || isStoreCreation;

    // 3. Strict Check: Block if not public and header is missing
    if (!tenantId && !isPublicRoute) {
      throw new UnauthorizedException('Missing X-Tenant-ID header for this protected resource');
    }

    // 4. Enter the "Context Bubble"
    if (tenantId) {
      this.tenantContextService.run(tenantId, () => {
        next();
      });
    } else {
      next();
    }
  }
}