import { apiClient } from "@/lib/api-client";
import { ContactFormData } from "@/hooks/use-contact-form"; 

export class ContactService {
  /**
   * Submits the contact form data to the backend API.
   * @param formData The data collected from the contact form.
   * @returns A promise that resolves when the submission is successful.
   */
  async submitForm(formData: ContactFormData): Promise<void> {
    const endpoint = `/api/v1/storefront/contact`;

    await apiClient.post(endpoint, formData);
    
  }
}

export const contactService = new ContactService();