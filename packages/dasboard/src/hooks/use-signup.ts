import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthService } from "@/services/auth-service";

export function useSignup() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError(null);
      const { data, error } = await AuthService.signUp({
        firstName,
        email,
        password,
      });
      if (data) {
        toast.success(data.message || "Account created successfully!");
        router.push("/setup-organization");
        router.refresh();
      } else if (error) {
        setError(error);
      }
      setIsSubmitting(false);
    },
    [firstName, email, password, router]
  );

  return {
    firstName,
    setFirstName,
    email,
    setEmail,
    password,
    setPassword,
    error,
    isSubmitting,
    handleSubmit,
  };
}
// REFACTOR: All signup business logic and state moved to hook for SRP, DRY, and testability.
