import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthService } from "@/services/auth-service";

export function useLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError(null);
      const { data, error } = await AuthService.login({ email, password });
      if (data) {
        if (data.hasOrganizations) {
          toast.success("Welcome back! Loading your dashboard...");
          router.replace("/dashboard");
        } else {
          toast.info("Welcome! Let's set up your first organization.");
          router.push("/setup-organization");
        }
        router.refresh();
      } else if (error) {
        setError(error);
      }
      setIsSubmitting(false);
    },
    [email, password, router]
  );

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isSubmitting,
    handleSubmit,
  };
}
// REFACTOR: All login business logic and state moved to hook for SRP, DRY, and testability.
