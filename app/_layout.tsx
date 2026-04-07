import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppStore } from '../src/store/appStore';

export default function RootLayout() {
  const hydrate = useAppStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, []);

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