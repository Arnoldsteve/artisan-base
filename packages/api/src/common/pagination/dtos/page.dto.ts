import { ApiProperty } from '@nestjs/swagger';
import { PageOptionsDto } from './page-options.dto';

export class PageMetaDto {
  readonly page: number;
  readonly take: number;
  readonly itemCount: number;
  readonly pageCount: number;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;
  readonly nextCursor?: string | null;

  constructor(itemCount: number, pageOptions: PageOptionsDto, hasMore: boolean, lastId?: string) {
    this.page = pageOptions.page ?? 1;
    this.take = pageOptions.take ?? 10;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.take);
    this.hasPreviousPage = this.page > 1;
    // High-scale check: if we are using cursors, hasNextPage is based on data length
    this.hasNextPage = pageOptions.cursor ? hasMore : this.page < this.pageCount;
    this.nextCursor = this.hasNextPage ? lastId : null;
  }
}

export class PageDto<T> {
  @ApiProperty({ isArray: true })
  readonly data: T[];

  @ApiProperty()
  readonly meta: PageMetaDto;

  constructor(data: T[], itemCount: number, pageOptions: PageOptionsDto) {
    const lastItem = data.length > 0 ? (data[data.length - 1] as any) : null;
    const hasMore = data.length >= (pageOptions.take ?? 10);
    
    this.data = data;
    this.meta = new PageMetaDto(itemCount, pageOptions, hasMore, lastItem?.id);
  }
}