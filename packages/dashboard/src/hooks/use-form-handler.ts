"use client";

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ApiError } from '@/lib/client-api'; 

type SubmitFunction<TData, TResponse> = (data: TData) => Promise<TResponse>;

interface UseFormHandlerOptions {
  onSuccess?: (response: any) => void; 
  onSuccessRedirect?: string;        
  successMessage?: string;           
}

/**
 * A generic and reusable hook to manage form submission state.
 * It handles loading, error states, and success notifications/redirects.
 * @param submitFn The async function that performs the API call.
 * @param options Configuration for success actions.
 */
export function useFormHandler<TData, TResponse>(
  submitFn: SubmitFunction<TData, TResponse>,
  options: UseFormHandlerOptions = {}
) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (data: TData) => {
    setIsLoading(true);
    setError(null);

    console.log("auth data", data)

    try {
      const response = await submitFn(data);

      if (options.successMessage) {
        toast.success(options.successMessage);
      }
      
      if (options.onSuccess) {
        options.onSuccess(response);
      }
      
      if (options.onSuccessRedirect) {
        router.push(options.onSuccessRedirect);
      }

    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        toast.error(err.message || "Submission failed.");
      } else {
        const message = "An unexpected error occurred. Please try again.";
        setError(message);
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [submitFn, options, router]);

  return { 
    isLoading, 
    error, 
    handleSubmit,
    clearError: () => setError(null) 
  };
}