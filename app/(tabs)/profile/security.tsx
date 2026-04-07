import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../src/components/ui/useTheme';
import { Card } from '../../../src/components/ui/Card';
import { Colors, FontSize } from '../../../src/constants/tokens';
import { withAlpha } from '../../../src/components/shared/colors';

const SECURITY_ITEMS = [
  { id: 'pin', label: 'Cambiar PIN', icon: 'keypad-outline' },
  { id: 'biometric', label: 'Autenticacion biometrica', icon: 'finger-print-outline' },
  { id: 'sessions', label: 'Sesiones activas', icon: 'phone-portrait-outline' },
  { id: 'delete', label: 'Eliminar cuenta', icon: 'trash-outline', danger: true },
] as const;

export default function SecurityScreen() {
  const theme = useTheme();
  const router = useRouter();

  function handleItem(id: string) {
    if (id === 'delete') {
      Alert.alert(
        'Eliminar cuenta',
        'Esta accion es irreversible. Todos tus datos seran eliminados.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Eliminar', style: 'destructive', onPress: () => {} },
        ]
      );
      return;
    }
    Alert.alert('Proximamente', 'Esta funcion estara disponible en una proxima version.');
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Seguridad y privacidad</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          {SECURITY_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.row,
                index < SECURITY_ITEMS.length - 1 && { borderBottomWidth: 0.5, borderBottomColor: theme.border },
              ]}
              onPress={() => handleItem(item.id)}
            >
              <View style={[styles.iconWrap, { backgroundColor: withAlpha(item.danger ? Colors.danger : Colors.brand, 0.13) }]}>
                <Ionicons name={item.icon} size={16} color={item.danger ? Colors.danger : Colors.brand} />
              </View>
              <Text style={[styles.rowLabel, { color: item.danger ? Colors.danger : theme.textPrimary }]}>
                {item.label}
              </Text>
              <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
            </TouchableOpacity>
          ))}
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  headerTitle: { fontSize: FontSize.title, fontWeight: '600' },
  content: { padding: 20 },
  row: { flexDirection: 'row', alignItems: 'center', padding: 14, columnGap: 12 },
  iconWrap: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { flex: 1, fontSize: FontSize.body },
});