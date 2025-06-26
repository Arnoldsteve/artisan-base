// packages/api/src/common/helpers/paginate.helper.ts

import { PaginatedResult } from '../interfaces/paginated-result.interface';

export type PaginateOptions = {
  page?: number;
  limit?: number;
};

// Define a more specific type for the query arguments passed from your service
type QueryArgs = {
  where?: object;
  include?: object;
  select?: object;
  orderBy?: object | object[];
};

type ModelDelegate = {
  // Define the expected shape of the Prisma model
  count: (args?: { where?: object }) => Promise<number>;
  findMany: (args?: any) => Promise<any[]>;
};

export async function paginate<T>(
  model: ModelDelegate,
  options: PaginateOptions = {},
  queryArgs: QueryArgs = {},
): Promise<PaginatedResult<T>> {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;

  // 1. Get the total count of records, using ONLY the 'where' clause from the query.
  // This prevents 'include' or 'select' from being passed to .count()
  const total = await model.count({
    where: queryArgs.where,
  });

  // 2. Get the actual data for the current page, using the FULL query.
  const data = await model.findMany({
    ...queryArgs,
    take: limit,
    skip: skip,
  });

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