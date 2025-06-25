import { Injectable, Logger, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { RequestWithTenant } from '../../common/interfaces/request-with-tenant.interface';
import { log } from 'console';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly managementPrisma: PrismaService) {}

  async use(req: RequestWithTenant, res: Response, next: NextFunction) {
    const hostname = req.hostname;
    Logger.log(`[TenantMiddleware] Received request with hostname: "${hostname}"`);
    
    // This is the correct way to get the first part of the hostname.
    const subdomain = hostname.split('.')[0]; 

    // Add a log here to be 100% sure what is being parsed
    Logger.log(`[TenantMiddleware] Parsing hostname: "${hostname}", Found subdomain: "${subdomain}"`);

    if (!subdomain) {
      throw new NotFoundException('Could not identify tenant from subdomain.');
    }

    const tenant = await this.managementPrisma.tenant.findUnique({
      // Ensure you are using the 'subdomain' variable parsed from the request
      where: { subdomain: subdomain }, 
    });
    Logger.log(`[TenantMiddleware] Found tenant: ${tenant ? tenant.id : 'none'}`);

    if (!tenant || tenant.status !== 'ACTIVE') {
      throw new NotFoundException(`Store with subdomain '${subdomain}' not found or is inactive.`);
    }
    
    req.tenant = tenant;
    next();
  }
}