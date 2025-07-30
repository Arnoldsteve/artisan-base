// File: packages/dasboard/src/app/providers.tsx
"use client"; // This MUST be a client component

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // Highly recommended for debugging
import { useState } from "react";
import { Toaster } from 'sonner';

export default function Providers({ children }: { children: React.ReactNode }) {
  // Use useState to ensure the QueryClient is only created once per component lifecycle.
  // This prevents re-creating the client on every render.
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Optional: Default staleTime to prevent instant refetches
        staleTime: 1000 * 20, // 20 seconds
      },
    },
  }));

  return (
    // Provide the client to your entire App
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="top-right" />
      {/* The React Query Devtools are an invaluable tool for debugging */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}