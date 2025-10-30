import { apiClient } from "@/lib/client-api";
import { CreateDashboardUserDto, DashboardUser, UpdateDashboardUserDto } from "@/types/users";
import { PaginatedResponse } from "@/types/shared";

export class DashboardUserService {
  async getAll(
    page = 1,
    limit = 10,
    search?: string
  ): Promise<PaginatedResponse<DashboardUser>> {
    return apiClient.get<PaginatedResponse<DashboardUser>>("dashboard/users", {
      page,
      limit,
      search,
    });
  }

  async getById(id: string): Promise<DashboardUser> {
    return apiClient.get<DashboardUser>(`dashboard/users/${id}`);
  }

  async create(data: CreateDashboardUserDto): Promise<DashboardUser> {
    return apiClient.post<DashboardUser>("dashboard/users", data);
  }

  async update(id: string, data: UpdateDashboardUserDto): Promise<DashboardUser> {
    return apiClient.patch<DashboardUser>(`dashboard/users/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`dashboard/users/${id}`);
  }
}

export const dashboardUserService = new DashboardUserService();
