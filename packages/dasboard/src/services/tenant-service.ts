import { TenantRepository } from "./tenant-repository";
import { CreateTenantDto } from "@/types/tenant";

export class TenantService {
  /**
   * Handles organization setup business logic, returns result and error.
   */
  static async createTenant(tenantData: CreateTenantDto) {
    try {
      const data = await TenantRepository.createTenant(tenantData);
      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  static async checkSubdomainAvailability(subdomain: string) {
    try {
      const data = await TenantRepository.checkSubdomainAvailability(subdomain);
      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }
}
// REFACTOR: Business logic separated from UI for SRP, testability, and DRY.
