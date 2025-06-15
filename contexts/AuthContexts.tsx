import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

type AuthContextType = {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken : string | null;
  login: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  accessToken: null,
  refreshToken : null,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  const login = async (access: string, refresh: string) => {
    await storeToken('accessToken', access);
    await storeToken('refreshToken', refresh);
    setAccessToken(access);
    setRefreshToken(refresh);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await deleteToken('accessToken');
    await deleteToken('refreshToken');
    setAccessToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);
  };

  const loadTokens = async () => {
    const access = await getToken('accessToken');
    const refresh = await getToken('refreshToken');
    setAccessToken(access);
    setRefreshToken(refresh);
    setIsAuthenticated(!!access);
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
        refreshToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
