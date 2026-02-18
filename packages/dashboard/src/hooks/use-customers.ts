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

// ---------------------------------------------------------
// 1. Unified Hook for Managing the Customers List
// ---------------------------------------------------------
export const useCustomers = (initialLimit = 10) => {
  const queryClient = useQueryClient();
  const { tenantId, isAuthenticated, isLoading: isAuthLoading } = useAuthContext();
  
  // Internal state for list management
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // TOP 1% ARCHITECTURE: Keys are isolated by tenantId
  const CUSTOMERS_QUERY_KEY = ["customers", tenantId];

  // --- Fetch Query ---
  const customersQuery = useQuery({
    queryKey: [...CUSTOMERS_QUERY_KEY, "list", { page, search, limit: initialLimit }],
    queryFn: () => customerService.getAll(page, initialLimit, search),
    enabled: !isAuthLoading && isAuthenticated && !!tenantId,
    placeholderData: keepPreviousData,
  });

  // --- Mutations ---
  const createCustomerMutation = useMutation({
    mutationFn: (data: CreateCustomerDto) => customerService.create(data),
    onSuccess: (newCustomer) => {
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
      toast.success(`Customer ${newCustomer.email} added successfully.`);
    },
    onError: (err: any) => toast.error(err.message || "Failed to create customer"),
  });

  const updateCustomerMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCustomerDto }) =>
      customerService.update(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["customer", tenantId, updated.id] });
      toast.success("Customer updated successfully.");
    },
    onError: (err: any) => toast.error(err.message || "Update failed"),
  });

  const deleteCustomerMutation = useMutation({
    mutationFn: (id: string) => customerService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
      toast.success("Customer deleted successfully.");
    },
    onError: (err: any) => toast.error(err.message || "Delete failed"),
  });

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

    // Actions
    createCustomer: createCustomerMutation.mutate,
    isCreating: createCustomerMutation.isPending,
    updateCustomer: updateCustomerMutation.mutate,
    isUpdating: updateCustomerMutation.isPending,
    deleteCustomer: deleteCustomerMutation.mutate,
    isDeleting: deleteCustomerMutation.isPending,
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