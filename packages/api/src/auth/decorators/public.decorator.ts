import { SetMetadata } from '@nestjs/common';

/**
 * SOLID Principle: Open/Closed
 * This decorator allows us to mark specific routes as "Public",
 * signaling the JwtAuthGuard to skip authentication while still 
 * allowing the TenantContextMiddleware to identify the store.
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Decorator to bypass the Global JWT Auth Guard.
 * Usage: @Public()
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);