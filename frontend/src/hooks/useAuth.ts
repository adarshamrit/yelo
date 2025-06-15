import { useEffect, useState } from "react";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = typeof window !== "undefined" ? localStorage.getItem("yelo_token") : null;
    setToken(t);
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("yelo_token");
    setToken(null);
  };

  return { token, isAuthenticated: !!token, loading, logout };
}
