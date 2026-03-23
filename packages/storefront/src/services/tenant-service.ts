import { apiClient } from "@/lib/api-client";

/**
 * SOLID Principle: Single Responsibility
 * Refactored to include Branding and Metadata for the Shop Home Page.
 */
export interface TenantProfile {
  id: string;
  name: string;
  subdomain: string;
  baseCurrency: string;

  description?: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  city?: string | null;

  _count?: {
    products: number;
    reviews: number;
  };

  settings: Record<string, any>;
  averageRating?: number;
  createdAt: string;
}

export class TenantService {
  /**
   * PUBLIC: Resolves the store's unique ID and profile data from the URL slug.
   * millions of users: Returns the branding assets needed for the first paint.
   */
  async resolveStore(slug: string): Promise<TenantProfile> {
    return apiClient.get<TenantProfile>(`/tenant/resolve/${slug}`);
  }
}

export const tenantService = new TenantService();
