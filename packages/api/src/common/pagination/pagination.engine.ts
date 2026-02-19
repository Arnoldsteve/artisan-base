import { PageOptionsDto } from './dtos/page-options.dto';
import { PageDto } from './dtos/page.dto';
import { CacheHelperService } from '../cache/cache-helper.service';
import { CacheEngine } from '../cache/cache.engine';

export async function executePagination<T>(
  modelContext: any,
  args: any & { 
    options: PageOptionsDto; 
    cache?: boolean; 
    ttl?: number 
  },
  cacheHelper: CacheHelperService, // Injected via the extension
  tenantId: string
): Promise<PageDto<T>> {
  const { options, where, cache, ttl, ...findManyArgs } = args;
  const modelName = modelContext.name;

  // 1. Define the DB Execution Logic
  const queryExecutor = async () => {
    const queryOptions = {
      take: options.take,
      orderBy: { [options.sortBy || 'createdAt']: options.order || 'desc' },
      ...(options.cursor ? { skip: 1, cursor: { id: options.cursor } } : { skip: options.skip || 0 }),
    };

    const [data, total] = await Promise.all([
      modelContext.findMany({ ...findManyArgs, ...queryOptions, where }),
      modelContext.count({ where }),
    ]);

    return new PageDto<T>(data, total, options);
  };

  // 2. Logic Branch: Cache Hit or DB Miss
  if (cache) {
    const namespace = CacheEngine.getNamespaceForModel(modelName);
    const subKey = CacheEngine.generateSubKey({ ...args, tenantId });

    return cacheHelper.getOrSet(
      tenantId,
      namespace,
      subKey,
      queryExecutor,
      { ttl }
    );
  }

  // 3. Fallback: Direct DB Query
  return queryExecutor();
}