import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customerService } from "@/services/customer-service";
import { toast } from "sonner";
import {
  CreateCustomerDto,
  Customer,
  UpdateCustomerDto,
} from "@/types/customers";
import { useAuthContext } from "@/contexts/auth-context";
import { PaginatedResponse } from "@/types/shared";

const CUSTOMERS_QUERY_KEY = ["dashboard-customers"];

export function useCustomers(
  page = 1,
  limit = 10,
  search = "",
  initialData?: PaginatedResponse<Customer>
) {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthContext();

  return useQuery<PaginatedResponse<Customer>>({
    queryKey: [...CUSTOMERS_QUERY_KEY, { page, limit, search }],
    queryFn: () => customerService.getAll(page, limit, search),
    enabled: !isAuthLoading && isAuthenticated,
    initialData: page === 1 ? initialData : undefined,
    staleTime: 0,
  });
}

export function useCustomer(customerId: string | null) {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthContext();

  return useQuery<Customer>({
    queryKey: [...CUSTOMERS_QUERY_KEY, customerId],
    queryFn: () => customerService.getById(customerId!),
    enabled: !isAuthLoading && isAuthenticated && !!customerId,
  });
}

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

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { id: string; data: UpdateCustomerDto }) =>
      customerService.update(variables.id, variables.data),
    onSuccess: (updatedCustomer) => {
      toast.success(
        `Customer "${updatedCustomer.email}" updated successfully.`
      );
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...CUSTOMERS_QUERY_KEY, updatedCustomer.id],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update customer.");
    },
  });
}

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
