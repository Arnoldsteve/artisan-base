import { PrismaClient } from '@generated/prisma/client';
import { TenantContextService } from '../common/tenant-context/tenant-context.service';
import { paginationExtension } from './extensions/pagination.extension';
import { tenantIsolationExtension } from './extensions/tenant-isolation.extension';

/**
 * Enterprise Extended Prisma Client
 * Composes Pagination and Tenant Isolation into a single "Super Client".
 * 
 * Order of extension matters:
 * .paginate() calls findMany internally, which is then caught by the isolation extension.
 */
export const extendedPrismaClient = (
  prisma: PrismaClient,
  tenantContext: TenantContextService,
) => {
  return prisma
    .$extends(paginationExtension)
    .$extends(tenantIsolationExtension(tenantContext));
};

export type ExtendedPrismaClient = ReturnType<typeof extendedPrismaClient>;