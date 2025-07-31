import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { queryClient } from '@/queryClient';
import type { User } from '@/types/auth';
import { useQuery } from '@tanstack/react-query';

import { AuthContext } from '@/contexts/AuthContext';

import * as authApi from '@/apis/authApi';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Better query function that initializes from storage
  const { data: authData, isLoading } = useQuery({
    queryKey: ['auth'],
    queryFn: () => {
      const storedData = authApi.getStoredAuthData();
      return storedData ?? null;
    },
    staleTime: Infinity,
    retry: false,
  });

  useEffect(() => {
    if (authData) {
      setToken(authData.token);
      setRefreshToken(authData.refreshToken);
      setUser(authData.user);
      console.log('AuthData', authData);
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

        // Update query cache and invalidate to trigger re-fetch
        queryClient.setQueryData(['auth'], {
          token: t,
          refreshToken: rt,
          user: u,
        });

        // Force a refetch to ensure state is synchronized
        void queryClient.invalidateQueries({ queryKey: ['auth'] });
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
        }
      },
    }),
    [token, refreshToken, user, isLoading]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
