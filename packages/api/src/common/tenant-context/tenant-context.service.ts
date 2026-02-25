import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

/**
 * SOLID Principle: Single Responsibility
 * This service is ONLY responsible for managing the lifecycle of the tenant context
 * using Node.js AsyncLocalStorage.
 */
@Injectable()
export class TenantContextService {
  // The 'bubble' that holds our tenantId for the duration of a request
  private static readonly storage = new AsyncLocalStorage<{ tenantId: string }>();

  /**
   * Sets the tenant ID and runs the callback within the context.
   * This is typically called by the Middleware.
   */
  run<T>(tenantId: string, callback: () => T): T {
    return TenantContextService.storage.run({ tenantId }, callback);
  }

  /**
   * Retrieves the current tenant ID from the context.
   * Returns undefined if called outside of a request context.
   */
  getTenantId(): string | undefined {
    const store = TenantContextService.storage.getStore();
    return store?.tenantId;
  }

  /**
   * Helper to ensure we have a tenantId, throwing an error if missing.
   * Useful for internal safety checks.
   */
  getTenantIdOrThrow(): string {
    const tenantId = this.getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context is missing. Ensure the TenantContextMiddleware is applied.');
    }
    return tenantId;
  }
}