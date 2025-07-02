import { CustomerRepository } from "./customer-repository";
import { Customer } from "@/types/customers";

export class CustomerService {
  static async getAll() {
    return CustomerRepository.getAll();
  }
  static async getById(id: string) {
    return CustomerRepository.getById(id);
  }
  static async create(data: Partial<Customer>) {
    return CustomerRepository.create(data);
  }
  static async update(id: string, data: Partial<Customer>) {
    return CustomerRepository.update(id, data);
  }
  static async delete(id: string) {
    return CustomerRepository.delete(id);
  }
}
// REFACTOR: Business logic separated from UI for SRP, testability, and DRY.
