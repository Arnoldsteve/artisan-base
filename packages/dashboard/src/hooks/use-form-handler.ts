// File: packages/dasboard/src/hooks/use-form-handler.ts
"use client";

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ApiError } from '@/lib/client-api'; // Import our custom error type

// --- Type Definitions ---

// A generic function signature for any async submission logic (e.g., login, createProduct)
// TData is the type of data the form submits (e.g., LoginDto)
// TResponse is the type of the expected successful response.
type SubmitFunction<TData, TResponse> = (data: TData) => Promise<TResponse>;

interface UseFormHandlerOptions {
  onSuccess?: (response: any) => void; // Optional callback for custom success logic
  onSuccessRedirect?: string;         // Optional path to redirect to on success
  successMessage?: string;            // Optional success toast message
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

    try {
      const response = await submitFn(data);

      // Show success toast if a message is provided
      if (options.successMessage) {
        toast.success(options.successMessage);
      }
      
      // Handle success actions
      if (options.onSuccess) {
        options.onSuccess(response);
      }
      
      if (options.onSuccessRedirect) {
        // Use router.push for client-side navigation within the dashboard
        router.push(options.onSuccessRedirect);
      }

    } catch (err) {
      // Handle the structured ApiError from our apiClient
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
    // Add a function to manually clear the error if needed
    clearError: () => setError(null) 
  };
}