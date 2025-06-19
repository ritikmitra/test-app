import { COLORS } from '@/constants/color';
import { useAuth } from '@/contexts/AuthContexts';
import { useProfiles } from '@/hooks/useProfiles';
import { Ionicons } from '@expo/vector-icons';
import { Link, Stack } from 'expo-router';
import { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';

const Profile = () => {
  const { isLoading, profiles, fetchProfiles } = useProfiles();
  const { logout } = useAuth();

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!profiles) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No profile data available.</Text>
      </View>
    );
  }

  return (<>
    <Stack.Screen options={{ animation: 'slide_from_left' }} />
    <View style={styles.container}>
      <View style={styles.header}>
        <Link href="/">
          <Ionicons name='arrow-back' size={24} color='black' />
        </Link>
        <Text style={styles.headerTitle}>User Profile</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Ionicons name='log-out-outline' size={24} color='white' />
        </TouchableOpacity>
      </View>
      <View style={styles.card}>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{profiles.email || 'N/A'}</Text>

        <Text style={styles.label}>Display Name:</Text>
        <Text style={styles.value}>{profiles.displayName || 'N/A'}</Text>

        <Text style={styles.label}>Uses Passkey:</Text>
        <Text style={styles.value}>{profiles.isPasskey ? 'Yes' : 'No'}</Text>
      </View>
    </View>
  </>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
  },
  logoutButton: {
    backgroundColor: COLORS.primary,
    padding: 8,
    borderRadius: 100,
    boxShadow: '0px 2px 3.5px rgba(0,0,0,0.2)'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 22,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    fontSize: 16,
    color: '#D9534F',
  },
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 12,
  },
  value: {
    fontSize: 18,
    color: '#222',
  },
});

export default Profile;
