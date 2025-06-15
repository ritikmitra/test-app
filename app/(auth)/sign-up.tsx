import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from "@/assets/styles/auth.styles"
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/color';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as Notifications from "expo-notifications"
import * as LocalAuthentication from 'expo-local-authentication';
import api from '@/services/api';
import { apiUrls } from '@/constants/apiUrls';

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false)
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [hasHardwareAsync, setHasHardwareAsync] = useState(false);
  const [biometryType, setBiometryType] = useState<LocalAuthentication.AuthenticationType>();

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setHasHardwareAsync(compatible);

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      setIsBiometricAvailable(isEnrolled);

      const biometricTypeResult = await LocalAuthentication.supportedAuthenticationTypesAsync();
      if (biometricTypeResult.length > 0) {
        setBiometryType(biometricTypeResult[0]);
      }
    })();
  }, []);

  const authenticate = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to access the app',
      fallbackLabel: 'Use Passcode',
      cancelLabel: 'Cancel',
    });

    console.log(result);


    if (result.success) {
      Alert.alert('Authentication Successful', 'You are now authenticated!');
    } else {
      switch (result.error) {
        case 'user_cancel':
          Alert.alert('Authentication Canceled', 'You canceled the authentication process.');
          break;
        case 'authentication_failed':
          Alert.alert('Authentication Failed', 'Incorrect biometrics or passcode.');
          break;
        case 'passcode_not_set':
          Alert.alert('Passcode Not Set', 'Please set up a passcode on your device.');
          break;
        case 'not_available':
          Alert.alert('Authentication Not Available', 'Local authentication is not available on this device.');
          break;
        default:
          Alert.alert('Authentication Error', `An unknown error occurred: ${result.error}`);
          break;
      }
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setError("")
    }, 5000);

    return () => clearTimeout(timeoutId)

  }, [error])

  const onSignUpPress = async () => {

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

    setLoading(true)

    console.log('Register:', email, password);
    const { data } = await Notifications.getDevicePushTokenAsync()
    // console.log(typeof data);

    try {
      const response = await api.post(apiUrls.register,
        {
          username: email,
          password,
          deviceToken: data
        }
      );
      const body = await response.data;
      if (response.status === 201) {
        Alert.alert("Success", body.message, [
          {
            text: "OK",
            onPress: () => router.replace("/sign-in"),
            style: "default"
          }
        ])
        return
      }
    } catch (error: any) {
      setError("An error occured. Please try again later");
      console.log(error);
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 400) {
        Alert.alert("Error", message)
        return
      }

      setLoading(false)
    } finally {
      setLoading(false)
    }
  };

  const scheduleNotification = () => {
    // First, set the handler that will cause the notification
    // to show the alert
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    // Second, call scheduleNotificationAsync()
    Notifications.scheduleNotificationAsync({
      content: {
        color: "#9A8478",
        title: 'Look at that notification',
        body: "I'm so proud of myself!",
      },
      trigger: null,
    });
  }

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, paddingLeft: 10, paddingRight: 10 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid
      enableAutomaticScroll
    >
      <View style={styles.container}>
        <Image source={require("@/assets/images/revenue-i2.png")} style={styles.illustration} />

        <Text style={styles.title}>Create Account</Text>

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
          onFocus={() => setError("")}
          onChangeText={(email) => setEmail(email)} />

        <TextInput
          placeholder="Enter Password"
          secureTextEntry={true}
          style={[styles.input, error && styles.errorInput]}
          value={password}
          onFocus={() => setError("")}
          placeholderTextColor="#9A8478"
          onChangeText={(password) => setPassword(password)} />

        {/* Loader is shown when loading is true */}
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={onSignUpPress}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        )}

        {/* <TouchableOpacity style={styles.button} onPress={authenticate}>
          <Text style={styles.buttonText}>Authenticate Using Biometrics</Text>
        </TouchableOpacity> */}

        <View style={styles.footerContainer}>
          <Text style={styles.footerText} >Already have a account?</Text>
          <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace("/sign-in")}>
            <Text style={styles.linkText}>Sign In</Text>
          </TouchableOpacity>
        </View>

      </View>
    </KeyboardAwareScrollView>
  );
}