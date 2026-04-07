import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../components/ui/useTheme';
import { Card } from '../../components/ui/Card';
import { Chip } from '../../components/ui/Chip';
import { withAlpha } from '../../components/shared/colors';
import { mockLinkedAccounts } from '../../constants/mockData';
import { Colors, FontSize, Radius } from '../../constants/tokens';

const SETTINGS_ITEMS = [
  { id: 'notifications', label: 'Notificaciones', icon: 'notifications-outline', route: '/(tabs)/profile/notifications' },
  { id: 'security', label: 'Seguridad y privacidad', icon: 'shield-outline', route: '/(tabs)/profile/security' },
  { id: 'currency', label: 'Moneda base', icon: 'cash-outline', route: '/(tabs)/profile/currency' },
] as const;

export default function ProfileScreen() {
  const theme = useTheme();
  const router = useRouter();

  function handleLogout() {
    Alert.alert(
      'Cerrar sesion',
      'Estas seguro que deseas cerrar sesion?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar sesion', style: 'destructive', onPress: () => {} },
      ]
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.screenTitle, { color: theme.textPrimary }]}>Perfil</Text>
          <TouchableOpacity
            style={[styles.editBtn, { backgroundColor: withAlpha(Colors.brand, 0.13) }]}
            onPress={() => router.push('/modal/coming-soon')}
          >
            <Ionicons name="create-outline" size={18} color={Colors.brand} />
          </TouchableOpacity>
        </View>

        <Card style={styles.profileCard}>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AG</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: theme.textPrimary }]}>Alejandro Garcia</Text>
              <Text style={[styles.profileAccountType, { color: theme.textSecondary }]}>Cuenta personal</Text>
              <Chip label="Pro" color={Colors.warning} style={{ marginTop: 6 }} />
            </View>
          </View>
        </Card>

        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Cuentas vinculadas</Text>

        {mockLinkedAccounts.map((account) => (
          <Card key={account.id} style={styles.accountRow}>
            <View style={styles.accountInner}>
              <View style={[styles.bankIcon, { backgroundColor: withAlpha(Colors.portfolio, 0.13) }]}>
                <Ionicons name="business-outline" size={18} color={Colors.portfolio} />
              </View>
              <View style={styles.accountInfo}>
                <Text style={[styles.bankName, { color: theme.textPrimary }]}>{account.bankName}</Text>
                <Text style={[styles.accountNumber, { color: theme.textSecondary }]}>{account.accountNumber}</Text>
              </View>
              <Chip
                label={account.isActive ? 'Activo' : 'Inactivo'}
                color={account.isActive ? Colors.brand : Colors.danger}
              />
            </View>
          </Card>
        ))}

        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Configuracion</Text>

        <Card style={styles.settingsCard}>
          {SETTINGS_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.settingRow,
                index < SETTINGS_ITEMS.length - 1 && { borderBottomWidth: 0.5, borderBottomColor: theme.border },
              ]}
              onPress={() => router.push(item.route as any)}
            >
              <View style={[styles.settingIcon, { backgroundColor: withAlpha(Colors.brand, 0.13) }]}>
                <Ionicons name={item.icon} size={16} color={Colors.brand} />
              </View>
              <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
            </TouchableOpacity>
          ))}
        </Card>

        <TouchableOpacity
          style={[styles.logoutBtn, { borderColor: Colors.danger }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={18} color={Colors.danger} />
          <Text style={[styles.logoutLabel, { color: Colors.danger }]}>Cerrar sesion</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  screenTitle: { fontSize: FontSize.title, fontWeight: '600' },
  editBtn: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  profileCard: { marginBottom: 24 },
  profileRow: { flexDirection: 'row', alignItems: 'center', columnGap: 16 },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: Radius.avatar,
    backgroundColor: Colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: '700' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: FontSize.title, fontWeight: '600' },
  profileAccountType: { fontSize: FontSize.label, marginTop: 2 },
  sectionTitle: { fontSize: FontSize.body, fontWeight: '600', marginBottom: 12 },
  accountRow: { marginBottom: 8, padding: 12 },
  accountInner: { flexDirection: 'row', alignItems: 'center', columnGap: 12 },
  bankIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  accountInfo: { flex: 1 },
  bankName: { fontSize: FontSize.body, fontWeight: '500' },
  accountNumber: { fontSize: FontSize.label, marginTop: 2 },
  settingsCard: { padding: 0, marginBottom: 24, overflow: 'hidden' },
  settingRow: { flexDirection: 'row', alignItems: 'center', columnGap: 12, padding: 14 },
  settingIcon: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  settingLabel: { flex: 1, fontSize: FontSize.body },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 8,
    paddingVertical: 14,
    borderRadius: Radius.card,
    borderWidth: 1,
  },
  logoutLabel: { fontSize: FontSize.body, fontWeight: '600' },
});