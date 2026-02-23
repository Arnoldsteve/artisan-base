import { apiClient } from "@/lib/api-client";

/**
 * SOLID Principle: Single Responsibility
 * This service handles the initial handshake between the public URL 
 * and the isolated backend database rows.
 */

export interface TenantProfile {
  id: string;
  name: string;
  subdomain: string;
  baseCurrency: string;
  settings: Record<string, any>;
}

export class TenantService {
  /**
   * PUBLIC: Resolves the store's unique ID and settings from the URL slug.
   * Example: artisanbase.com/shop/modern-decor -> returns tenantId for 'modern-decor'
   */
  async resolveStore(slug: string): Promise<TenantProfile> {
    // Note: This endpoint was whitelisted in our backend middleware
    return apiClient.get<TenantProfile>(`/tenant/resolve/${slug}`);
  }
}

export const tenantService = new TenantService();