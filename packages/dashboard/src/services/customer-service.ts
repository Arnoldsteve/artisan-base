import { apiClient } from "@/lib/client-api";
import { CreateCustomerDto, Customer, UpdateCustomerDto } from "@/types/customers";
import { PaginatedResponse } from "@/types/shared";

export class CustomerService {
  async getAll(
    page = 1,
    limit = 20,
    search?: string
  ): Promise<PaginatedResponse<Customer>> {
    return apiClient.get<PaginatedResponse<Customer>>("/customers", {
      params: { 
        page, 
        limit, 
        ...(search && { search }) // Only send search if it exists
      },
    });
  }

  async getById(id: string): Promise<Customer> {
    return apiClient.get<Customer>(`/customers/${id}`);
  }

  async create(data: CreateCustomerDto): Promise<Customer> {
    return apiClient.post<Customer>("/customers", data);
  }

  async update(id: string, data: UpdateCustomerDto): Promise<Customer> {
    return apiClient.patch<Customer>(`/customers/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/customers/${id}`);
  }
}

export const customerService = new CustomerService();