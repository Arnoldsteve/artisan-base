import { Prisma, PrismaClient } from '@generated/prisma/client';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';

export const TENANT_ISOLATED_MODELS = [
  'TenantMember', 'Product', 'Category', 'ProductCategory',
  'ProductVariant', 'Order', 'OrderItem', 'Payment',
  'Customer', 'Review', 'AnalyticsDailyRevenue', 'TenantSubscription',
];

/**
 * Enterprise Tenant Isolation Extension
 * @param prisma The base Prisma client used for redirections
 * @param tenantContext The service managing AsyncLocalStorage
 */
export const tenantIsolationExtension = (
  prisma: PrismaClient, // <--- Add this parameter
  tenantContext: TenantContextService
) => 
  Prisma.defineExtension({
    name: 'tenant-isolation',
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const isIsolated = TENANT_ISOLATED_MODELS.includes(model);
          const tenantId = tenantContext.getTenantId();

          if (!isIsolated || !tenantId) {
            return query(args);
          }

          const _args = args as any;
          const modelKey = (model.charAt(0).toLowerCase() + model.slice(1)) as keyof PrismaClient;

          // UNIQUE REDIRECTION Logic
          if (operation === 'findUnique' || operation === 'findUniqueOrThrow') {
            const op = operation === 'findUnique' ? 'findFirst' : 'findFirstOrThrow';
            let newWhere = { ..._args.where };

            // Flatten compound keys (e.g., tenantId_slug -> slug)
            for (const key of Object.keys(newWhere)) {
              if (typeof newWhere[key] === 'object' && !Array.isArray(newWhere[key]) && newWhere[key] !== null) {
                const compoundValue = newWhere[key];
                delete newWhere[key];
                newWhere = { ...newWhere, ...compoundValue };
              }
            }

            // FIX: Use the 'prisma' instance passed into the factory.
            // This is the "Base Client" which is guaranteed to have the model keys.
            return (prisma[modelKey] as any)[op]({
              ..._args,
              where: { ...newWhere, tenantId },
            });
          }

          // READ ISOLATION
          const readOps = ['findFirst', 'findFirstOrThrow', 'findMany', 'count', 'aggregate', 'groupBy', 'update', 'updateMany', 'delete', 'deleteMany', 'upsert'];
          if (readOps.includes(operation)) {
            _args.where = { ...(_args.where || {}), tenantId };
          }

          // WRITE ISOLATION
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