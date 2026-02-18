import { apiClient } from "@/lib/client-api";
import { StaffMember, CreateStaffDto, UpdateStaffRoleDto } from "@/types/staff";
import { PaginatedResponse } from "@/types/shared";
import { TenantUserRole } from "@/types/roles";

export class StaffService {
  /**
   * Hits GET /api/v1/tenant/staff
   */
  async getAll(
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<StaffMember>> {
    return apiClient.get<PaginatedResponse<StaffMember>>("/tenant/staff", {
      params: { page, limit },
    });
  }

  /**
   * Hits PATCH /api/v1/tenant/member/:id/role
   * Note: You might need a specific endpoint for this in your Controller
   */
  async updateRole(memberId: string, role: TenantUserRole): Promise<StaffMember> {
    return apiClient.patch<StaffMember>(`/tenant/member/${memberId}/role`, { role });
  }

  /**
   * Hits DELETE /api/v1/tenant/member/:id
   */
  async remove(memberId: string): Promise<void> {
    await apiClient.delete(`/tenant/member/${memberId}`);
  }
}

export const staffService = new StaffService();