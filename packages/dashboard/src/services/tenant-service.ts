import { apiClient } from "@/lib/client-api";
import { 
  CreateTenantDto, 
  CreateTenantResponse,
  AvailabilityResponse 
} from "@/types/tenant";


export class TenantService {

  async createTenant(tenantData: CreateTenantDto): Promise<CreateTenantResponse> {
    return apiClient.post<CreateTenantResponse>("/tenants", tenantData);
  }

 
  async checkSubdomainAvailability(subdomain: string): Promise<AvailabilityResponse> {
    return apiClient.get<AvailabilityResponse>("/tenants/availability", { subdomain });
  }

  // You can add other tenant-related service methods here in the future,
  // for example, to fetch a list of all tenants a user belongs to.
  // async getMyTenants(): Promise<Tenant[]> {
  //   return apiClient.get<Tenant[]>("/tenants/my-tenants");
  // }
}

export const tenantService = new TenantService();