"use client";

import { ReactNode, useEffect } from "react";
import { ClientSidebarLayout } from "@/components/dashboard/ClientSidebar";
import { useRouter } from "next/navigation";
import { TenantProvider } from "@/contexts/tenant-context";
import { useAuthContext } from "@/contexts/auth-context";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <TenantProvider>
      <ClientSidebarLayout>{children}</ClientSidebarLayout>
    </TenantProvider>
  );
}
