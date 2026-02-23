import { Prisma } from '@generated/prisma/client';
import { PageOptionsDto } from '../../common/pagination/dtos/page-options.dto';
import { PageDto } from '../../common/pagination/dtos/page.dto';
import { executePagination } from '../../common/pagination/pagination.engine';
import { CacheHelperService } from '../../common/cache/cache-helper.service';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';

/**
 * Enterprise Integrated Pagination & Cache Extension
 * This allows a "Single-Call" approach for high-performance data listing.
 */
// ... (imports)

export const paginationExtension = (
  cacheHelper: CacheHelperService,
  tenantContext: TenantContextService
) => 
  Prisma.defineExtension({
    name: 'pagination',
    model: {
      $allModels: {
        async paginate<T, A>(
          this: T,
          args: Prisma.Args<T, 'findMany'> & { 
            options: PageOptionsDto; 
            cache?: boolean; 
            ttl?: number 
          }
        ): Promise<PageDto<Prisma.Result<T, A, 'findMany'>[number]>> {
          /**
           * TOP 1% LOGIC: Optional Isolation
           * If tenantId is missing (Marketplace mode), we fallback to 'global'.
           * This allows the same .paginate() method to work for both modes.
           */
          const tenantId = tenantContext.getTenantId() || 'global';
          
          return executePagination<any>(
            this, 
            args, 
            cacheHelper, 
            tenantId
          );
        },
      },
    },
  });