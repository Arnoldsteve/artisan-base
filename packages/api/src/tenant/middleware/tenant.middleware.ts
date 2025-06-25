import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { RequestWithTenant } from 'src/common/interfaces/request-with-tenant.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(
    private readonly managementPrisma: PrismaService,
  ) {}

  async use(req: RequestWithTenant, res: Response, next: NextFunction) {
    // ... the rest of the code remains exactly the same
    const hostname = req.hostname;
    const subdomain = hostname.split('.')[0];

    if (!subdomain) {
      throw new NotFoundException('Could not identify tenant from subdomain.');
    }

    const tenant = await this.managementPrisma.tenant.findUnique({
      where: { subdomain },
    });

    if (!tenant || tenant.status !== 'ACTIVE') {
      throw new NotFoundException(`Store '${subdomain}' not found or is inactive.`);
    }

    req.tenant = tenant;

    next();
  }
}