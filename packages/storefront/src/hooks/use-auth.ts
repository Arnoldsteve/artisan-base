import { useEffect, useState } from "react";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        const res = await fetch("/api/v1/storefront/auth/me", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
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
