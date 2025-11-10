import { apiClient } from "@/lib/api-client";

export interface NewsletterPayload {
  email: string;
}

export async function subscribeToNewsletter(data: NewsletterPayload): Promise<any> {
  return apiClient.post("/api/v1/storefront/newsletter/subscribe", data);
}
