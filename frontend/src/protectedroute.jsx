import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './auth/authProvider';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If allowedRoles is empty, allow access
  if (allowedRoles.length === 0) {
    return children;
  }

  // Check if user's role is in allowedRoles
  if (user && allowedRoles.includes(user.role)) {
    return children;
  }

  // If user doesn't have required role, redirect to unauthorized page
  return <Navigate to="/unauthorized" />;
};

export default PrivateRoute;
