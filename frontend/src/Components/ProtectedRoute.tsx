import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: string[]; // Optional: Specify roles allowed for this route
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // Show loading indicator while checking auth status
    return <div>Checking authentication...</div>;
  }

  if (!user) {
    // User not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // Check roles if allowedRoles prop is provided
  if (allowedRoles && allowedRoles.length > 0) {
    const userRoles = user.roles?.map((role: { name: string }) => role.name) || [];
    const hasRequiredRole = userRoles.some((roleName: string) => allowedRoles.includes(roleName)); // Explicitly type roleName

    if (!hasRequiredRole) {
      // User does not have the required role, redirect (e.g., to home or unauthorized page)
      // For simplicity, redirecting home for now.
      return <Navigate to="/" replace />;
    }
  }

  // User is authenticated and has the required role (if specified), render the child route element
  return <Outlet />;
};

export default ProtectedRoute;
