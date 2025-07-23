import React, { createContext, useState } from 'react';
import jwt_decode from 'jwt-decode';
import axiosInstance from './axios';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = ({ accessToken, refreshToken }) => {
    if (!accessToken) {
      throw new Error('Access token is required');
    }

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    try {
      const decoded = jwt_decode(accessToken);
      setUser({ id: decoded.sub, role: decoded.role });
    } catch (error) {
      console.error('Error decoding token:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      throw new Error('Invalid token');
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
