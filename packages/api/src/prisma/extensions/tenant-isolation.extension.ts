import { Prisma, PrismaClient } from '@generated/prisma/client';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';

/**
 * Models that require strict tenant isolation.
 * Any model NOT in this list is treated as global.
 */
export const TENANT_ISOLATED_MODELS = [
  'TenantMember', 'Product', 'Category', 'ProductCategory',
  'ProductVariant', 'Order', 'OrderItem', 'Payment',
  'Customer', 'Review', 'AnalyticsDailyRevenue', 'TenantSubscription',
];

export const tenantIsolationExtension = (tenantContext: TenantContextService) => 
  Prisma.defineExtension({
    name: 'tenant-isolation',
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const isIsolated = TENANT_ISOLATED_MODELS.includes(model);
          const tenantId = tenantContext.getTenantId();

          // 1. GLOBAL BYPASS: Model is global or we are in a non-tenant context (e.g. system tasks)
          if (!isIsolated || !tenantId) {
            return query(args);
          }

          const _args = args as any;
          
          // Helper to access model dynamically on the base client
          const modelKey = (model.charAt(0).toLowerCase() + model.slice(1)) as keyof PrismaClient;

          // 2. UNIQUE REDIRECTION: findUnique -> findFirst (and flatten compound keys)
          // findFirst allows us to inject tenantId without knowing the specific compound key name
          if (operation === 'findUnique' || operation === 'findUniqueOrThrow') {
            const op = operation === 'findUnique' ? 'findFirst' : 'findFirstOrThrow';
            let newWhere = { ..._args.where };

            for (const key of Object.keys(newWhere)) {
              if (typeof newWhere[key] === 'object' && !Array.isArray(newWhere[key]) && newWhere[key] !== null) {
                const compoundValue = newWhere[key];
                delete newWhere[key];
                newWhere = { ...newWhere, ...compoundValue };
              }
            }

            // Execute via the base prisma client to avoid infinite loops
            return (tenantContext as any).prisma[modelKey][op]({
              ..._args,
              where: { ...newWhere, tenantId },
            });
          }

          // 3. READ ISOLATION: Inject tenantId into filters
          const readOps = ['findFirst', 'findFirstOrThrow', 'findMany', 'count', 'aggregate', 'groupBy', 'update', 'updateMany', 'delete', 'deleteMany', 'upsert'];
          if (readOps.includes(operation)) {
            _args.where = { ...(_args.where || {}), tenantId };
          }

          // 4. WRITE ISOLATION: Automatically assign tenantId to new records
          if (operation === 'create') {
            _args.data = { ...(_args.data || {}), tenantId };
          }

          if (operation === 'createMany') {
            if (Array.isArray(_args.data)) {
              _args.data = _args.data.map((item: any) => ({ ...item, tenantId }));
            }
          }

          return query(_args);
        },
      },
    },
  });