import { useProfiles } from '@/hooks/useProfiles';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { io } from 'socket.io-client';

const socket = io(process.env.EXPO_PUBLIC_API_URL); // Replace with your backend URL

export default function Chats() {
  const [userId, setUserId] = useState('');
  const [recipientId, setRecipientId] = useState('user2'); // who to message
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ from: string; message: string }[]>([]);
  const { isLoading,fetchLoggedInProfile,loggedInprofile } = useProfiles();


  useEffect(() => {
    fetchLoggedInProfile();
  }, []);



  useEffect(() => {
    if (!loggedInprofile.id) return;

    setUserId(loggedInprofile.id);
    console.log(`Connecting to server with userId: ${loggedInprofile.id}`);

    socket.connect();

    socket.on('connect', () => {
      console.log(`Connected to server ${loggedInprofile.id}`);
      socket.emit('join', loggedInprofile.id);
    });

    socket.on('receive-message', ({ from, message }) => {
      setMessages((prev) => [...prev, { from, message }]);
    });

    return () => {
      socket.disconnect();
    };
  }, [loggedInprofile.id]);

  const sendMessage = () => {
    if (message.trim() === '') return;

    socket.emit('send-message', {
      from: userId,
      to: recipientId,
      message,
    });

    setMessages((prev) => [...prev, { from: userId, message }]);
    setMessage('');
  };

  const renderItem = ({ item }) => (
    <Text style={item.from === userId ? styles.myMessage : styles.theirMessage}>
      {item.from}: {item.message}
    </Text>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
      />

      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="Type a message..."
      />
      <Button  title="Send" onPress={sendMessage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginBottom: 90 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginVertical: 10 },
  myMessage: { alignSelf: 'flex-end', backgroundColor: '#dcf8c6', padding: 10, margin: 5 },
  theirMessage: { alignSelf: 'flex-start', backgroundColor: '#eee', padding: 10, margin: 5 },
});
