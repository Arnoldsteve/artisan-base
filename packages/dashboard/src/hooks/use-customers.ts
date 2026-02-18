import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customerService } from "@/services/customer-service";
import { toast } from "sonner";
import { CreateCustomerDto, Customer, UpdateCustomerDto } from "@/types/customers";
import { useAuthContext } from "@/contexts/auth-context";
import { PaginatedResponse } from "@/types/shared";

const CUSTOMERS_KEY = "customers";

// 1. Hook for Paginated List
export function useCustomers(page = 1, limit = 20, search = "") {
  const { isAuthenticated } = useAuthContext();

  return useQuery({
    queryKey: [CUSTOMERS_KEY, "list", { page, limit, search }],
    queryFn: () => customerService.getAll(page, limit, search),
    enabled: isAuthenticated,
    placeholderData: (previousData) => previousData, // Smooth pagination transition
  });
}

// 2. Hook for Single Customer Details
export function useCustomer(id?: string) {
  const { isAuthenticated } = useAuthContext();

  return useQuery({
    queryKey: [CUSTOMERS_KEY, "detail", id],
    queryFn: () => customerService.getById(id!),
    enabled: isAuthenticated && !!id,
  });
}

// 3. Hook for Creation
export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCustomerDto) => customerService.create(data),
    onSuccess: (newCustomer) => {
      toast.success(`Customer ${newCustomer.email} created`);
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS_KEY, "list"] });
    },
  });
}

// 4. Hook for Update
export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCustomerDto }) =>
      customerService.update(id, data),
    onSuccess: (updated) => {
      toast.success("Customer updated");
      // Invalidate both the list and the specific detail
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS_KEY, "list"] });
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS_KEY, "detail", updated.id] });
    },
  });
}

// 5. Hook for Delete
export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => customerService.delete(id),
    onSuccess: () => {
      toast.success("Customer deleted");
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS_KEY, "list"] });
    },
  });
}