// import { Injectable } from '@nestjs/common';
// import { PageOptionsDto } from './dtos/page-options.dto';
// import { PageMetaDto } from './dtos/page-meta.dto';
// import { PageDto } from './dtos/page.dto';

// @Injectable()
// export class PaginationHelper {
//   /**
//    * Generates Prisma-ready query arguments
//    */
//   public createQueryOptions(pageOptionsDto: PageOptionsDto) {
//     const { take, cursor, skip, sortBy, order } = pageOptionsDto;

//     return {
//       take,
//       // Use cursor if provided (high scale), otherwise fallback to offset (dashboards)
//       ...(cursor
//         ? { skip: 1, cursor: { id: cursor } }
//         : { skip }),
//       orderBy: {
//         [sortBy]: order,
//       },
//     };
//   }

//   /**
//    * Wraps data in an enterprise PageDto with full metadata
//    */
//   public toPageDto<T>(data: T[], itemCount: number, pageOptionsDto: PageOptionsDto): PageDto<T> {
//     const hasNextPage = data.length === pageOptionsDto.take;
//     const nextCursor = hasNextPage ? (data[data.length - 1] as any).id : null;

//     const meta = new PageMetaDto({
//       itemCount,
//       pageOptionsDto,
//       nextCursor,
//     });

//     return new PageDto(data, meta);
//   }
// }