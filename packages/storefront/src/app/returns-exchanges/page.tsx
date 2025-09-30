"use client";

import { ReturnsTabs } from "@/components/returns/ReturnsTabs";
import { useAuthContext } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ReturnsExchangesPage() {
  const { user, loading, isAuthenticated } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/auth/login"); // replace() avoids adding to history stack
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>{loading ? "Loading..." : "Redirecting to login..."}</p>
      </div>
    );
  }

  return <ReturnsTabs />
}
