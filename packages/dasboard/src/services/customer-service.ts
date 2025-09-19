// File: packages/dasboard/src/services/customer-service.ts

import { apiClient } from "@/lib/client-api";
import { CreateCustomerDto, Customer, UpdateCustomerDto } from "@/types/customers"; // Assuming you have these types
import { PaginatedResponse } from "@/types/shared";

/**
 * CustomerService directly handles API communication for dashboard customer management.
 */
export class CustomerService {
  /**
   * Gets a paginated list of all customers.
   */
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

  /**
   * Gets a single customer by their ID.
   */
  async getById(id: string): Promise<Customer> {
    return apiClient.get<Customer>(`dashboard/customers/${id}`);
  }

  /**
   * Creates a new customer.
   */
  async create(data: CreateCustomerDto): Promise<Customer> {
    return apiClient.post<Customer>("dashboard/customers", data);
  }

  /**
   * Updates an existing customer.
   */
  async update(id: string, data: UpdateCustomerDto): Promise<Customer> {
    return apiClient.patch<Customer>(`dashboard/customers/${id}`, data);
  }

  /**
   * Deletes a single customer by their ID.
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`dashboard/customers/${id}`);
  }
}

// Export a singleton instance of the service for use throughout the app.
export const customerService = new CustomerService();