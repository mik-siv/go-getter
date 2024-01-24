import React, { useState, useEffect } from 'react';
import { AuthContext } from '../contexts/authentication.context';
import { jwtDecode } from 'jwt-decode';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const decodedToken: any = jwtDecode(storedToken);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp > currentTime) {
        setToken(storedToken);
      } else {
        localStorage.removeItem('token');
      }
    }
  }, []);
  const logIn = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const logOut = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};