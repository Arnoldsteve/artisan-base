import { useState } from "react";
import { useRouter } from "next/navigation";

type SubmitFn = (data: any) => Promise<any>;

export function useAuthForm(submitFn: SubmitFn, onSuccessRedirect: string) {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    setLoading(true);
    setError("");
    try {
      const res = await submitFn(data);
      if (res && res.customer) {
        router.replace(onSuccessRedirect);
      } else {
        setError(res.message || "Authentication failed");
      }
    } catch (e: any) {
      setError(e?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return { error, loading, handleSubmit };
}
