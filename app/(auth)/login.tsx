import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { useTheme } from '../../src/components/ui/useTheme';
import { useAppStore } from '../../src/store/appStore';
import { Colors, FontSize, Radius } from '../../src/constants/tokens';
import { withAlpha } from '../../src/components/shared/colors';

export default function LoginScreen() {
  const theme = useTheme();
  const router = useRouter();
  const setAuth = useAppStore((s) => s.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Campos incompletos', 'Por favor ingresa tu email y contrasena.');
      return;
    }

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      const fakeToken = `token_${Date.now()}`;
      await SecureStore.setItemAsync('fintrack_token', fakeToken);
      await SecureStore.setItemAsync('fintrack_user', JSON.stringify({
        name: email.split('@')[0],
        email,
        plan: 'Pro',
      }));
      setAuth(true, { name: email.split('@')[0], email, plan: 'Pro' });
      router.replace('/(tabs)');
    } catch {
      Alert.alert('Error', 'No se pudo iniciar sesion. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  function handleForgotPassword() {
    Alert.alert('Proximamente', 'La recuperacion de contrasena estara disponible cuando se conecte el backend.');
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoWrap}>
            <View style={[styles.logoIcon, { backgroundColor: Colors.brand }]}>
              <Ionicons name="wallet-outline" size={36} color="#fff" />
            </View>
            <Text style={[styles.logoTitle, { color: theme.textPrimary }]}>FinTrack</Text>
            <Text style={[styles.logoSubtitle, { color: theme.textSecondary }]}>
              Gestiona tus finanzas personales
            </Text>
          </View>

          <Text style={[styles.screenTitle, { color: theme.textPrimary }]}>Iniciar sesion</Text>

          <Text style={[styles.label, { color: theme.textSecondary }]}>Correo electronico</Text>
          <View style={[styles.inputWrap, { backgroundColor: theme.surfaceSolid, borderColor: theme.border }]}>
            <Ionicons name="mail-outline" size={18} color={theme.textSecondary} />
            <TextInput
              style={[styles.input, { color: theme.textPrimary }]}
              placeholder="correo@ejemplo.com"
              placeholderTextColor={theme.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <Text style={[styles.label, { color: theme.textSecondary }]}>Contrasena</Text>
          <View style={[styles.inputWrap, { backgroundColor: theme.surfaceSolid, borderColor: theme.border }]}>
            <Ionicons name="lock-closed-outline" size={18} color={theme.textSecondary} />
            <TextInput
              style={[styles.input, { color: theme.textPrimary }]}
              placeholder="Tu contrasena"
              placeholderTextColor={theme.textSecondary}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color={theme.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotWrap} onPress={handleForgotPassword}>
            <Text style={[styles.forgotLabel, { color: Colors.brand }]}>Olvidaste tu contrasena?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: loading ? withAlpha(Colors.brand, 0.6) : Colors.brand }]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.btnLabel}>{loading ? 'Ingresando...' : 'Ingresar'}</Text>
          </TouchableOpacity>

          <View style={styles.registerWrap}>
            <Text style={[styles.registerText, { color: theme.textSecondary }]}>No tienes cuenta? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={[styles.registerLink, { color: Colors.brand }]}>Registrate</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24, paddingTop: 20, paddingBottom: 40 },
  logoWrap: { alignItems: 'center', marginBottom: 40, marginTop: 20 },
  logoIcon: { width: 72, height: 72, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  logoTitle: { fontSize: 28, fontWeight: '700', marginBottom: 6 },
  logoSubtitle: { fontSize: FontSize.body, textAlign: 'center' },
  screenTitle: { fontSize: FontSize.title, fontWeight: '600', marginBottom: 24 },
  label: { fontSize: FontSize.label, fontWeight: '500', marginBottom: 8 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', borderRadius: Radius.card, borderWidth: 0.5, paddingHorizontal: 14, marginBottom: 16, height: 52, columnGap: 10 },
  input: { flex: 1, fontSize: FontSize.body },
  forgotWrap: { alignItems: 'flex-end', marginBottom: 24 },
  forgotLabel: { fontSize: FontSize.label, fontWeight: '500' },
  btn: { height: 52, borderRadius: Radius.card, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  btnLabel: { color: '#fff', fontSize: FontSize.body, fontWeight: '700' },
  registerWrap: { flexDirection: 'row', justifyContent: 'center' },
  registerText: { fontSize: FontSize.body },
  registerLink: { fontSize: FontSize.body, fontWeight: '600' },
});