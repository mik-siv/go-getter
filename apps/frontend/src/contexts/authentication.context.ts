import React, { createContext } from 'react';

interface AuthContextData {
  token: string | null;
  logIn: (token: string) => void;
  logOut: () => void;
}

export const AuthContext = createContext<AuthContextData | null>(null);
export const useAuthContext = (): AuthContextData | null => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};