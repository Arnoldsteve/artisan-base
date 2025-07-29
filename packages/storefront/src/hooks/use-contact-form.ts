import { useState, useCallback } from "react";
import { toast } from "sonner";
import { contactService } from "@/services/contact-service"; 

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const initialFormData: ContactFormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export function useContactForm() {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await contactService.submitForm(formData);

      toast.success("Thank you for your message! We'll get back to you soon.");
      setFormData(initialFormData);

    } catch (error) {
      console.error("Contact form submission failed:", error);
      toast.error("Failed to send message. Please try again later.");
      
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    handleChange,
    handleSubmit,
  };
}