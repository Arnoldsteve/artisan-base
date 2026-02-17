import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantContextService } from './tenant-context.service';

/**
 * SOLID Principle: Open/Closed
 * This middleware is now open to public platform routes while 
 * remaining closed (strict) for tenant-specific data routes.
 */
@Injectable()
export class TenantContextMiddleware implements NestMiddleware {
  constructor(private readonly tenantContextService: TenantContextService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const tenantId = req.headers['x-tenant-id'] as string;

    // 1. Identify "Global Platform" routes that DO NOT require a Tenant ID.
    // These are routes used for registration, login, or checking subdomains.
    const publicPaths = [
      '/onboarding',
      // '/auth/register',
      '/auth/login',
      '/auth/bootstrap', 
      '/health'
    ];

    // Check if the current request path matches any of our public paths
    const isPublicRoute = publicPaths.some(path => req.originalUrl.includes(path));

    // 2. Strict Check: If it's NOT a public route and NO tenantId is provided, block it.
    if (!tenantId && !isPublicRoute) {
      throw new UnauthorizedException('Missing X-Tenant-ID header for this protected resource');
    }

    // 3. Context Injection: 
    // If we have a tenantId, enter the "storage bubble".
    // If not (it's a public route), just proceed normally.
    if (tenantId) {
      this.tenantContextService.run(tenantId, () => {
        next();
      });
    } else {
      next();
    }
  }
}