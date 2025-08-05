// File: packages/dasboard/src/services/tenant-service.ts

import { apiClient } from "@/lib/client-api";
import { 
  CreateTenantDto, 
  CreateTenantResponse,
  AvailabilityResponse 
} from "@/types/tenant";

/**
 * TenantService directly handles API communication for tenant (organization/store) management.
 */
export class TenantService {
  /**
   * Creates a new tenant (organization/store).
   * On success, returns the full creation response.
   * On failure, the apiClient will throw a structured ApiError.
   * @param tenantData - The data for the new tenant.
   */
  async createTenant(tenantData: CreateTenantDto): Promise<CreateTenantResponse> {
    return apiClient.post<CreateTenantResponse>("/tenants", tenantData);
  }

  /**
   * Checks if a given subdomain is available for a new tenant.
   * @param subdomain - The subdomain string to check.
   */
  async checkSubdomainAvailability(subdomain: string): Promise<AvailabilityResponse> {
    return apiClient.get<AvailabilityResponse>("/tenants/availability", { subdomain });
  }

  // You can add other tenant-related service methods here in the future,
  // for example, to fetch a list of all tenants a user belongs to.
  // async getMyTenants(): Promise<Tenant[]> {
  //   return apiClient.get<Tenant[]>("/tenants/my-tenants");
  // }
}

// Export a singleton instance of the service for use throughout the app.
export const tenantService = new TenantService();