import SafeScreen from "@/components/SafeScreen";
import { AuthProvider } from "@/contexts/AuthContexts";
import { Slot } from "expo-router";

export default function RootLayout() {
  return (
    <SafeScreen>
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </SafeScreen>
  );
}
