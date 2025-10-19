"use client";

import { AuthProvider } from "@/contexts/auth-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// ---- Centralized QueryClient factory ----
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Prevent excessive refetches
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: (failureCount, error: any) => {
          // Do not retry client errors
          if (error?.status >= 400 && error?.status < 500) return false;
          return failureCount < 3;
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 1,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Always new on server
    return makeQueryClient();
  }
  // Singleton in browser
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

// ---- Main Providers Wrapper ----
export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        {process.env.NODE_ENV === "development" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </AuthProvider>
  );
}
