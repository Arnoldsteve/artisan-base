export interface CreateTenantDto {
  name: string;
  subdomain: string;
}
export interface Tenant {
  id: string;
  subdomain: string;
  customDomain?: string | null;
  name: string;
//   dbSchema: string;
  status: string;
  createdAt: string;
}

export interface CreateTenantResponse {
  message: string;
  data: {
    userId: string;
    tenantId: string;
    subdomain: string;
  };
}
export interface AvailabilityResponse {
  available: boolean;
}
