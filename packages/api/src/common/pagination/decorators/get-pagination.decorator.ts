import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { PageOptionsDto } from '../dtos/page-options.dto';
import { BadRequestException } from '@nestjs/common';

export const Pagination = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): PageOptionsDto => {
    const request = ctx.switchToHttp().getRequest();
    
    // Transform raw query string into typed DTO
    const dto = plainToInstance(PageOptionsDto, request.query, {
      enableImplicitConversion: true,
    });

    // Enterprise validation: Ensure no malicious skip/take values
    const errors = validateSync(dto);
    if (errors.length > 0) {
      throw new BadRequestException('Invalid pagination parameters');
    }

    return dto;
  },
);