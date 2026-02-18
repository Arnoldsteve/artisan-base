import { useAuthContext } from "@/contexts/auth-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { StaffMember, CreateStaffDto } from "@/types/staff";
import { toast } from "sonner";
import { staffService } from "@/services/dashboard-user";
import { TenantUserRole } from "@/types/roles";

export const STAFF_QUERY_KEY = ["tenant-staff"];

/** Fetch paginated staff members */
export function useStaffMembers(page = 1, limit = 10) {
  const { isAuthenticated } = useAuthContext();

  return useQuery({
    queryKey: [...STAFF_QUERY_KEY, { page, limit }],
    queryFn: () => staffService.getAll(page, limit),
    enabled: isAuthenticated,
  });
}

/** Update a member's role */
export function useUpdateStaffRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: TenantUserRole }) =>
      staffService.updateRole(id, role),
    onSuccess: (updatedMember) => {
      toast.success(`Role updated to ${updatedMember.role}`);
      queryClient.invalidateQueries({ queryKey: STAFF_QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update role");
    },
  });
}

/** Remove a staff member from the tenant */
export function useRemoveStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => staffService.remove(id),
    onSuccess: () => {
      toast.success("Staff member removed successfully");
      queryClient.invalidateQueries({ queryKey: STAFF_QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to remove staff");
    },
  });
}