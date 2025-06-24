import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAdmin } from '@/hooks/useAdmin';
import { Users } from '@/constants/types';
import { COLORS } from '@/constants/color';

export default function UserListScreen() {
  const { users, isLoading, fetchUsers } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserPress = (userId: string) => {
    router.push(`/chat/${userId}`);
  };

  const renderItem = ({ item }: { item: Users }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => handleUserPress(item.id)}
    >
      <Text style={styles.userEmail}>{item.email}</Text>
    </TouchableOpacity>
  );

  if (isLoading || !users?.length) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading users...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a user to chat with</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#222',
  },
  listContainer: {
    paddingBottom: 20,
  },
  userItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 1, // for Android shadow
    shadowColor: '#000', // for iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  userEmail: {
    fontSize: 16,
    color: '#333',
  },
  separator: {
    height: 12,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
});
