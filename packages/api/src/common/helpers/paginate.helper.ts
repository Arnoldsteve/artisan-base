import { PaginatedResult } from '../interfaces/paginated-result.interface';

export type PaginateOptions = {
  page?: number;
  limit?: number;
};

type ModelDelegate = {
  count: (args?: any) => Promise<number>;
  findMany: (args?: any) => Promise<any[]>;
};

export async function paginate<T>(
  model: ModelDelegate,
  options: PaginateOptions = {},
  queryArgs: object = {},
): Promise<PaginatedResult<T>> {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;

  // --- THIS IS THE CORRECTED PART ---
  // Instead of a transaction, we run the two queries sequentially.
  // This is a robust and common pattern for pagination.
  const total = await model.count({ ...queryArgs });
  const data = await model.findMany({
    ...queryArgs,
    take: limit,
    skip: skip,
  });
  // --- END OF CORRECTION ---

  const lastPage = Math.ceil(total / limit);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      lastPage,
    },
  };
}