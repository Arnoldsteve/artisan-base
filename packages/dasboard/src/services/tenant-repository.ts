import axios, { AxiosError } from "axios";
import {
  CreateTenantDto,
  CreateTenantResponse,
  AvailabilityResponse,
} from "@/types/tenant";

const bffApi = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export class TenantRepository {
  /**
   * Checks if a subdomain is available by calling our internal BFF endpoint.
   */
  static async checkSubdomainAvailability(
    subdomain: string
  ): Promise<AvailabilityResponse> {
    try {
      const response = await bffApi.get("/tenants/availability", {
        params: { subdomain },
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(
          error.response.data.message ||
            "Could not check subdomain availability."
        );
      }
      throw new Error("An unexpected network error occurred.");
    }
  }

  /**
   * Creates a new tenant (organization) by calling our internal BFF endpoint.
   */
  static async createTenant(
    tenantData: CreateTenantDto
  ): Promise<CreateTenantResponse> {
    try {
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
}
// REFACTOR: Centralized all tenant API calls for SRP, DRY, and testability.
