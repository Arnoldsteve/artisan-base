import { apiClient } from "@/lib/client-api";
import { CreateDashboardUserDto, DashboardUserData, UpdateDashboardUserDto } from "@/types/users";
import { PaginatedResponse } from "@/types/shared";

export class DashboardUserService {
  async getAll(
    page = 1,
    limit = 10,
    search?: string
  ): Promise<PaginatedResponse<DashboardUserData>> {
    return apiClient.get<PaginatedResponse<DashboardUserData>>("dashboard/users", {
      page,
      limit,
      search,
    });
  }

  async getById(id: string): Promise<DashboardUserData> {
    return apiClient.get<DashboardUserData>(`dashboard/users/${id}`);
  }

  async create(data: CreateDashboardUserDto): Promise<DashboardUserData> {
    return apiClient.post<DashboardUserData>("dashboard/users", data);
  }

  async update(id: string, data: UpdateDashboardUserDto): Promise<DashboardUserData> {
    return apiClient.patch<DashboardUserData>(`dashboard/users/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`dashboard/users/${id}`);
  }
}

export const dashboardUserService = new DashboardUserService();
