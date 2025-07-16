import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        const data = await apiClient.get<any>(
          "/api/v1/storefront/auth/profile"
        );
        setUser(data);
        setIsAuthenticated(true);
      } catch {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  return { user, loading, isAuthenticated };
}
