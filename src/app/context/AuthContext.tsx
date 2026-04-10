import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authApi, User as ApiUser } from "../utils/api";
import { User, AuthContextType } from "../types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapApiUser(apiUser: ApiUser): User {
  return {
    id: apiUser.id,
    email: apiUser.email,
    name: apiUser.name,
    createdAt: new Date().toISOString(),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const storedUser = authApi.getCurrentUser();
    if (storedUser && authApi.isAuthenticated()) {
      setUser(mapApiUser(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    const mappedUser = mapApiUser(response.user);
    setUser(mappedUser);
    setIsGuest(false);
    return mappedUser;
  };

  const register = async (email: string, password: string, name: string) => {
    const response = await authApi.register(email, password, name);
    const mappedUser = mapApiUser(response.user);
    setUser(mappedUser);
    setIsGuest(false);
    return mappedUser;
  };

  const loginAsGuest = () => {
    setUser(null);
    setIsGuest(true);
  };

  const logout = async () => {
    authApi.logout();
    setUser(null);
    setIsGuest(false);
  };

  const isAuthenticated = () => {
    return authApi.isAuthenticated();
  };

  return (
    <AuthContext.Provider value={{ user, isGuest, isLoading, login, register, loginAsGuest, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
