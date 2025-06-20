import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

type AuthContextType = {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  login: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  userRole: UserRole;
};

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

type DecodedToken = {
  userId: string;
  username: string;
  tokenType: 'access' | 'refresh';
  iat?: number;
  exp?: number;
  role: UserRole;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  login: async () => { },
  logout: async () => { },
  userRole: UserRole.USER,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.USER);

  const storeToken = async (key: string, value: string) => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  };

  const getToken = async (key: string): Promise<string | null> => {
    return Platform.OS === 'web'
      ? localStorage.getItem(key)
      : await SecureStore.getItemAsync(key);
  };

  const deleteToken = async (key: string) => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  };

  const decodeToken = (token: string) => {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setDecodedToken(decoded);
      setUserRole(decoded.role);
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  };

  const login = async (access: string, refresh: string) => {
    await storeToken('accessToken', access);
    await storeToken('refreshToken', refresh);
    setAccessToken(access);
    setRefreshToken(refresh);
    setIsAuthenticated(true);
    decodeToken(access);
    if (decodedToken) {
      setUserRole(decodedToken.role);
    }
  };

  const logout = async () => {
    await deleteToken('accessToken');
    await deleteToken('refreshToken');
    setAccessToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);
    setDecodedToken(null);
    setUserRole(UserRole.USER);
  };

  const loadTokens = async () => {
    const access = await getToken('accessToken');
    const refresh = await getToken('refreshToken');
    setAccessToken(access);
    setRefreshToken(refresh);
    setIsAuthenticated(!!access);
    if (access) {
      decodeToken(access);
    }
  };

  useEffect(() => {
    loadTokens();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        accessToken,
        login,
        logout,
        refreshToken,
        userRole: userRole || UserRole.USER,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
