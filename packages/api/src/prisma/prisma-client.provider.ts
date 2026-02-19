import { PrismaClient } from '@generated/prisma/client';
import { TenantContextService } from '../common/tenant-context/tenant-context.service';
import { CacheHelperService } from '@/common/cache/cache-helper.service';
import { paginationExtension } from './extensions/pagination.extension';
import { tenantIsolationExtension } from './extensions/tenant-isolation.extension';
import { cacheExtension } from './extensions/cache.extension';

/**
 * Enterprise Extended Prisma Client
 * Chaining order is critical (Top to Bottom):
 * 1. Pagination: Adds the .paginate() method.
 * 2. Cache: Adds .cacheable() and watches for writes to invalidate.
 * 3. Isolation: The final gatekeeper that injects tenantId into all queries.
 */
export const extendedPrismaClient = (
  prisma: PrismaClient,
  tenantContext: TenantContextService,
  cacheHelper: CacheHelperService,
) => {
  return prisma
    // Now both extensions are aware of the cache and context
    .$extends(paginationExtension(cacheHelper, tenantContext))
    .$extends(cacheExtension(cacheHelper, tenantContext))
    .$extends(tenantIsolationExtension(tenantContext));
};

export type ExtendedPrismaClient = ReturnType<typeof extendedPrismaClient>;