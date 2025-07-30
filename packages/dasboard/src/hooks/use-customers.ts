// File: packages/dasboard/src/hooks/use-customers.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customerService } from "@/services/customer-service";
import { toast } from "sonner";
import { CreateCustomerDto, Customer, PaginatedResponse, UpdateCustomerDto } from "@/types/customers";

// Define a query key to uniquely identify this data
const CUSTOMERS_QUERY_KEY = ["dashboard-customers"];

/**
 * Hook for fetching a paginated list of customers.
 * Handles caching, refetching, loading, and error states automatically.
 */
export function useCustomers(page = 1, limit = 10, search = '') {
  return useQuery<PaginatedResponse<Customer>>({
    // The query key is an array that uniquely identifies this specific data fetch
    queryKey: [...CUSTOMERS_QUERY_KEY, { page, limit, search }],
    queryFn: () => customerService.getAll(page, limit, search),
    // keepPreviousData: true, // Optional: uncomment for a smoother pagination experience
  });
}

/**
 * Hook for fetching a single customer by their ID.
 */
export function useCustomer(customerId: string | null) {
  return useQuery<Customer>({
    queryKey: [...CUSTOMERS_QUERY_KEY, customerId],
    queryFn: () => customerService.getById(customerId!), // The '!' asserts that customerId is not null here
    enabled: !!customerId, // The query will only run if customerId is not null
  });
}

/**
 * Hook for creating a new customer.
 * Returns a `mutate` function to trigger the creation.
 */
export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCustomerDto) => customerService.create(data),
    onSuccess: (newCustomer) => {
      toast.success(`Customer "${newCustomer.email}" created successfully.`);
      // Invalidate the main customers list to trigger a refetch and show the new customer
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
      // Invalidate both the list and the specific customer query
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