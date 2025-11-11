"use client";

import { ReactNode, useEffect } from "react";
import { ClientSidebarLayout } from "@/components/dashboard/ClientSidebar";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth();
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

  return <ClientSidebarLayout>{children}</ClientSidebarLayout>;
}
