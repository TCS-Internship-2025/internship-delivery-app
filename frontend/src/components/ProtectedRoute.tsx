import { type ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children?: ReactNode;
  redirectPath?: string;
}

export const ProtectedRoute = ({ children, redirectPath = '/login' }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children ?? <Outlet />}</>;
};
