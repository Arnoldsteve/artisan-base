import { Injectable, Logger, NestMiddleware, NotFoundException, BadRequestException } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { RequestWithTenant } from '../../common/interfaces/request-with-tenant.interface';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly managementPrisma: PrismaService) {}

  async use(req: RequestWithTenant, res: Response, next: NextFunction) {
    // --- THIS IS THE MODIFIED LOGIC ---

    // 1. Read the tenant identifier from the custom header.
    const tenantSubdomain = req.headers['x-tenant-id'] as string;
    
    // Log what we received for debugging.
    Logger.log(`[TenantMiddleware] Received request with x-tenant-id header: "${tenantSubdomain}"`);

    // 2. If the header is missing for a protected route, it's a bad request.
    // We only need a tenant for dashboard routes. We can check the URL.
    if (req.originalUrl.includes('/dashboard/') && !tenantSubdomain) {
      throw new BadRequestException('x-tenant-id header is required for this route.');
    }

    // 3. If there is no tenant ID, we don't need to do anything else.
    // This allows public routes (like login) to pass through without a tenant.
    if (!tenantSubdomain) {
        return next();
    }

    // 4. Find the tenant using the subdomain from the header.
    const tenant = await this.managementPrisma.tenant.findUnique({
      where: { subdomain: tenantSubdomain }, 
    });
    Logger.log(`[TenantMiddleware] Looked up tenant for subdomain "${tenantSubdomain}". Found: ${tenant ? tenant.id : 'none'}`);

    if (!tenant || tenant.status !== 'ACTIVE') {
      throw new NotFoundException(`Store with subdomain '${tenantSubdomain}' not found or is inactive.`);
    }
    
    // 5. Attach the tenant to the request and continue.
    Logger.log(`[TenantMiddleware] Successfully attached tenant ${tenant.id} to request.`);
    req.tenant = tenant;
    next();
  }
}