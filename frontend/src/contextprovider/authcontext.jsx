// src/contextprovider/authcontext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import jwt_decode from 'jwt-decode';
import { getAccessToken, getRefreshToken, clearTokens, isTokenExpired } from '../utils/tokenUtils.js';
import axiosInstance from './axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const updateUserFromToken = useCallback((token) => {
    try {
      const decoded = jwt_decode(token);
      setUser({ 
        id: decoded.sub, 
        role: decoded.role,
        email: decoded.email,
        name: decoded.name
      });
      return true;
    } catch (error) {
      console.error('Error decoding token:', error);
      clearTokens();
      setUser(null);
      return false;
    }
  }, []);

  // Check for existing session on load
  useEffect(() => {
    const checkAuth = async () => {
      const token = getAccessToken();
      if (token && !isTokenExpired(token)) {
        updateUserFromToken(token);
      } else {
        // Try to refresh token
        try {
          const refreshToken = getRefreshToken();
          if (refreshToken) {
            const response = await axiosInstance.post('/auth/refresh-token', { refreshToken });
            const { accessToken, refreshToken: newRefreshToken } = response.data;
            setTokens(accessToken, newRefreshToken);
            updateUserFromToken(accessToken);
          }
        } catch (error) {
          console.error('Session refresh failed:', error);
          clearTokens();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [updateUserFromToken]);

  const login = async ({ accessToken, refreshToken }) => {
    if (!accessToken) {
      throw new Error('Access token is required');
    }

    setTokens(accessToken, refreshToken);
    updateUserFromToken(accessToken);
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearTokens();
      setUser(null);
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading,
      login, 
      logout,
      isAuthenticated: !!user
    }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};