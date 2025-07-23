import React from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '@/contexts/useAuth';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Otherwise render the protected page/component
  return children;
};
