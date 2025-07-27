// hooks/useNewsletter.ts
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { subscribeToNewsletter } from "@/services/newsletter-service";

export function useNewsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!email.trim()) {
        toast.error("Please enter your email address");
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast.error("Please enter a valid email address");
        return;
      }

      setIsSubmitting(true);

      try {
        await subscribeToNewsletter({ email });
        toast.success("Thank you for subscribing to our newsletter!");
        setEmail("");
      } catch {
        toast.error("Failed to subscribe. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [email]
  );

  return {
    email,
    isSubmitting,
    handleEmailChange,
    handleSubmit,
  };
}
