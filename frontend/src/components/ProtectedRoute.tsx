import { useState, type ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  children?: ReactNode;
  redirectPath?: string;
}

export const ProtectedRoute = ({ children, redirectPath = '/login' }: ProtectedRouteProps) => {
  const [isAuthenticated] = useState<boolean>(false); // TODO: Replace with useAuth()

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children ?? <Outlet />}</>;
};
