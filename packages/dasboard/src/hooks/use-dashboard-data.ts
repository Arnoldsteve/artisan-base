"use client";

import { useEffect, useState, useMemo } from "react";
import { DashboardService } from "@/services/dashboard-service";
import { DashboardData } from "@/types/dashboard";

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    DashboardService.getDashboardData().then(({ data, error }) => {
      if (!mounted) return;
      if (data) {
        setData(data);
        setError(null);
      } else {
        setError(error);
      }
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return useMemo(() => ({ data, loading, error }), [data, loading, error]);
}
// REFACTOR: All dashboard data fetching and state moved to hook for SRP, DRY, and testability.
