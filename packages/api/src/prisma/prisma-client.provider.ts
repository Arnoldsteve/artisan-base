import { PrismaClient } from '@generated/prisma/client';
import { TenantContextService } from '../common/tenant-context/tenant-context.service';

/**
 * SOLID Principle: Open/Closed
 * Models NOT in this list (User, Tenant, SubscriptionPlan) are global 
 * and will bypass the tenantId injection.
 */
const TENANT_ISOLATED_MODELS = [
  'TenantMember',
  'Product',
  'Category',
  'ProductCategory',
  'ProductVariant',
  'Order',
  'OrderItem',
  'Payment',
  'Customer',
  'Review',
  'AnalyticsDailyRevenue',
  'TenantSubscription',
];

export const extendedPrismaClient = (
  prisma: PrismaClient,
  tenantContext: TenantContextService,
) => {
  return prisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const isIsolated = TENANT_ISOLATED_MODELS.includes(model);
          const tenantId = tenantContext.getTenantId();

          // 1. GLOBAL BYPASS: Skip isolation if model isn't isolated or no context exists
          if (!isIsolated || !tenantId) {
            return query(args);
          }

          // cast to any to handle dynamic property injection safely
          const _args = args as any;
          
          // Map PascalCase 'Product' to camelCase 'product' for prisma[modelKey] access
          const modelKey = (model.charAt(0).toLowerCase() + model.slice(1)) as keyof PrismaClient;

          // 2. UNIQUE REDIRECTION: findUnique -> findFirst (and flatten compound keys)
          if (operation === 'findUnique' || operation === 'findUniqueOrThrow') {
            const op = operation === 'findUnique' ? 'findFirst' : 'findFirstOrThrow';
            
            let newWhere = { ..._args.where };

            // SMART FLATTEN: Convert { tenantId_userId: { userId } } to { userId }
            // findFirst does not understand compound key object syntax
            for (const key of Object.keys(newWhere)) {
              if (
                typeof newWhere[key] === 'object' && 
                !Array.isArray(newWhere[key]) && 
                newWhere[key] !== null
              ) {
                const compoundValue = newWhere[key];
                delete newWhere[key];
                newWhere = { ...newWhere, ...compoundValue };
              }
            }

            return (prisma[modelKey] as any)[op]({
              ..._args,
              where: { ...newWhere, tenantId },
            });
          }

          // 3. READ ISOLATION: Inject tenantId into where clause
          const filteredOps = [
            'findFirst', 'findFirstOrThrow', 'findMany', 'count', 
            'aggregate', 'groupBy', 'update', 'updateMany', 
            'delete', 'deleteMany', 'upsert'
          ];
          
          if (filteredOps.includes(operation)) {
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
};

export type ExtendedPrismaClient = ReturnType<typeof extendedPrismaClient>;