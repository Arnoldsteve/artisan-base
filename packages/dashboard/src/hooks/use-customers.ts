"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { useState } from "react";
import { customerService } from "@/services/customer-service";
import { toast } from "sonner";
import { 
  Customer, 
  CreateCustomerDto, 
  UpdateCustomerDto 
} from "@/types/customers";
import { useAuthContext } from "@/contexts/auth-context";
import { PaginatedResponse } from "@/types";

export const CUSTOMERS_QUERY_KEY = ["customers"] as const;

// ---------------------------------------------------------
// 1. Unified Hook for Managing the Customers List
// ---------------------------------------------------------
export const useCustomers = (
  initialLimit = 10, 
  initialData?: PaginatedResponse<Customer>
) => {
  const queryClient = useQueryClient();
  const { tenantId, isAuthenticated, isLoading: isAuthLoading } = useAuthContext();
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const CUSTOMERS_QUERY_KEY = ["customers", tenantId];

  const customersQuery = useQuery({
    queryKey: [...CUSTOMERS_QUERY_KEY, "list", { page, search, limit: initialLimit }],
    queryFn: () => customerService.getAll(page, initialLimit, search),
    enabled: !isAuthLoading && isAuthenticated && !!tenantId,
    placeholderData: keepPreviousData,
    initialData: page === 1 && !search ? initialData : undefined,
  });

  // ... rest of your mutations (create, update, delete)

  // ⚡ ADD THIS: Standalone Create Mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateCustomerDto) => customerService.create(data),
    onSuccess: (newCustomer) => {
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
      toast.success(`Customer ${newCustomer.email} added successfully.`);
    },
    onError: (err: any) => toast.error(err.message || "Failed to create customer"),
  });

  // Re-use the update/delete hooks we defined previously
  const { updateCustomer, isUpdating } = useUpdateCustomer();
  const { deleteCustomer, isDeleting } = useDeleteCustomer();

  return {
    // Data & State
    customers: customersQuery.data?.data || [],
    meta: customersQuery.data?.meta,
    isLoading: customersQuery.isLoading,
    isFetching: customersQuery.isFetching,
    isError: customersQuery.isError,
    page,
    setPage,
    search,
    setSearch,

    // 🎯 THE FIX: Add these two lines back to the return object
    createCustomer: createMutation.mutate,
    isCreating: createMutation.isPending,

    // Other Actions
    updateCustomer,
    isUpdating,
    deleteCustomer,
    isDeleting,
  };
};

// ---------------------------------------------------------
// 2. Hook for Single Customer Details
// ---------------------------------------------------------
export const useCustomer = (id: string | null) => {
  const { tenantId, isAuthenticated, isLoading: isAuthLoading } = useAuthContext();

  return useQuery({
    queryKey: ["customer", tenantId, id],
    queryFn: () => customerService.getById(id!),
    enabled: !isAuthLoading && isAuthenticated && !!tenantId && !!id,
  });
};

// ⚡ 3. THE FIX: Standalone Update Hook for the Edit Page
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  const { tenantId } = useAuthContext();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCustomerDto }) =>
      customerService.update(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["customer", tenantId, updated.id] });
      toast.success("Customer profile updated.");
    },
    onError: (err: any) => toast.error(err.message || "Update failed"),
  });

  return {
    updateCustomer: mutation.mutate,
    isUpdating: mutation.isPending,
    // Return the whole mutation object if needed by the caller
    mutate: mutation.mutate,
    isPending: mutation.isPending
  };
};

// ⚡ 4. Standalone Delete Hook (Clean Architecture)
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) => customerService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
      toast.success("Customer deleted.");
    },
    onError: (err: any) => toast.error(err.message || "Delete failed"),
  });

  return {
    deleteCustomer: mutation.mutate,
    isDeleting: mutation.isPending
  };
};