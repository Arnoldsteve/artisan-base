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

     // 1. Identify "Global Discovery" routes
    // These routes should work BOTH with a tenant header (Storefront)
    // AND without a tenant header (Marketplace).
    const storefrontDiscoveryPaths = [
      '/products',
      '/products/slug',
      '/categories',
      '/reviews',
    ]

    // 2. Identify "Platform" routes (Login, Onboarding)
    const platformPaths  = [
      '/onboarding',
      '/auth/login',
      '/auth/bootstrap', 
      '/health',
      '/plans',
      '/payments/webhook',
      '/tenant/resolve', 
    ];

   const isStorefrontDiscovery = storefrontDiscoveryPaths.some(path => req.originalUrl.includes(path));
    const isPlatformPath = platformPaths.some(path => req.originalUrl.includes(path));
    
    // Check for Scenario 2: Store Creation
    const isStoreCreation = req.originalUrl.endsWith('/tenant') && req.method === 'POST';

    // A route is exempt if it's a platform path, store creation, OR a discovery path
    const isHeaderOptional = isPlatformPath || isStoreCreation || isStorefrontDiscovery;

    // 3. Strict Check: Only block if the route is NOT exempt and no header is present
    if (!tenantId && !isHeaderOptional) {
      throw new UnauthorizedException('Missing X-Tenant-ID header for this resource');
    }

    // 4. Context Injection: Enter the "Bubble" only if we actually have an ID
    if (tenantId) {
      this.tenantContextService.run(tenantId, () => {
        next();
      });
    } else {
      // Proceed in Global Mode (no bubble)
      next();
    }
  }
}