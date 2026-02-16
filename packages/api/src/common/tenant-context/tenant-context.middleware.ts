import { Injectable, NestMiddleware, UnauthorizedException, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantContextService } from './tenant-context.service';

/**
 * SOLID Principle: Single Responsibility
 * This middleware manages the entry into the "Tenant Context".
 * It allows public routes (Onboarding/Login) to pass through, 
 * but enforces the X-Tenant-ID header for everything else.
 */
@Injectable()
export class TenantContextMiddleware implements NestMiddleware {
  private readonly logger = new Logger('TenantMiddleware');

  constructor(private readonly tenantContextService: TenantContextService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const tenantId = req.headers['x-tenant-id'] as string;
    
    // ✅ Using originalUrl ensures we match correctly even with the /api/v1 prefix
    const currentPath = req.originalUrl;

    // ✅ Added /auth/login to the public route whitelist
    const isPublicRoute =
      currentPath.includes('/platform') ||
      currentPath.includes('/auth/register-tenant') ||
      currentPath.includes('/onboarding/register') ||
      currentPath.includes('/auth/login');

    // Logging is active to help debug the "Millions of Users" scale-up
    this.logger.debug(`Path: ${currentPath} | Public: ${isPublicRoute} | Tenant: ${tenantId}`);

    // 1. Block access if it's a private route and no Tenant ID is provided
    if (!tenantId && !isPublicRoute) {
      throw new UnauthorizedException('Missing X-Tenant-ID header');
    }

    // 2. If a Tenant ID is present, wrap the request in the AsyncLocalStorage context
    if (tenantId) {
      return this.tenantContextService.run(tenantId, () => next());
    }

    // 3. For public routes without a Tenant ID, simply proceed
    next();
  }
}