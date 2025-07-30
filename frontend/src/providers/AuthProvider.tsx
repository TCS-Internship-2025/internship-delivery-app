import { useEffect, useMemo, useState, type ReactNode } from 'react';
import type { User } from '@/types/auth';
import { useQuery } from '@tanstack/react-query';

import { AuthContext } from '@/contexts/AuthContext';

import * as authApi from '@/apis/authApi';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const { data: authData, isLoading } = useQuery({
    queryKey: ['auth', 'stored'],
    queryFn: authApi.getStoredAuthData,
    staleTime: Infinity,
    retry: false,
  });

  useEffect(() => {
    if (authData) {
      setToken(authData.token);
      setRefreshToken(authData.refreshToken);
      setUser(authData.user);
    } else {
      setToken(null);
      setRefreshToken(null);
      setUser(null);
    }
  }, [authData]);

  const contextValue = useMemo(
    () => ({
      user,
      token,
      refreshToken,
      isAuthenticated: Boolean(user && token),
      isLoading,
      setAuthData: (t: string, rt: string, u: User) => {
        setToken(t);
        setRefreshToken(rt);
        setUser(u);
        authApi.saveAuthData(t, rt, u);
      },
      logout: async () => {
        try {
          await authApi.logout();
        } catch (error) {
          console.warn('Logout API call failed:', error);
        } finally {
          setToken(null);
          setRefreshToken(null);
          setUser(null);
          authApi.clearAuthData();
        }
      },
    }),
    [token, refreshToken, user, isLoading]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
