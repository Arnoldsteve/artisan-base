
import { apiClient } from "@/lib/client-api";
// It's good practice to define the shapes of your API responses.
import { Plan, Subscription, Invoice } from "@/types/billing"; 

/**
 * BillingService directly handles all API communication for billing,
 * subscription, and plan management for the currently authenticated tenant.
 */
export class BillingService {
  /**
   * Retrieves a list of all available subscription plans.
   * This is what your UI will display for the "Upgrade Your Plan" section.
   */
  async getPlans(): Promise<Plan[]> {
    // This endpoint should return all plans from the management DB.
    // The backend should not require any specific tenant role for this.
    // NOTE: This is different from the /platform/plans endpoint used by admins.
    const response = await apiClient.get<{ data: Plan[] }>("/dashboard/billing/plans");
    return response.data;
  }

  /**
   * Retrieves the current subscription details for the authenticated tenant.
   */
  async getSubscription(): Promise<Subscription> {
    const response = await apiClient.get<{ data: Subscription }>("/dashboard/billing/subscription");
    return response.data;
  }

  /**
   * Retrieves a list of past invoices for the authenticated tenant.
   */
  async getInvoices(): Promise<Invoice[]> {
    const response = await apiClient.get<{ data: Invoice[] }>("/dashboard/billing/invoices");
    return response.data;
  }

  /**
   * Sends a request to change the tenant's current subscription plan.
   * This would typically initiate a checkout session with a payment provider.
   * @param planId - The ID of the new plan the user wants to switch to.
   */
  async changePlan(planId: string): Promise<{ checkoutUrl: string }> {
    // The backend receives the new planId and returns a URL to the payment provider's
    // checkout page (e.g., Stripe Checkout).
    return apiClient.post<{ checkoutUrl: string }>("/dashboard/billing/change-plan", { planId });
  }

  /**
   * Downloads a specific invoice file (e.g., a PDF).
   * Note: Handling file downloads with an API client requires special configuration
   * to handle the blob/binary data response.
   * @param invoiceId - The ID of the invoice to download.
   */
  async downloadInvoice(invoiceId: string): Promise<Blob> {
    // This endpoint returns the invoice file directly.
    // The apiClient needs to be configured to handle 'blob' responseType for this call.
    return apiClient.get<Blob>(`/dashboard/billing/invoices/${invoiceId}/download`, {
      responseType: 'blob',
    });
  }
}

// Export a singleton instance for easy use throughout your dashboard application.
export const billingService = new BillingService();