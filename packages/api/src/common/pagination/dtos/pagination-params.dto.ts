import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

/**
 * Enterprise standard sort directions
 */
export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class PaginationParamsDto {
  @ApiPropertyOptional({ 
    description: 'Number of items to skip (Offset-based)', 
    minimum: 0, 
    default: 0 
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  readonly skip?: number = 0;

  @ApiPropertyOptional({ 
    description: 'Items per page', 
    minimum: 1, 
    maximum: 100, 
    default: 10 
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  readonly take?: number = 10;

  @ApiPropertyOptional({ 
    description: 'The ID of the last item from the previous page (Cursor-based)' 
  })
  @IsString()
  @IsOptional()
  readonly cursor?: string;

  @ApiPropertyOptional({ 
    description: 'Field to sort by', 
    default: 'createdAt' 
  })
  @IsString()
  @IsOptional()
  readonly sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ 
    enum: SortOrder, 
    default: SortOrder.DESC 
  })
  @IsEnum(SortOrder)
  @IsOptional()
  readonly sortOrder?: SortOrder = SortOrder.DESC;

  @ApiPropertyOptional({ 
    description: 'Global search string' 
  })
  @IsString()
  @IsOptional()
  readonly search?: string;
}