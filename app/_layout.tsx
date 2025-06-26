import SafeScreen from "@/components/SafeScreen";
import { AuthProvider } from "@/contexts/AuthContexts";
import { Stack } from "expo-router";

export default function RootLayout() {
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
