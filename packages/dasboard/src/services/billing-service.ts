import { apiClient } from "@/lib/client-api";

import { 
  Plan, 
  Subscription, 
  Invoice, 
  ApiResponse, 
  ChangePlanResponse
} from "@/types/billing";

/**
 * BillingService directly handles all API communication for billing,
 * subscription, and plan management for the currently authenticated tenant.
 * It unwraps the API response structure to return clean data.
 */
export class BillingService {
  /**
   * Retrieves a list of all available subscription plans.
   */
  async getPlans(): Promise<Plan[]> {
    const response = await apiClient.get<ApiResponse<Plan[]>>("/dashboard/billing/plans");
    return response.data;
  }

  /**
   * Retrieves the current subscription details for the authenticated tenant.
   */
  async getSubscription(): Promise<Subscription> {
    const response = await apiClient.get<ApiResponse<Subscription>>("/dashboard/billing/subscription");
    return response.data;
  }

  /**
   * Retrieves a list of past invoices for the authenticated tenant.
   */
  async getInvoices(): Promise<Invoice[]> {
    const response = await apiClient.get<ApiResponse<Invoice[]>>("/dashboard/billing/invoices");
    return response.data;
  }

  /**
   * Sends a request to change the tenant's current subscription plan.
   * This returns the direct payload needed for the redirect.
   */
  async changePlan(planId: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<ChangePlanResponse>("/dashboard/billing/change-plan", { planId });
    // The service still unwraps the 'data' property as intended.
    return response.data;
  }

  /**
   * Downloads a specific invoice file (e.g., a PDF).
   * This call is special as it expects a direct file blob, not a JSON response.
   * @param invoiceId - The ID of the invoice to download.
   */
  async downloadInvoice(invoiceId: string): Promise<Blob> {
    return apiClient.get<Blob>(`/dashboard/billing/invoices/${invoiceId}/download`, {
      responseType: 'blob', // Important: tells the client to handle a file download
    });
  }
}

// Export a singleton instance for easy use throughout your dashboard application.
export const billingService = new BillingService();