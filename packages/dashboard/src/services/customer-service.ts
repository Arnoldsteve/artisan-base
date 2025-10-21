import { apiClient } from "@/lib/client-api";
import { CreateCustomerDto, Customer, UpdateCustomerDto } from "@/types/customers"; // Assuming you have these types
import { PaginatedResponse } from "@/types/shared";

/**
 */
export class CustomerService {
 
  async getAll(
    page = 1,
    limit = 10,
    search?: string
  ): Promise<PaginatedResponse<Customer>> {
    return apiClient.get<PaginatedResponse<Customer>>(
      "dashboard/customers",
      { page, limit, search }
    );
  }

  async getById(id: string): Promise<Customer> {
    return apiClient.get<Customer>(`dashboard/customers/${id}`);
  }

  async create(data: CreateCustomerDto): Promise<Customer> {
    return apiClient.post<Customer>("dashboard/customers", data);
  }

  async update(id: string, data: UpdateCustomerDto): Promise<Customer> {
    return apiClient.patch<Customer>(`dashboard/customers/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`dashboard/customers/${id}`);
  }
}

export const customerService = new CustomerService();