import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);



  const navigate = useNavigate();

  const updateUserFromToken = useCallback(async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data.user) {
        setUser(response.data.user);
        return true;
      }
      return false;
    } catch (error) {
      setUser(null);
      return false;
    }
  }, []);

  const refreshTokens = useCallback(async () => {
    try {
      const response = await api.post('/auth/refresh');
      if (response.data.success) {
        await updateUserFromToken();
        return true;
      }
      return false;
    } catch {
      setUser(null);
      return false;
    }
  }, [updateUserFromToken]);

  const checkAuth = useCallback(async () => {
    try {
      // Try to get the current user
      const userResponse = await api.get('/auth/me');
      if (userResponse.data.user) {
        setUser(userResponse.data.user);
      } else {
        // If no user but we have a session, try to refresh
        await refreshTokens();
      }
    } catch (error) {
      // If there's an error, clear the user and try to refresh
      setUser(null);
      try {
        await refreshTokens();
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
      }
    } finally {
      setLoading(false);
    }
  }, [refreshTokens]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (email, password, role) => {
    try {
      const response = await api.post('/auth/login', { email, password, role });
      if (response.data.success) {
        const success = await updateUserFromToken();
        return { success, error: success ? null : 'Failed to process login' };
      }
      return { success: false, error: response.data.message || 'Login failed' };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  }, [updateUserFromToken]);

  // Function to set user after registration
  const setUserAfterRegistration = useCallback(async (userData) => {
    try {
      // Verify the user session is valid
      const response = await api.get('/auth/me');
      if (response.data.user) {
        setUser(response.data.user);
        return true;
      }
      // If verification fails, set the user data from registration response
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Error verifying user session:', error);
      // Fallback to setting user data from registration response
      setUser(userData);
      return true;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout', {}, { withCredentials: true });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setLoading(false);
      navigate('/login');
    }
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        setUserAfterRegistration,
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
