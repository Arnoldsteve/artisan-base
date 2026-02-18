import { Currency } from "./currency";

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  customDomain?: string | null;
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';
  baseCurrency: Currency;
  timezone: string;
  locale: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  settings: Record<string, any>;
}

/**
 * Used for Scenario 2: Existing user adding a store via sidebar
 */
export interface CreateStoreDto {
  name: string;
  subdomain: string;
  currency?: Currency;
  timezone?: string;
}

export interface UpdateTenantDto {
  name?: string;
  currency?: Currency;
  timezone?: string;
  settings?: Record<string, any>;
}

export interface AvailabilityResponse {
  available: boolean;
}