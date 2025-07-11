import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  userId: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      const id = parseUserIdFromToken(storedToken);
      if (id) {
        setToken(storedToken);
        setUserId(id);
      } else {
        localStorage.clear();
      }
    }
  }, []);

  const login = (newToken: string) => {
    const id = parseUserIdFromToken(newToken);
    if (id) {
      setToken(newToken);
      setUserId(id);
      localStorage.setItem("token", newToken);
      localStorage.setItem("userId", id);
    }
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        token,
        userId,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

function parseUserIdFromToken(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id || payload.user_id || null;
  } catch {
    return null;
  }
}
