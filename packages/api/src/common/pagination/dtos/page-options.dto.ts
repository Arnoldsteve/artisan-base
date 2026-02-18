import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min, IsObject } from 'class-validator';
import { Order } from '../constants/order.constant';

export class PageOptionsDto {
  // ==================== BASIC PAGINATION ====================
  
  @ApiPropertyOptional({ enum: Order, default: Order.DESC, description: 'Sort direction' })
  @IsEnum(Order)
  @IsOptional()
  readonly order?: Order = Order.DESC;

  @ApiPropertyOptional({ minimum: 1, default: 1, description: 'Page number (offset-based)' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @ApiPropertyOptional({ minimum: 1, maximum: 50, default: 10, description: 'Items per page' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly take?: number = 10;

  @ApiPropertyOptional({ description: 'Global search across multiple fields' })
  @IsString()
  @IsOptional()
  readonly search?: string;

  // ==================== TOP 0.001% FEATURES ====================

  // 1. CURSOR PAGINATION (for infinite scroll at scale)
  @ApiPropertyOptional({ description: 'Cursor (last item ID) for cursor-based pagination' })
  @IsString()
  @IsOptional()
  readonly cursor?: string;

  // 2. MULTI-FIELD SORT
  @ApiPropertyOptional({ 
    default: 'createdAt', 
    description: 'Comma-separated fields to sort by (e.g., "name,createdAt")' 
  })
  @IsString()
  @IsOptional()
  readonly sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Comma-separated sort directions matching sortBy fields (e.g., "ASC,DESC")',
    example: 'ASC,DESC'
  })
  @IsString()
  @IsOptional()
  readonly sortOrder?: string;

  // 3 & 4. FIELD-SPECIFIC FILTERS & RANGE QUERIES
  // Format: filter.field.operator=value
  // Examples: filter.price.gte=1000, filter.createdAt.gte=2024-01-01
  @ApiPropertyOptional({
    description: 'Field-specific filters (e.g., filter.price.gte=1000)',
    type: 'object',
    additionalProperties: true,  
    example: { 'price.gte': 1000, 'price.lte': 5000 }
  })
  @IsObject()
  @IsOptional()
  readonly filter?: Record<string, any>;

  // 5. FACETED SEARCH (enable aggregations)
  @ApiPropertyOptional({
    description: 'Enable faceted search to return aggregations',
    default: false
  })
  @Type(() => Boolean)
  @IsOptional()
  readonly facets?: boolean = false;

  // ==================== COMPUTED PROPERTIES ====================

  get skip(): number {
    return ((this.page || 1) - 1) * (this.take || 10);
  }

  /**
   * Parse sortBy into array of fields
   * "name,createdAt" → ["name", "createdAt"]
   */
  get sortFields(): string[] {
    return this.sortBy?.split(',').map(f => f.trim()) || ['createdAt'];
  }

  /**
   * Parse sortOrder into array matching sortFields
   * "ASC,DESC" → ["ASC", "DESC"]
   * If not provided, use default order for all fields
   */
  get sortDirections(): Order[] {
    if (!this.sortOrder) {
      return this.sortFields.map(() => this.order || Order.DESC);
    }
    const orders = this.sortOrder.split(',').map(o => o.trim().toUpperCase() as Order);
    // Pad with default order if not enough provided
    while (orders.length < this.sortFields.length) {
      orders.push(this.order || Order.DESC);
    }
    return orders;
  }

  /**
   * Build Prisma orderBy from multi-field sort
   * Returns: [{ name: 'asc' }, { createdAt: 'desc' }]
   */
  buildOrderBy(): Record<string, 'asc' | 'desc'>[] {
    return this.sortFields.map((field, index) => ({
      [field]: this.sortDirections[index] === Order.ASC ? 'asc' : 'desc'
    }));
  }

  /**
   * Parse filter object into Prisma where clause
   * filter.price.gte=1000 → { price: { gte: 1000 } }
   * filter.name.contains=chair → { name: { contains: 'chair' } }
   */
  buildWhereFromFilters(): Record<string, any> {
    if (!this.filter) return {};

    const where: Record<string, any> = {};

    Object.keys(this.filter).forEach(key => {
      // Parse "field.operator" format
      const parts = key.split('.');
      if (parts.length !== 2) return;

      const [field, operator] = parts;
      const value = this.filter![key];

      if (!where[field]) {
        where[field] = {};
      }

      // Map operators to Prisma operators
      switch (operator) {
        case 'gte':
        case 'lte':
        case 'gt':
        case 'lt':
        case 'equals':
        case 'contains':
        case 'startsWith':
        case 'endsWith':
          where[field][operator] = value;
          break;
        case 'in':
          where[field].in = Array.isArray(value) ? value : value.split(',');
          break;
        case 'notIn':
          where[field].notIn = Array.isArray(value) ? value : value.split(',');
          break;
      }
    });

    return where;
  }
}