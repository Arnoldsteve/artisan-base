import { apiClient } from "@/lib/client-api";
import { 
  Tenant,
  CreateStoreDto, 
  UpdateTenantDto,
  AvailabilityResponse 
} from "@/types/tenant";

export class TenantService {
  /**
   * Public: Check if a subdomain is taken
   */
  async checkSubdomainAvailability(subdomain: string): Promise<AvailabilityResponse> {
    return apiClient.get<AvailabilityResponse>(`/onboarding/check-subdomain`, { subdomain });
  }

  /**
   * Private: Get profile of the current store context
   */
  async getProfile(): Promise<Tenant> {
    return apiClient.get<Tenant>("/tenant/profile");
  }

  /**
   * Private: Update current store settings
   */
  async update(data: UpdateTenantDto): Promise<Tenant> {
    return apiClient.patch<Tenant>("/tenant/settings", data);
  }

  /**
   * Private: Create a new store (Scenario 2 - Switcher)
   */
  async provisionStore(data: CreateStoreDto): Promise<Tenant> {
    return apiClient.post<Tenant>("/tenant", data);
  }

  /**
   * Private: Delete store (Danger Zone)
   */
  async delete(): Promise<void> {
    return apiClient.delete("/tenant");
  }
}

export const tenantService = new TenantService();