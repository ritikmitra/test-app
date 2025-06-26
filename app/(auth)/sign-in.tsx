import { useAuth } from '@/contexts/AuthContexts';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { styles } from "@/assets/styles/auth.styles"
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/color';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as Notifications from "expo-notifications"
import api from '@/services/api';
import { apiUrls } from '@/constants/apiUrls';
import { loginResponseBody } from '@/constants/types';

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const router = useRouter();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setError("")
    }, 5000);

    return () => clearTimeout(timeoutId)

  }, [error])

  const onSignInPress = async () => {
    console.log('Sign in:', email, password);

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Invalid email format");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    const { data } = await Notifications.getDevicePushTokenAsync()

    setLoading(true)

    try {
      const response = await api.post(apiUrls.login, {
        username: email,
        password,
        deviceToken: data
      })

      const body: loginResponseBody = await response.data;

      if (response.status === 200) {
        login(body.accessToken, body.refreshToken)
        return
      }

    } catch (error: any) {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 401 || status === 400) {
        Alert.alert("Login Failed", message || "Invalid email or password.");
      } else {
        Alert.alert("Error", "An unexpected error occurred.");
      }

      console.error("Login error:", error);

      setError("An error occured. Please try again later");

      setLoading(false)
    } finally {
      setLoading(false)
    }

    // router.push('/')

  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid
      enableAutomaticScroll
    >
      <View style={styles.container}>
        <Image source={require("@/assets/images/revenue-i4.png")} style={styles.illustration} />
        <Text style={styles.title}>Welcome back</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}> {error}</Text>
            <TouchableOpacity onPress={() => setError("")}>
              <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}

        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          style={[styles.input, error && styles.errorInput]}
          value={email}
          placeholderTextColor="#9A8478"
          onChangeText={(email) => setEmail(email)} />

        <TextInput
          placeholder="Enter Password"
          secureTextEntry
          style={[styles.input, error && styles.errorInput]}
          value={password}
          placeholderTextColor="#9A8478"
          onChangeText={(password) => setPassword(password)} />

        {loading ?
          <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
          : (<TouchableOpacity style={styles.button} onPress={onSignInPress}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>)
        }

        <View style={styles.footerContainer}>
          <Text style={styles.footerText} >Don&apos;t have an account?</Text>
          <TouchableOpacity onPress={() => router.replace('/sign-up')}>
            <Text style={styles.linkText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}