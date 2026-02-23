import { Prisma } from '@generated/prisma/client';
import { CacheHelperService } from '@/common/cache/cache-helper.service';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
import { CacheEngine } from '../../common/cache/cache.engine';

/**
 * Enterprise Cache Extension
 * Implements Transparent Cache-Aside and O(1) Namespace Invalidation.
 */
// ... (imports)

export const cacheExtension = (
  cacheHelper: CacheHelperService,
  tenantContext: TenantContextService,
) =>
  Prisma.defineExtension({
    name: 'cache-extension',
    model: {
      $allModels: {
        async cacheable<T, A>(
          this: T,
          args: Prisma.Args<T, 'findMany'>,
          ttl?: number,
        ): Promise<Prisma.Result<T, A, 'findMany'>> {
          const context = this as any;
          const modelName = context.name;

          /**
           * HYBRID CACHING:
           * Uses the tenantId as the primary partition key.
           * Falls back to 'global' for marketplace discovery routes.
           */
          const tenantId = tenantContext.getTenantId() || 'global';

          const namespace = CacheEngine.getNamespaceForModel(modelName);
          const subKey = CacheEngine.generateSubKey(args);

          return cacheHelper.getOrSet(
            tenantId,
            namespace,
            subKey,
            () => context.findMany(args),
            { ttl },
          );
        },
      },
    },
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const result = await query(args);

          const writeOps = [
            'create',
            'createMany',
            'update',
            'updateMany',
            'delete',
            'deleteMany',
            'upsert',
          ];

          if (writeOps.includes(operation)) {
            const tenantId = tenantContext.getTenantId();
            const namespace = CacheEngine.getNamespaceForModel(model);

            /**
             * REACTIVE INVALIDATION:
             * 1. Invalidate specific tenant cache.
             * 2. ALWAYS invalidate the 'global' marketplace cache for this model
             *    to ensure new products appear in search immediately.
             */
            if (tenantId) {
              cacheHelper
                .invalidateNamespace(tenantId, namespace)
                .catch(() => {});
            }
            cacheHelper
              .invalidateNamespace('global', namespace)
              .catch(() => {});
          }

          return result;
        },
      },
    },
  });
