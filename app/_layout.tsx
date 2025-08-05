import SafeScreen from "@/components/SafeScreen";
import { AuthProvider } from "@/contexts/AuthContexts";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { GoogleSignin} from "@react-native-google-signin/google-signin"

export default function RootLayout() {

  useEffect(() => {
    GoogleSignin.configure({
      webClientId : "737848617497-np448v9979gv6id6uj2on575b78a79in.apps.googleusercontent.com"
    })
  }, [])
  

  return (
    <SafeScreen>
      <AuthProvider>
        <Stack screenOptions={{
          headerShown: false,
          animation: "ios_from_right"
        }} />
      </AuthProvider>
    </SafeScreen>
  );
}
