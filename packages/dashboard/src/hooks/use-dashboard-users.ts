"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { useState } from "react";
import { staffService } from "@/services/dashboard-user";
import { toast } from "sonner";
import { StaffMember } from "@/types/staff";
import { TenantUserRole } from "@/types/roles";
import { useAuthContext } from "@/contexts/auth-context";
import { PaginatedResponse } from "@/types";

// ---------------------------------------------------------
// 1. Unified Hook for Managing the Staff List
// ---------------------------------------------------------
export const useStaffMembers = (
  initialLimit = 10, 
  initialData?: PaginatedResponse<StaffMember>
) => {
  const queryClient = useQueryClient();
  const { tenantId, isAuthenticated, isLoading: isAuthLoading } = useAuthContext();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);

  const STAFF_QUERY_KEY = ["staff", tenantId];

  const staffQuery = useQuery({
    queryKey: [...STAFF_QUERY_KEY, "list", { page, limit }],
    queryFn: () => staffService.getAll(page, limit),
    enabled: !isAuthLoading && isAuthenticated && !!tenantId,
    placeholderData: keepPreviousData,
    initialData: page === 1 ? initialData : undefined, 
  });

  // --- Mutations ---
  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: TenantUserRole }) =>
      staffService.updateRole(id, role),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: STAFF_QUERY_KEY });
      toast.success(`Role updated to ${updated.role}`);
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Update failed"),
  });

  const removeStaffMutation = useMutation({
    mutationFn: (id: string) => staffService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_QUERY_KEY });
      toast.success("Staff member removed successfully");
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Removal failed"),
  });

  return {
    // Data & Meta
    staff: staffQuery.data?.data || [],
    meta: staffQuery.data?.meta,
    isLoading: staffQuery.isLoading,
    isFetching: staffQuery.isFetching,
    isError: staffQuery.isError,

    // State Management
    page,
    setPage,
    limit,
    setLimit,

    // Actions
    updateRole: updateRoleMutation.mutate,
    isUpdating: updateRoleMutation.isPending,
    removeStaff: removeStaffMutation.mutate,
    isRemoving: removeStaffMutation.isPending,
  };
};