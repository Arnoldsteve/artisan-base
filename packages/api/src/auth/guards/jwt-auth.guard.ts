import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * SOLID Principle: Open/Closed
 * This guard is open to extension via metadata. It checks if a route
 * is marked with @Public() before attempting JWT verification.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // 1. Check if the @Public() decorator is present on the method or the class
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 2. If it is public, allow access immediately without checking for a token
    if (isPublic) {
      return true;
    }

    // 3. Otherwise, proceed with standard JWT verification
    return super.canActivate(context);
  }
}