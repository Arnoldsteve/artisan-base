export interface CreateTenantDto {
    storeName: string;
    subdomain: string;
}

export interface Tenant {
    id: string;
    subdomain: string;
    customDomain?: string | null
    name: string;
    dbSchema: string;
    status: string;
    createdAt: string;
}

export interface CreateTenantResponse {
    success: boolean;
    tenant: Tenant;
    message: string;
    url: string;
}

export interface AvailabilityResponse {
    isAvailable: boolean;
    suggestions: string[];
}