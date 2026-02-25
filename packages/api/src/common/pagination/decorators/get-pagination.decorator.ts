import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { PageOptionsDto } from '../dtos/page-options.dto';

/**
 * @Pagination Decorator
 * 
 * Aspect-Oriented (AOP) approach to extract query parameters,
 * transform them into the typed PageOptionsDto, and perform 
 * enterprise-level validation in one step.
 */
export const Pagination = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): PageOptionsDto => {
    const request = ctx.switchToHttp().getRequest();
    
    // 1. Transform raw string-based Query into Typed DTO
    // enableImplicitConversion: true handles "10" (string) -> 10 (number)
    const dto = plainToInstance(PageOptionsDto, request.query, {
      enableImplicitConversion: true,
    });

    // 2. Perform Validation
    // This catches malicious "take" values (e.g., ?take=100000) or invalid cursors
    const errors = validateSync(dto);
    if (errors.length > 0) {
      // Return a 400 Bad Request if pagination parameters are malformed
      throw new BadRequestException('Invalid pagination parameters');
    }

    return dto;
  },
);