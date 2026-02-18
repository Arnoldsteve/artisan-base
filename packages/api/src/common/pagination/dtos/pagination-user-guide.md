/**
 * PAGINATION SYSTEM USAGE GUIDE
 * Top 0.001% Enterprise Pagination
 * 
 * This guide shows how to use all 5 advanced features in your services.
 */

import { PageOptionsDto, PageDto, PageMetaDto } from './dtos';

// ==================== EXAMPLE 1: BASIC OFFSET PAGINATION ====================
async function basicPagination(pageOptions: PageOptionsDto) {
  // URL: ?page=1&take=10&sortBy=name&order=ASC
  
  const [data, total] = await Promise.all([
    prisma.product.findMany({
      skip: pageOptions.skip,
      take: pageOptions.take,
      orderBy: pageOptions.buildOrderBy(), // Multi-field sort support
    }),
    prisma.product.count()
  ]);

  const meta = new PageMetaDto({ pageOptionsDto: pageOptions, itemCount: total });
  return new PageDto(data, meta);
}

// ==================== EXAMPLE 2: CURSOR PAGINATION ====================
async function cursorPagination(pageOptions: PageOptionsDto) {
  // URL: ?cursor=abc123&take=20
  // Better for infinite scroll and real-time feeds
  
  const data = await prisma.product.findMany({
    take: pageOptions.take,
    ...(pageOptions.cursor && {
      skip: 1, // Skip the cursor itself
      cursor: { id: pageOptions.cursor }
    }),
    orderBy: pageOptions.buildOrderBy()
  });

  const nextCursor = data.length === pageOptions.take 
    ? data[data.length - 1].id 
    : null;

  const meta = new PageMetaDto({
    pageOptionsDto: pageOptions,
    itemCount: data.length,
    nextCursor
  });

  return new PageDto(data, meta);
}

// ==================== EXAMPLE 3: MULTI-FIELD SORT ====================
async function multiFieldSort(pageOptions: PageOptionsDto) {
  // URL: ?sortBy=category,price,name&sortOrder=ASC,DESC,ASC
  // Sorts by category ascending, then price descending, then name ascending
  
  const orderBy = pageOptions.buildOrderBy();
  // Returns: [{ category: 'asc' }, { price: 'desc' }, { name: 'asc' }]

  const data = await prisma.product.findMany({
    skip: pageOptions.skip,
    take: pageOptions.take,
    orderBy
  });

  // ... rest of pagination
}

// ==================== EXAMPLE 4: FIELD-SPECIFIC FILTERS & RANGES ====================
async function advancedFiltering(pageOptions: PageOptionsDto) {
  // URL: ?filter.price.gte=1000&filter.price.lte=5000&filter.category.in=electronics,furniture
  
  const filterWhere = pageOptions.buildWhereFromFilters();
  // Returns: { price: { gte: 1000, lte: 5000 }, category: { in: ['electronics', 'furniture'] } }

  // Combine with search if provided
  const where = {
    ...filterWhere,
    ...(pageOptions.search && {
      OR: [
        { name: { contains: pageOptions.search, mode: 'insensitive' } },
        { description: { contains: pageOptions.search, mode: 'insensitive' } }
      ]
    })
  };

  const [data, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip: pageOptions.skip,
      take: pageOptions.take,
      orderBy: pageOptions.buildOrderBy()
    }),
    prisma.product.count({ where })
  ]);

  // ... rest of pagination
}

// ==================== EXAMPLE 5: FACETED SEARCH ====================
async function facetedSearch(pageOptions: PageOptionsDto) {
  // URL: ?facets=true&filter.category.in=electronics
  
  const where = pageOptions.buildWhereFromFilters();

  const [data, total, facets] = await Promise.all([
    prisma.product.findMany({
      where,
      skip: pageOptions.skip,
      take: pageOptions.take,
      orderBy: pageOptions.buildOrderBy()
    }),
    prisma.product.count({ where }),
    
    // Only compute facets if requested (expensive operation)
    pageOptions.facets ? Promise.all([
      // Category facets
      prisma.product.groupBy({
        by: ['categoryId'],
        where,
        _count: true
      }).then(groups => ({
        categories: groups.map(g => ({
          id: g.categoryId,
          count: g._count
        }))
      })),
      
      // Price range facets
      prisma.product.groupBy({
        by: ['price'],
        where,
        _count: true
      }).then(groups => {
        // Custom logic to bucket prices into ranges
        const ranges = {
          '0-1000': 0,
          '1000-5000': 0,
          '5000+': 0
        };
        groups.forEach(g => {
          const price = Number(g.price);
          if (price < 1000) ranges['0-1000'] += g._count;
          else if (price < 5000) ranges['1000-5000'] += g._count;
          else ranges['5000+'] += g._count;
        });
        return { priceRanges: ranges };
      })
    ]).then(results => Object.assign({}, ...results)) : undefined
  ]);

  const meta = new PageMetaDto({
    pageOptionsDto: pageOptions,
    itemCount: total,
    facets
  });

  return new PageDto(data, meta);
}

// ==================== COMPLETE EXAMPLE: ALL FEATURES ====================
export async function completeExample(pageOptions: PageOptionsDto) {
  const where = {
    ...pageOptions.buildWhereFromFilters(),
    ...(pageOptions.search && {
      OR: [
        { name: { contains: pageOptions.search, mode: 'insensitive' } },
        { sku: { contains: pageOptions.search, mode: 'insensitive' } }
      ]
    })
  };

  // If cursor-based, use cursor logic
  const queryOptions = pageOptions.cursor ? {
    take: pageOptions.take,
    skip: 1,
    cursor: { id: pageOptions.cursor },
    orderBy: pageOptions.buildOrderBy()
  } : {
    skip: pageOptions.skip,
    take: pageOptions.take,
    orderBy: pageOptions.buildOrderBy()
  };

  const [data, total, facets] = await Promise.all([
    prisma.product.findMany({ where, ...queryOptions }),
    prisma.product.count({ where }),
    pageOptions.facets ? computeFacets(where) : undefined
  ]);

  const nextCursor = pageOptions.cursor && data.length === pageOptions.take
    ? data[data.length - 1].id
    : null;

  const meta = new PageMetaDto({
    pageOptionsDto: pageOptions,
    itemCount: total,
    nextCursor,
    facets
  });

  return new PageDto(data, meta);
}