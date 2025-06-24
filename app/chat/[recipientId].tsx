import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    TouchableOpacity,
} from 'react-native';
import { io } from 'socket.io-client';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/color';
import { useProfiles } from '@/hooks/useProfiles';
import { Message } from '@/constants/types';

const socket = io(process.env.EXPO_PUBLIC_API_URL);

export default function ChatScreen() {
    const { recipientId } = useLocalSearchParams();
    const [userId, setUserId] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<{ from: string; message: string }[]>([]);
    const { fetchLoggedInProfile, loggedInprofile, fetchProfileById, profile } = useProfiles();
    const flatListRef = useRef<FlatList<{ from: string; message: string }> | null>(null);

    const router = useRouter();

    useEffect(() => {
        const initProfiles = async () => {
            await fetchLoggedInProfile();
            if (recipientId) {
                await fetchProfileById(recipientId as string);
            }
        };
        initProfiles();
    }, [recipientId]);

    useEffect(() => {
        if (!loggedInprofile?.id || !profile?.email) return;

        setUserId(loggedInprofile.id);

        if (!socket.connected) {
            socket.connect();
        }

        const handleReceiveMessage = ({ from, message }: Message) => {
            setMessages((prev) => [...prev, { from, message, email: profile.email }]);
        };

        socket.emit('join', loggedInprofile.id);
        socket.on('receive-message', handleReceiveMessage);

        return () => {
            socket.off('receive-message', handleReceiveMessage);
            socket.disconnect();
        };
    }, [loggedInprofile?.id, profile?.email]);

    const sendMessage = () => {
        if (message.trim() === '') return;

        socket.emit('send-message', {
            from: userId,
            to: recipientId,
            message,
        });

        setMessages((prev) => [...prev, { from: userId, message, email: loggedInprofile.email }]);
        setMessage('');
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const renderItem = ({ item }: { item: Message }) => (
        <Text style={item.from === userId ? styles.myMessage : styles.theirMessage}>
            {item.message}
        </Text>
    );

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0} // adjust for header height if needed
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                        <Ionicons name='arrow-back' size={25} onPress={() => { router.push("/(tabs)/UserList") }} color={COLORS.primary} />
                        <Text style={styles.header}>{profile.email}</Text>
                    </View>

                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        renderItem={renderItem}
                        keyExtractor={(_, index) => index.toString()}
                        contentContainerStyle={styles.messageList}
                        keyboardShouldPersistTaps="handled"
                        onContentSizeChange={() =>
                            flatListRef.current?.scrollToEnd({ animated: true })
                        }
                    />

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={message}
                            onChangeText={setMessage}
                            placeholder="Type a message..."
                            placeholderTextColor={'#9A8478'}
                        />
                        <TouchableOpacity style={{
                            padding: 10,
                            borderRadius: 100,
                            backgroundColor: '#fff',
                        }}>
                            <Ionicons name='send' size={25} onPress={sendMessage} color={COLORS.primary} />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        paddingBottom: 10,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 16,
        marginVertical: 10,
    },
    messageList: {
        flexGrow: 1,
        justifyContent: 'flex-end',
        paddingBottom: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderColor: '#ddd',
        borderRadius: 8,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 8,
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: COLORS.background,
        padding: 10,
        marginVertical: 4,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 0,
        maxWidth: '80%',
    },
    theirMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#eee',
        padding: 10,
        marginVertical: 4,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 8,
        maxWidth: '80%',
    },
});
