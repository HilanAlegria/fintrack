import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="modal/coming-soon"
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen
          name="modal/transaction-form"
          options={{ presentation: 'modal' }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}