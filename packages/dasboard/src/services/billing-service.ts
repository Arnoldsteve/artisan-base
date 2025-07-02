import { BillingRepository } from "./billing-repository";

export class BillingService {
  static async getPlans() {
    return BillingRepository.getPlans();
  }
  static async getSubscription() {
    return BillingRepository.getSubscription();
  }
  static async getInvoices() {
    return BillingRepository.getInvoices();
  }
  static async changePlan(planId: string) {
    return BillingRepository.changePlan(planId);
  }
  static async downloadInvoice(invoiceId: string) {
    return BillingRepository.downloadInvoice(invoiceId);
  }
}
// REFACTOR: Business logic separated from UI for SRP, testability, and DRY.
