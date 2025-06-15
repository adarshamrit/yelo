import { useEffect, useState } from "react";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ username?: string; email?: string; phone?: string; is_admin?: boolean } | null>(null);

  useEffect(() => {
    const syncToken = () => {
      const t = typeof window !== "undefined" ? localStorage.getItem("yelo_token") : null;
      setToken(t);
      setLoading(false);
    };
    syncToken();
    window.addEventListener("storage", syncToken);
    return () => window.removeEventListener("storage", syncToken);
  }, []);

  useEffect(() => {
    if (token) {
      fetch("http://localhost:8000/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.ok ? res.json() : null)
        .then((data) => setUser(data))
        .catch(() => setUser(null));
    } else {
      setUser(null);
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem("yelo_token");
    setToken(null);
    setUser(null);
  };

  const login = (newToken: string) => {
    localStorage.setItem("yelo_token", newToken);
    setToken(newToken);
  };

  return { token, isAuthenticated: !!token, loading, logout, login, user };
}
