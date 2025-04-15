import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';


const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Checking authentication...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRoles = user.roles?.map((role) => role.name) || [];
    const hasRequiredRole = userRoles.some((roleName) => allowedRoles.includes(roleName));

    if (!hasRequiredRole) {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
