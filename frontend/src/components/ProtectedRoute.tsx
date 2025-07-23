import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  redirectPath?: string;
}

export const ProtectedRoute = ({ redirectPath = '/login' }: ProtectedRouteProps) => {
  const [isAuthenticated] = useState<boolean>(false); // TODO: Replace with useAuth()

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};
