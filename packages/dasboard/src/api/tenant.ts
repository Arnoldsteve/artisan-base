// src/api/tenant.ts
import axios, { AxiosError } from "axios";
import {
  CreateTenantDto,
  CreateTenantResponse,
  AvailabilityResponse,
} from "@/types/tenant";

// We use the same pattern as auth.ts: a dedicated client for our internal BFF.
const bffApi = axios.create({
  baseURL: "/api", // Points to our /app/api folder
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Checks if a subdomain is available by calling our internal BFF endpoint.
 */
export async function checkSubdomainAvailability(
  subdomain: string
): Promise<AvailabilityResponse> {
  try {
    // Call GET /api/tenants/availability?subdomain=...
    const response = await bffApi.get("/tenants/availability", {
      params: { subdomain },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(
        error.response.data.message || "Could not check subdomain availability."
      );
    }
    throw new Error("An unexpected network error occurred.");
  }
}

/**
 * Creates a new tenant (organization) by calling our internal BFF endpoint.
 */
export async function createTenant(
  tenantData: CreateTenantDto
): Promise<CreateTenantResponse> {
  try {
    // Call POST /api/tenants
    const response = await bffApi.post("/tenants", tenantData);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(
        error.response.data.message || "Failed to create organization."
      );
    }
    throw new Error(
      "An unexpected error occurred during organization creation."
    );
  }
}

// DEPRECATED: API logic moved to services/tenant-repository.ts for SRP and testability.
export * from "@/types/tenant";
