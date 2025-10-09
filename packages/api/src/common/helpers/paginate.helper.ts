import { PaginatedResult } from '../interfaces/paginated-result.interface';

// Update the options to include the search term and the fields to search on
export type PaginateOptions = {
  page?: number;
  limit?: number;
  search?: string;
  searchableFields?: string[]; // e.g., ['name', 'email']
};

type QueryArgs = {
  where?: object;
  include?: object;
  select?: object;
  orderBy?: object | object[];
};

type ModelDelegate = {
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

  // --- THIS IS THE NEW SEARCH LOGIC ---
  let where = queryArgs.where || {}; // Start with existing where clause
  
  // If a search term and searchable fields are provided, build the search query
  if (options.search && options.searchableFields && options.searchableFields.length > 0) {
    const searchQuery = {
      OR: options.searchableFields.map(field => ({
        [field]: {
          contains: options.search,
          mode: 'insensitive', // Case-insensitive search
        },
      })),
    };

    // Merge the search query with any existing where clause
    where = {
      ...where,
      ...searchQuery,
    };
  }

  // Use the (potentially modified) where clause for both queries
  const [total, data] = await Promise.all([
    model.count({ where }),
    model.findMany({
      ...queryArgs, // Pass original include, select, orderBy
      where,       // Pass the new, combined where clause
      take: limit,
      skip,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,  
      prev: page > 1 ? page - 1 : null,  
      next: page < totalPages ? page + 1 : null,  
    },
  };
}