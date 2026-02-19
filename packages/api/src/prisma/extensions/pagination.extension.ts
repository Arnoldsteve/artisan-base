import { Prisma } from '@generated/prisma/client';
import { PageOptionsDto } from '../../common/pagination/dtos/page-options.dto';
import { PageDto } from '../../common/pagination/dtos/page.dto';
import { executePagination } from '../../common/pagination/pagination.engine';

/**
 * Functional Prisma Extension for Pagination
 * This satisfies the "Single Responsibility" principle by isolating 
 * pagination logic from tenant security logic.
 */
export const paginationExtension = Prisma.defineExtension({
  name: 'pagination',
  model: {
    $allModels: {
      async paginate<T, A>(
        this: T,
        args: Prisma.Args<T, 'findMany'> & { options: PageOptionsDto }
      ): Promise<PageDto<Prisma.Result<T, A, 'findMany'>[number]>> {
        // Delegate to the Logic Engine
        return executePagination<any, any>(this, args);
      },
    },
  },
});