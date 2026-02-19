import { PrismaClient, Prisma } from '@generated/prisma/client';
import { TenantContextService } from '../common/tenant-context/tenant-context.service';
import { PageOptionsDto } from '../common/pagination/dtos/page-options.dto';
import { PageDto } from '../common/pagination/dtos/page.dto';

const TENANT_ISOLATED_MODELS = [
  'TenantMember', 'Product', 'Category', 'ProductCategory',
  'ProductVariant', 'Order', 'OrderItem', 'Payment',
  'Customer', 'Review', 'AnalyticsDailyRevenue', 'TenantSubscription',
];

export const extendedPrismaClient = (
  prisma: PrismaClient,
  tenantContext: TenantContextService,
) => {
  return prisma.$extends({
    // ==========================================
    // 1. MODEL COMPONENT: The "One-Line" Engine
    // ==========================================
    model: {
      $allModels: {
        async paginate<T, A>(
          this: T,
          args: Prisma.Args<T, 'findMany'> & { options: PageOptionsDto }
        ): Promise<PageDto<Prisma.Result<T, A, 'findMany'>[number]>>  {
          const context = this as any;
          const { options, where, ...findManyArgs } = args;

          // 1. Build Query Structure (Cursor-First Logic)
          const queryOptions = {
            take: options.take,
            orderBy: { [options.sortBy || 'createdAt']: options.order || 'desc' },
            ...(options.cursor 
              ? { skip: 1, cursor: { id: options.cursor } } 
              : { skip: options.skip || 0 }),
          };

          // 2. Parallel Execution for Performance
          // Note: Tenant isolation is automatically applied in the 'query' block below
          const [data, total] = await Promise.all([
            context.findMany({
              ...findManyArgs,
              ...queryOptions,
              where,
            }),
            context.count({ where }),
          ]);

          return new PageDto(data, total, options);
        },
      },
    },

    // ==========================================
    // 2. QUERY COMPONENT: Automatic Isolation
    // ==========================================
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const isIsolated = TENANT_ISOLATED_MODELS.includes(model);
          const tenantId = tenantContext.getTenantId();

          if (!isIsolated || !tenantId) return query(args);

          const _args = args as any;
          const modelKey = (model.charAt(0).toLowerCase() + model.slice(1)) as keyof PrismaClient;

          // UNIQUE REDIRECTION Logic
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

            return (prisma[modelKey] as any)[op]({
              ..._args,
              where: { ...newWhere, tenantId },
            });
          }

          // READ ISOLATION
          const filteredOps = ['findFirst', 'findFirstOrThrow', 'findMany', 'count', 'aggregate', 'groupBy', 'update', 'updateMany', 'delete', 'deleteMany', 'upsert'];
          if (filteredOps.includes(operation)) {
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
};

export type ExtendedPrismaClient = ReturnType<typeof extendedPrismaClient>;