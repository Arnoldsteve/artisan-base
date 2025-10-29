import { useAuthContext } from "@/contexts/auth-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PaginatedResponse } from "@/types/shared";
import {
  CreateDashboardUserDto,
  DashboardUserData,
  UpdateDashboardUserDto,
} from "@/types/users";
import { toast } from "sonner";
import { dashboardUserService } from "@/services/dashboard-user";

export const DASHBOARD_USER_QUERY_KEY = ["dashboard-dashboardUsers"];

/** Fetch paginated users */
export function useDashboardUsers(
  page = 1,
  limit = 10,
  search = "",
  initialData?: PaginatedResponse<DashboardUserData>
) {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthContext();

  return useQuery<PaginatedResponse<DashboardUserData>>({
    queryKey: [...DASHBOARD_USER_QUERY_KEY, { page, limit, search }],
    queryFn: () => dashboardUserService.getAll(page, limit, search),
    enabled: !isAuthLoading && isAuthenticated,
    initialData: page === 1 ? initialData : undefined,
  });
}

/** Create user */
export function useCreateDashboardUser() {
  const queryClient = useQueryClient();

  return useMutation<DashboardUserData, Error, CreateDashboardUserDto>({
    mutationFn: (data: CreateDashboardUserDto) =>
      dashboardUserService.create(data),
    onSuccess: (newUser) => {
      toast.success(`User "${newUser.name || newUser.email}" created successfully.`);
      queryClient.invalidateQueries({ queryKey: DASHBOARD_USER_QUERY_KEY });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create user.");
    },
  });
}


/** Update user */
export function useUpdateDashboardUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDashboardUserDto }) =>
      dashboardUserService.update(id, data),
    onSuccess: (updatedUser) => {
      toast.success(`User "${updatedUser.name || updatedUser.email}" updated successfully.`);
      queryClient.invalidateQueries({ queryKey: DASHBOARD_USER_QUERY_KEY });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update user.");
    },
  });
}

/** Delete user */
export function useDeleteDashboardUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => dashboardUserService.delete(id),
    onSuccess: () => {
      toast.success("User deleted successfully.");
      queryClient.invalidateQueries({ queryKey: DASHBOARD_USER_QUERY_KEY });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete user.");
    },
  });
}
