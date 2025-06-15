import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Helper to get token cross-platform
const getToken = async (key: string): Promise<string | null> =>
    Platform.OS === 'web'
        ? localStorage.getItem(key)
        : await SecureStore.getItemAsync(key);

const storeToken = async (key: string, value: string) => {
    Platform.OS === 'web'
        ? localStorage.setItem(key, value)
        : await SecureStore.setItemAsync(key, value);
};

const deleteToken = async (key: string) => {
    Platform.OS === 'web'
        ? localStorage.removeItem(key)
        : await SecureStore.deleteItemAsync(key);
};

const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
});

// Add Authorization header
api.interceptors.request.use(async (config) => {
    const token = await getToken('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 and attempt refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        const isAuthRoute =
            originalRequest.url.includes('/login') ||
            originalRequest.url.includes('/refresh') ||
            originalRequest.url.includes('/register');

        // Avoid infinite loop
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !isAuthRoute
        ) {
            originalRequest._retry = true;

            try {
                const refreshToken = await getToken('refreshToken');

                if (!refreshToken) throw new Error('No refresh token');

                // Refresh token request
                const res = await axios.post(`${process.env.EXPO_BASE_URL}/refresh`, {
                    refreshToken,
                });

                const newAccessToken = res.data.accessToken;
                await storeToken('accessToken', newAccessToken);

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed – logout user
                await deleteToken('accessToken');
                await deleteToken('refreshToken');
                // Optional: redirect to login
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
