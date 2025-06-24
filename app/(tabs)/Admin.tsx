import React, { useState, useEffect } from 'react';
import { COLORS } from '@/constants/color';
import { useAdmin } from '@/hooks/useAdmin';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Users } from '@/constants/types';
import { apiUrls } from '@/constants/apiUrls';
import api from '@/services/api';

const PAGE_SIZE = 10;

const Admin = () => {
  const { isLoading, users, fetchUsers } = useAdmin();
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState(users);
  const [page, setPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Users>();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filter users based on search input
  useEffect(() => {
    const lower = search.toLowerCase();
    const filteredList = users.filter(u =>
      u.email.toLowerCase().includes(lower) ||
      (u.displayName?.toLowerCase() || '').includes(lower)
    );
    setFiltered(filteredList);
    setPage(1); // reset pagination
  }, [search, users]);

  const paginated = filtered.slice(0, page * PAGE_SIZE);

  const loadMore = () => {
    if (paginated.length < filtered.length) {
      setPage(prev => prev + 1);
    }
  };

  const openModal = (user: Users) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const sendForm = async () => {
    // replace with your API logic
    if (!selectedUser || !title || !body) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    const payload = {
      userId: selectedUser.id,
      title,
      body,
    };
    try {
      const response = await api.post(apiUrls.sendnotifacation, payload);
      if (response.status === 200) {
        Alert.alert('Success', 'Notification sent successfully.');
      } else {
        Alert.alert('Error', 'Failed to send notification.');
      }
    } catch (error: any) {
      console.error('Error sending notification:', error.message);
      Alert.alert('Error', 'An error occurred while sending the notification.');

    }
    console.log('Sending payload:', payload);

    setModalVisible(false);
    setTitle('');
    setBody('');
  };

  if (isLoading && users.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.text}>Loading users...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search by email or name"
        value={search}
        onChangeText={setSearch}
      />

      {paginated.length > 0 ? (
        <FlatList
          data={paginated}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => openModal(item)} style={styles.row}>
              <View>
                <Text style={styles.text}>Email: {item.email}</Text>
                <Text style={styles.text}>Name: {item.displayName || 'N/A'}</Text>
              </View>
            </TouchableOpacity>
          )}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
        />
      ) : (
        <Text style={styles.text}>No users found.</Text>
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Send to {selectedUser?.displayName || selectedUser?.email}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Body"
              value={body}
              onChangeText={setBody}
              multiline
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <View style={styles.sendButton}>
                  <Text>Cancel</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={sendForm}>
                <View style={styles.sendButton}>
                  <Text>Send</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 15,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: { fontSize: 22, color: COLORS.text, fontWeight: 'bold' },
  text: { fontSize: 18, color: '#333' },
  searchInput: {
    margin: 10,
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  row: {
    backgroundColor: '#fff',
    marginVertical: 4,
    marginHorizontal: 10,
    padding: 12,
    borderRadius: 6,
    borderColor: '#ddd',
    borderWidth: 1,
    elevation: 2,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: '#00000055',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderRadius: 6,
    padding: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    padding: 8,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: COLORS.textLight,
    padding: 5,
    borderRadius: 6,
    alignItems: 'center',
    width: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  }
});

export default Admin;
