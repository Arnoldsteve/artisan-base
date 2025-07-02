import axios, { AxiosError } from "axios";
import { Plan, Subscription, Invoice } from "@/types/billing";

const bffApi = axios.create({
  baseURL: "/api",
});

const handleError = (error: unknown, defaultMessage: string): never => {
  if (error instanceof AxiosError && error.response) {
    throw new Error(error.response.data.message || defaultMessage);
  }
  throw new Error(defaultMessage);
};

export class BillingRepository {
  static async getPlans(): Promise<Plan[]> {
    try {
      const response = await bffApi.get("/dashboard/billing/plans");
      return response.data;
    } catch (error) {
      handleError(error, "Failed to fetch plans.");
    }
  }
  static async getSubscription(): Promise<Subscription> {
    try {
      const response = await bffApi.get("/dashboard/billing/subscription");
      return response.data;
    } catch (error) {
      handleError(error, "Failed to fetch subscription.");
    }
  }
  static async getInvoices(): Promise<Invoice[]> {
    try {
      const response = await bffApi.get("/dashboard/billing/invoices");
      return response.data;
    } catch (error) {
      handleError(error, "Failed to fetch invoices.");
    }
  }
  static async changePlan(planId: string): Promise<Subscription> {
    try {
      const response = await bffApi.post("/dashboard/billing/change-plan", {
        planId,
      });
      return response.data;
    } catch (error) {
      handleError(error, "Failed to change plan.");
    }
  }
  static async downloadInvoice(invoiceId: string): Promise<void> {
    try {
      await bffApi.get(`/dashboard/billing/invoices/${invoiceId}/download`, {
        responseType: "blob",
      });
    } catch (error) {
      handleError(error, "Failed to download invoice.");
    }
  }
}
// REFACTOR: Centralized all billing API calls for SRP, DRY, and testability.
