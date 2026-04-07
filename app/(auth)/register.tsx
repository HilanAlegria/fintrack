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

export default function RegisterScreen() {
  const theme = useTheme();
  const router = useRouter();
  const setAuth = useAppStore((s) => s.setAuth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
  if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
    Alert.alert('Campos incompletos', 'Por favor completa todos los campos.');
    return;
  }
  if (password !== confirmPassword) {
    Alert.alert('Contrasenas no coinciden', 'Verifica que ambas contrasenas sean iguales.');
    return;
  }
  if (password.length < 6) {
    Alert.alert('Contrasena muy corta', 'La contrasena debe tener al menos 6 caracteres.');
    return;
  }

  setLoading(true);
  try {
    await new Promise((r) => setTimeout(r, 800));
    const fakeToken = `token_${Date.now()}`;
    const user = { name, email, plan: 'Pro' };
    await SecureStore.setItemAsync('fintrack_token', fakeToken);
    await SecureStore.setItemAsync('fintrack_user', JSON.stringify(user));
    setAuth(true, user);
    router.replace('/(tabs)');
  } catch (e) {
    console.error('Register error:', e);
    Alert.alert('Error', String(e));
  } finally {
    setLoading(false);
  }
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
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
          </TouchableOpacity>

          <View style={styles.logoWrap}>
            <View style={[styles.logoIcon, { backgroundColor: Colors.brand }]}>
              <Ionicons name="wallet-outline" size={36} color="#fff" />
            </View>
            <Text style={[styles.logoTitle, { color: theme.textPrimary }]}>Crear cuenta</Text>
            <Text style={[styles.logoSubtitle, { color: theme.textSecondary }]}>
              Empieza a gestionar tus finanzas hoy
            </Text>
          </View>

          <Text style={[styles.label, { color: theme.textSecondary }]}>Nombre completo</Text>
          <View style={[styles.inputWrap, { backgroundColor: theme.surfaceSolid, borderColor: theme.border }]}>
            <Ionicons name="person-outline" size={18} color={theme.textSecondary} />
            <TextInput
              style={[styles.input, { color: theme.textPrimary }]}
              placeholder="Tu nombre"
              placeholderTextColor={theme.textSecondary}
              autoCapitalize="words"
              value={name}
              onChangeText={setName}
            />
          </View>

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
              placeholder="Minimo 6 caracteres"
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

          <Text style={[styles.label, { color: theme.textSecondary }]}>Confirmar contrasena</Text>
          <View style={[styles.inputWrap, { backgroundColor: theme.surfaceSolid, borderColor: theme.border }]}>
            <Ionicons name="lock-closed-outline" size={18} color={theme.textSecondary} />
            <TextInput
              style={[styles.input, { color: theme.textPrimary }]}
              placeholder="Repite tu contrasena"
              placeholderTextColor={theme.textSecondary}
              secureTextEntry={!showConfirm}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
              <Ionicons
                name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color={theme.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: loading ? withAlpha(Colors.brand, 0.6) : Colors.brand }]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.btnLabel}>{loading ? 'Creando cuenta...' : 'Crear cuenta'}</Text>
          </TouchableOpacity>

          <View style={styles.loginWrap}>
            <Text style={[styles.loginText, { color: theme.textSecondary }]}>Ya tienes cuenta? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={[styles.loginLink, { color: Colors.brand }]}>Inicia sesion</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24, paddingTop: 20, paddingBottom: 40 },
  backBtn: { marginBottom: 8 },
  logoWrap: { alignItems: 'center', marginBottom: 32, marginTop: 8 },
  logoIcon: { width: 72, height: 72, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  logoTitle: { fontSize: 24, fontWeight: '700', marginBottom: 6 },
  logoSubtitle: { fontSize: FontSize.body, textAlign: 'center' },
  label: { fontSize: FontSize.label, fontWeight: '500', marginBottom: 8 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', borderRadius: Radius.card, borderWidth: 0.5, paddingHorizontal: 14, marginBottom: 16, height: 52, columnGap: 10 },
  input: { flex: 1, fontSize: FontSize.body },
  btn: { height: 52, borderRadius: Radius.card, alignItems: 'center', justifyContent: 'center', marginBottom: 24, marginTop: 8 },
  btnLabel: { color: '#fff', fontSize: FontSize.body, fontWeight: '700' },
  loginWrap: { flexDirection: 'row', justifyContent: 'center' },
  loginText: { fontSize: FontSize.body },
  loginLink: { fontSize: FontSize.body, fontWeight: '600' },
});