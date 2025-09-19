// File: packages/dasboard/src/hooks/use-customers.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customerService } from "@/services/customer-service";
import { toast } from "sonner";
import { CreateCustomerDto, Customer, UpdateCustomerDto } from "@/types/customers";
import { useAuthContext } from "@/contexts/auth-context"; // <-- 1. IMPORT THE AUTH CONTEXT
import { PaginatedResponse } from "@/types/shared";

// Define a query key to uniquely identify this data
const CUSTOMERS_QUERY_KEY = ["dashboard-customers"];

/**
 * Hook for fetching a paginated list of customers.
 * It is now "auth-aware" and will not run until the user is authenticated.
 */
export function useCustomers(page = 1, limit = 10, search = '', initialData?: PaginatedResponse<Customer>) {
  // 2. GET THE AUTHENTICATION STATE
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthContext();

  return useQuery<PaginatedResponse<Customer>>({
    queryKey: [...CUSTOMERS_QUERY_KEY, { page, limit, search }],
    queryFn: () => customerService.getAll(page, limit, search),
    
    // 3. THE CRITICAL FIX: Use the `enabled` option
    // This query will now ONLY run if auth is not loading AND the user is authenticated.
    enabled: !isAuthLoading && isAuthenticated,

    // Provide initial data from the server to prevent a loading flicker on first visit
    initialData: initialData, 
  });
}

/**
 * Hook for fetching a single customer by their ID.
 */
export function useCustomer(customerId: string | null) {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthContext();

  return useQuery<Customer>({
    queryKey: [...CUSTOMERS_QUERY_KEY, customerId],
    queryFn: () => customerService.getById(customerId!),
    // Also protect this query
    enabled: !isAuthLoading && isAuthenticated && !!customerId,
  });
}

// --- Your mutation hooks do not need to change ---
// Mutations are triggered by user actions, by which time the auth state will be ready.

/**
 * Hook for creating a new customer.
 */
export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCustomerDto) => customerService.create(data),
    onSuccess: (newCustomer) => {
      toast.success(`Customer "${newCustomer.email}" created successfully.`);
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create customer.");
    },
  });
}

/**
 * Hook for updating an existing customer.
 */
export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { id: string; data: UpdateCustomerDto }) =>
      customerService.update(variables.id, variables.data),
    onSuccess: (updatedCustomer) => {
      toast.success(`Customer "${updatedCustomer.email}" updated successfully.`);
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...CUSTOMERS_QUERY_KEY, updatedCustomer.id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update customer.");
    },
  });
}

/**
 * Hook for deleting a customer.
 */
export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => customerService.delete(id),
    onSuccess: () => {
      toast.success("Customer deleted successfully.");
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete customer.");
    },
  });
}