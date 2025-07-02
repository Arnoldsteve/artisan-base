import axios, { AxiosError } from "axios";
import { Customer } from "@/types/customers";

const bffApi = axios.create({
  baseURL: "/api",
});

const handleError = (error: unknown, defaultMessage: string): never => {
  if (error instanceof AxiosError && error.response) {
    throw new Error(error.response.data.message || defaultMessage);
  }
  throw new Error(defaultMessage);
};

export class CustomerRepository {
  static async getAll(): Promise<Customer[]> {
    try {
      const response = await bffApi.get("/dashboard/customers");
      return response.data;
    } catch (error) {
      handleError(error, "Failed to fetch customers.");
    }
  }

  static async getById(id: string): Promise<Customer> {
    try {
      const response = await bffApi.get(`/dashboard/customers/${id}`);
      return response.data;
    } catch (error) {
      handleError(error, "Failed to fetch customer.");
    }
  }

  static async create(data: Partial<Customer>): Promise<Customer> {
    try {
      const response = await bffApi.post("/dashboard/customers", data);
      return response.data;
    } catch (error) {
      handleError(error, "Failed to create customer.");
    }
  }

  static async update(id: string, data: Partial<Customer>): Promise<Customer> {
    try {
      const response = await bffApi.patch(`/dashboard/customers/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error, "Failed to update customer.");
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      await bffApi.delete(`/dashboard/customers/${id}`);
    } catch (error) {
      handleError(error, "Failed to delete customer.");
    }
  }
}
// REFACTOR: Centralized all customer API calls for SRP, DRY, and testability.
