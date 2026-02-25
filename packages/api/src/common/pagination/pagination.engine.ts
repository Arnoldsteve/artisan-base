import { PageOptionsDto } from './dtos/page-options.dto';
import { PageDto } from './dtos/page.dto';
import { CacheHelperService } from '../cache/cache-helper.service';
import { CacheEngine } from '../cache/cache.engine';
import { CACHE_TTLS } from '../cache/cache-ttls.config';

export async function executePagination<T>(
  modelContext: any,
  args: any & { options: PageOptionsDto; cache?: boolean; ttl?: number },
  cacheHelper: CacheHelperService,
  tenantId: string
): Promise<PageDto<T>> {
  const { options, where, cache, ttl, ...findManyArgs } = args;
  const modelName = modelContext.name;

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

  if (cache) {
    const namespace = CacheEngine.getNamespaceForModel(modelName);
    
    // SMART POLICY LOOKUP: Use provided ttl OR lookup from policy OR use global default
    const resolvedTtl = ttl ?? CACHE_TTLS[namespace] ?? CACHE_TTLS.DEFAULT;

    const subKey = CacheEngine.generateSubKey({ ...args, tenantId });

    return cacheHelper.getOrSet(
      tenantId,
      namespace,
      subKey,
      queryExecutor,
      { ttl: resolvedTtl }
    );
  }

  return queryExecutor();
}