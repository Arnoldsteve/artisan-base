import { Prisma } from '@generated/prisma/client';
import { CacheHelperService } from '@/common/cache/cache-helper.service';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
import { CacheEngine } from '../../common/cache/cache.engine';

/**
 * Enterprise Cache Extension
 * Implements Transparent Cache-Aside and O(1) Namespace Invalidation.
 */
export const cacheExtension = (
  cacheHelper: CacheHelperService,
  tenantContext: TenantContextService
) =>
  Prisma.defineExtension({
    name: 'cache-extension',
    model: {
      $allModels: {
        /**
         * The .cacheable() directive.
         * Wraps findMany in the versioned cache-aside logic.
         */
        async cacheable<T, A>(
          this: T,
          args: Prisma.Args<T, 'findMany'>,
          ttl?: number
        ): Promise<Prisma.Result<T, A, 'findMany'>> {
          const context = this as any;
          const modelName = context.name;
          const tenantId = tenantContext.getTenantIdOrThrow();
          
          // 1. Map Model to Namespace (e.g., Product -> PRODUCT_LIST)
          const namespace = CacheEngine.getNamespaceForModel(modelName);
          
          // 2. Generate fingerprint for unique query arguments
          const subKey = CacheEngine.generateSubKey(args);

          // 3. Delegate to the Versioned Cache Orchestrator
          return cacheHelper.getOrSet(
            tenantId,
            namespace,
            subKey,
            () => context.findMany(args),
            { ttl }
          );
        },
      },
    },
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          // Execute the database write operation
          const result = await query(args);

          // REACTIVE INVALIDATION: Watch for changes to clear the list cache
          const writeOps = [
            'create', 'createMany', 'update', 'updateMany', 
            'delete', 'deleteMany', 'upsert'
          ];

          if (writeOps.includes(operation)) {
            const tenantId = tenantContext.getTenantId();
            if (tenantId) {
              const namespace = CacheEngine.getNamespaceForModel(model);
              
              // Increment version pointer: O(1) instant invalidation
              // We do not await this to avoid blocking the API response
              cacheHelper.invalidateNamespace(tenantId, namespace).catch(() => {});
            }
          }

          return result;
        },
      },
    },
  });