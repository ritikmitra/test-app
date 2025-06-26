import { COLORS } from '@/constants/color';
import { useAuth } from '@/contexts/AuthContexts';
import { useProfiles } from '@/hooks/useProfiles';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Link, Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';

const Profile = () => {
  const { isLoading, fetchLoggedInProfile, loggedInprofile } = useProfiles();
  const { logout, userRole } = useAuth();

  const router = useRouter()

  useEffect(() => {
    fetchLoggedInProfile();
  }, [fetchLoggedInProfile]);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/sign-in");
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!loggedInprofile) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No profile data available.</Text>
      </View>
    );
  }

  return (<>
    <Stack.Screen options={{ animation: 'slide_from_right' }} />
    <View style={styles.container}>
      <View style={styles.header}>
        <Link href="/sign-in">
          <Ionicons name='arrow-back' size={24} color='black' />
        </Link>
        <Text style={styles.headerTitle}>User Profile</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {
            userRole === 'ADMIN' && (
              <TouchableOpacity
                onPress={() => router.push('/(screens)/Admin')}
                style={{ padding: 8, borderRadius: 100, backgroundColor: COLORS.primary }}
              >
                <MaterialIcons name='admin-panel-settings' size={24} color='white' />
              </TouchableOpacity>
            )
          }
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name='log-out-outline' size={24} color='white' />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.card}>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{loggedInprofile.email || 'N/A'}</Text>

        <Text style={styles.label}>Display Name:</Text>
        <Text style={styles.value}>{loggedInprofile.displayName || 'N/A'}</Text>

        <Text style={styles.label}>Uses Passkey:</Text>
        <Text style={styles.value}>{loggedInprofile.isPasskey ? 'Yes' : 'No'}</Text>
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
    gap: 12,
    padding: 0,
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
