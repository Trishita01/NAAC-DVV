// src/PrivateRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './auth/authProvider';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, hasRole, initialized } = useAuth();
  const location = useLocation();

  if (!initialized) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length === 0 || hasRole(allowedRoles)) {
    return children;
  }

  return <Navigate to="/unauthorized" state={{ from: location }} replace />;
};

export default PrivateRoute;
