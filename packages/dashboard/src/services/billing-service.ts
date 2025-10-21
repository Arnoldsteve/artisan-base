import { apiClient } from "@/lib/client-api";

import {
  Plan,
  Subscription,
  Invoice,
  ApiResponse,
  ChangePlanResponse,
} from "@/types/billing";

export class BillingService {
  async getPlans(): Promise<Plan[]> {
    const response =
      await apiClient.get<ApiResponse<Plan[]>>("/platform/plans");
    return response.data;
  }

  async getSubscription(): Promise<Subscription> {
    const response = await apiClient.get<ApiResponse<Subscription>>(
      "/billing/subscription"
    );
    return response.data;
  }

  async getInvoices(): Promise<Invoice[]> {
    const response = await apiClient.get<ApiResponse<Invoice[]>>(
      "/dashboard/billing/invoices"
    );
    return response.data;
  }

  async changePlan(
    planId: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<ChangePlanResponse>(
      "/dashboard/billing/change-plan",
      { planId }
    );
    return response.data;
  }

  async downloadInvoice(invoiceId: string): Promise<Blob> {
    return apiClient.get<Blob>(
      `/dashboard/billing/invoices/${invoiceId}/download`,
      {
        responseType: "blob", 
      }
    );
  }
}

export const billingService = new BillingService();
