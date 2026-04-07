import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import { useAppStore } from '../src/store/appStore';

export default function RootLayout() {
  const hydrate = useAppStore((s) => s.hydrate);
  const setAuth = useAppStore((s) => s.setAuth);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const hydrated = useAppStore((s) => s.hydrated);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    async function init() {
      await hydrate();
      try {
        const token = await SecureStore.getItemAsync('fintrack:token');
        const userRaw = await SecureStore.getItemAsync('fintrack:user');
        if (token && userRaw) {
          setAuth(true, JSON.parse(userRaw));
        }
      } catch {
        setAuth(false, null);
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const inAuth = segments[0] === '(auth)';
    if (!isAuthenticated && !inAuth) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuth) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, hydrated, segments]);

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="modal/coming-soon"
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen
          name="modal/transaction-form"
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen
          name="modal/portfolio-form"
          options={{ presentation: 'modal' }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}