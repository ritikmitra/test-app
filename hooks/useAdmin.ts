import { Users } from '@/constants/types';
import api from '@/services/api';
import { useState, useCallback } from 'react';
import { Alert } from 'react-native';



export const useAdmin = () => {
    const [isLoading, setLoading] = useState(false);
    const [users, setUsers] = useState<Users[]>([]);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/users');
            const data = await response.data;
            setUsers(data);
        } catch (error: any) {
            Alert.alert('Error fetching profiles:', error.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        isLoading,
        users,
        fetchUsers
    };
}