import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PageOptionsDto } from './page-options.dto';

export interface PageMetaDtoParameters {
  pageOptionsDto: PageOptionsDto;
  itemCount: number;
  nextCursor?: string | null;
  facets?: Record<string, any>;
}

export class PageMetaDto {
  @ApiProperty({ description: 'Current page number' })
  readonly page: number;

  @ApiProperty({ description: 'Items per page' })
  readonly take: number;

  @ApiProperty({ description: 'Total number of items' })
  readonly itemCount: number;

  @ApiProperty({ description: 'Total number of pages' })
  readonly pageCount: number;

  @ApiProperty({ description: 'Whether there is a previous page' })
  readonly hasPreviousPage: boolean;

  @ApiProperty({ description: 'Whether there is a next page' })
  readonly hasNextPage: boolean;

  // ==================== TOP 0.001% FEATURES ====================

  @ApiPropertyOptional({ description: 'Cursor for next page (cursor-based pagination)' })
  readonly nextCursor?: string | null;

  @ApiPropertyOptional({ 
    description: 'Faceted search results (aggregations)',
    type: 'object',
    additionalProperties: true,  
    example: {
      categories: [
        { id: '1', name: 'Electronics', count: 45 },
        { id: '2', name: 'Furniture', count: 23 }
      ],
      priceRanges: [
        { range: '0-1000', count: 12 },
        { range: '1000-5000', count: 34 }
      ]
    }
  })

  readonly facets?: Record<string, any>;

  constructor({ pageOptionsDto, itemCount, nextCursor, facets }: PageMetaDtoParameters) {
    this.page = pageOptionsDto.page || 1;
    this.take = pageOptionsDto.take || 10;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
    this.nextCursor = nextCursor;
    this.facets = facets;
  }
}