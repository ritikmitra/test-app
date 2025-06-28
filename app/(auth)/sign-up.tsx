import { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false)
  const [showPassword, setshowPassword] = useState(false);
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

    if (!firstName || !lastName) {
      setError("First name and last name are required");
      return;
    }

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
    try {
      const response = await api.post(apiUrls.register,
        {
          username: email.trim().toLowerCase(),
          password,
          deviceToken: data,
          firstName,
          lastName
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
  const togglePasswordVisibility = () => {
    setshowPassword(prev => !prev);
    // setTimeout(() => {
    //   passwordInputRef.current?.focus();
    // }, 0); // small delay to allow state to update
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} 
    >

      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid
        enableAutomaticScroll
        keyboardShouldPersistTaps="handled"
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

          <View style={{ flexDirection: "row", gap: 10, marginBottom: 16, justifyContent: "space-between" }}>
            <TextInput style={[styles.InputNames, error && styles.errorInput]}
              placeholder='First Name'
              onFocus={() => setError("")}
              value={firstName}
              onChangeText={(firstName) => setFirstName(firstName)}
              placeholderTextColor="#9A8478"
              autoCapitalize='words'
            />
            <TextInput style={[styles.InputNames, error && styles.errorInput]}
              placeholder='Last Name'
              onFocus={() => setError("")}
              autoCapitalize='words'
              value={lastName}
              onChangeText={(lastName) => setLastName(lastName)}
              placeholderTextColor="#9A8478" />
          </View>



          <TextInput
            placeholder="Email"
            autoCapitalize="none"
            style={[styles.input, error && styles.errorInput]}
            value={email}
            placeholderTextColor="#9A8478"
            onFocus={() => setError("")}
            onChangeText={(email) => setEmail(email)} />


          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter Password"
              secureTextEntry={showPassword}
              style={[styles.passwordInput, error && styles.errorInput]}
              value={password}
              onFocus={() => setError("")}
              placeholderTextColor="#9A8478"
              onChangeText={(password) => setPassword(password)} />
            <TouchableOpacity onPress={togglePasswordVisibility}>
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={24} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
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
    </KeyboardAvoidingView>
  );
}