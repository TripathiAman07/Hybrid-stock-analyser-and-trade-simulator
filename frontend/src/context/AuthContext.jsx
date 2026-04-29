import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getCurrentUser, loginRequest, logoutRequest, registerRequest } from "@/services/authApi";

const AuthContext = createContext(null);
const STORAGE_KEY = "quantyx_auth";

function readStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStoredAuth(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function clearStoredAuth() {
  localStorage.removeItem(STORAGE_KEY);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [loading, setLoading] = useState(true);

  const persistSession = (session) => {
    setUser(session.user);
    setAccessToken(session.accessToken);
    setRefreshToken(session.refreshToken);
    writeStoredAuth(session);
  };

  const clearSession = () => {
    setUser(null);
    setAccessToken("");
    setRefreshToken("");
    clearStoredAuth();
  };

  useEffect(() => {
    const bootstrap = async () => {
      const stored = readStoredAuth();
      if (!stored?.accessToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await getCurrentUser(stored.accessToken);
        persistSession({
          user: response.user,
          accessToken: stored.accessToken,
          refreshToken: stored.refreshToken || "",
        });
      } catch {
        clearSession();
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const login = async ({ email, password }) => {
    const response = await loginRequest({ email, password });
    persistSession(response);
    return response;
  };

  const register = async ({ name, email, password }) => {
    const response = await registerRequest({ name, email, password });
    persistSession(response);
    return response;
  };

  const logout = async () => {
    try {
      if (accessToken) {
        await logoutRequest(accessToken);
      }
    } finally {
      clearSession();
    }
  };

  const value = useMemo(() => ({
    user,
    accessToken,
    refreshToken,
    loading,
    isAuthenticated: Boolean(user && accessToken),
    login,
    register,
    logout,
  }), [user, accessToken, refreshToken, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
