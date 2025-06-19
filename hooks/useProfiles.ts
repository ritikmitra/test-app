import api from '@/services/api';
import { useState, useCallback } from 'react';
import { Alert } from 'react-native';

export const useProfiles = () => {
    const [isLoading, setLoading] = useState(false);
    const [profiles, setProfiles] = useState({
        id: "",
        email: "",
        isPasskey: false,
        displayName: null
    });

    const fetchProfiles = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/profile');
            const data = await response.data;
            setProfiles(data);
        } catch (error : any) {
            Alert.alert('Error fetching profiles:', error.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        isLoading,
        profiles,
        fetchProfiles
    };

}