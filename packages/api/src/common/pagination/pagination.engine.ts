import { PageOptionsDto } from './dtos/page-options.dto';
import { PageDto } from './dtos/page.dto';

/**
 * Enterprise Pagination Engine
 * Pure logic for executing dual-strategy (Cursor/Offset) queries.
 */
export async function executePagination<T, A>(
  modelContext: any,
  args: any & { options: PageOptionsDto }
): Promise<PageDto<T>> {
  const { options, where, ...findManyArgs } = args;

  // 1. Build high-performance query structure
  const queryOptions = {
    take: options.take,
    orderBy: { [options.sortBy || 'createdAt']: options.order || 'desc' },
    ...(options.cursor 
      ? { skip: 1, cursor: { id: options.cursor } } 
      : { skip: options.skip || 0 }),
  };

  // 2. Parallel execution for high concurrency
  const [data, total] = await Promise.all([
    modelContext.findMany({
      ...findManyArgs,
      ...queryOptions,
      where,
    }),
    modelContext.count({ where }),
  ]);

  // 3. Wrap in unified enterprise response
  return new PageDto(data, total, options);
}