import { apiUrls } from '@/constants/apiUrls';
import api from '@/services/api';
import { useState, useCallback } from 'react';
import { Alert } from 'react-native';

export const useProfiles = () => {
    const [isLoading, setLoading] = useState(false);
    const [loggedInprofile, setLoggedInProfile] = useState({
        id: "",
        email: "",
        isPasskey: false,
        displayName: null
    });

    const [profile, setProfile] = useState({
        id: "",
        email: "",
        isPasskey: false,
        displayName: null
    })

    const fetchLoggedInProfile = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get(apiUrls.profile);
            const data = await response.data;
            setLoggedInProfile(data);
        } catch (error : any) {
            Alert.alert('Error fetching profiles:', error.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchProfileById = useCallback(async (id: string) => {
        setLoading(true);
        try {
            const response = await api.get(`/user/${id}`);
            const data = await response.data;
            setProfile(data);
        } catch (error : any) {
            Alert.alert('Error fetching profiles:', error.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        isLoading,
        loggedInprofile,
        fetchLoggedInProfile,
        fetchProfileById,
        profile,
    };

}