// app/(screens)/_layout.tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, 
        animation: 'slide_from_right', // You can change this to 'fade', 'slide_from_bottom', etc.
      }}
    />
  );
}