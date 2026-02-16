import { TenantContextService } from '@/common/tenant-context/tenant-context.service';
import { PrismaClient } from '@generated/prisma/client';

/**
 * List of models that have a 'tenantId' field and require row-level isolation.
 * Models NOT in this list (User, Tenant, SubscriptionPlan) are global.
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
          // 1. Check if the model requires isolation
          const isIsolated = TENANT_ISOLATED_MODELS.includes(model);
          const tenantId = tenantContext.getTenantId();

          // If the model is not isolated OR we have no tenantId (e.g. login), proceed normally
          if (!isIsolated || !tenantId) {
            return query(args);
          }

          // 2. Handle Capitalization for findUnique fallback
          // Prisma sends 'Product', we need 'product' to access prisma[model]
          const modelKey = (model.charAt(0).toLowerCase() + model.slice(1)) as keyof PrismaClient;

          // 3. READ Operations (Filter by tenantId)
          if (
            [
              'findFirst',
              'findFirstOrThrow',
              'findMany',
              'count',
              'aggregate',
              'groupBy',
              'update',
              'updateMany',
              'delete',
              'deleteMany',
              'upsert',
            ].includes(operation)
          ) {
            const castedArgs = args as any;
            castedArgs.where = { ...castedArgs.where, tenantId };
          }

          // 4. UNIQUE Operations (Redirect to findFirst to allow tenantId filter)
          if (operation === 'findUnique' || operation === 'findUniqueOrThrow') {
            const op = operation === 'findUnique' ? 'findFirst' : 'findFirstOrThrow';
            const castedArgs = args as any;
            
            return (prisma[modelKey] as any)[op]({
              ...castedArgs,
              where: { ...castedArgs.where, tenantId },
            });
          }

          // 5. WRITE Operations (Assign tenantId)
          if (operation === 'create') {
            const castedArgs = args as any;
            castedArgs.data = { ...castedArgs.data, tenantId };
          }

          if (operation === 'createMany') {
            const castedArgs = args as any;
            if (Array.isArray(castedArgs.data)) {
              castedArgs.data = castedArgs.data.map((item: any) => ({
                ...item,
                tenantId,
              }));
            }
          }

          return query(args);
        },
      },
    },
  });
};

export type ExtendedPrismaClient = ReturnType<typeof extendedPrismaClient>;