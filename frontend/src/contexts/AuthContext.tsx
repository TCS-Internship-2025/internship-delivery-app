import React, { createContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { queryClient } from '@/queryClient';
import { type AuthContextType, type User } from '@/types/auth';

import { authService } from '@/services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const authData = authService.loadAuthData();
    if (authData) {
      setUser(authData.user);
      setToken(authData.token);
      authService.setAuthToken(authData.token);
    } else {
      logout();
    }
  }, []);

  const setAuthData = (token: string, user: User) => {
    setUser(user);
    setToken(token);
    authService.saveAuthData(token, user);
    authService.setAuthToken(token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    authService.clearAuthToken();
    authService.clearAuthData();
    queryClient.clear();
  };

  const contextValue: AuthContextType = useMemo(
    () => ({
      user,
      token,
      logout,
      isAuthenticated: !!token && !!user,
      setAuthData,
    }),
    [user, token]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// Exporting the context to use in useAuth.ts
export { AuthContext };
