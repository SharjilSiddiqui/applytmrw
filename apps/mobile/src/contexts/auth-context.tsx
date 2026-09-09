import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { api } from "@/lib/api";
import {
  clearAuthSession,
  getAccessToken,
  getStoredUser,
  saveAuthSession,
} from "@/lib/auth-storage";
import type {
  AuthResponse,
  AuthUser,
  LoginRequest,
  RegisterRequest,
} from "@/types/auth";

type AuthContextValue = {
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  register: (data: RegisterRequest) => Promise<void>;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const restoreSession = useCallback(async () => {
    try {
      const [storedToken, storedUser] = await Promise.all([
        getAccessToken(),
        getStoredUser(),
      ]);

      if (storedToken && storedUser) {
        setAccessToken(storedToken);
        setUser(storedUser);
      }
    } catch (error) {
      console.error("Failed to restore authentication session:", error);

      await clearAuthSession();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  const saveSession = async (response: AuthResponse) => {
    await saveAuthSession(response.accessToken, response.user);

    setAccessToken(response.accessToken);
    setUser(response.user);
  };

  const register = async (data: RegisterRequest): Promise<void> => {
    const response = await api<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });

    await saveSession(response);
  };

  const login = async (data: LoginRequest): Promise<void> => {
    const response = await api<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });

    await saveSession(response);
  };

  const logout = async (): Promise<void> => {
    await clearAuthSession();

    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        isAuthenticated: Boolean(accessToken && user),
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
