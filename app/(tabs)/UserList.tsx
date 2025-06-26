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
      <Text style={styles.userEmail}>{item.displayName || item.email}</Text>
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Friends</Text>
      </View>
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 20,
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 22,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  listContainer: {
    flexGrow: 1,
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 10,
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
