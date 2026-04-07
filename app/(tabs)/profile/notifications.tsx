import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../src/components/ui/useTheme';
import { Card } from '../../../src/components/ui/Card';
import { Colors, FontSize } from '../../../src/constants/tokens';

const NOTIFICATION_ITEMS = [
  { id: 'budget', label: 'Alertas de presupuesto', description: 'Cuando superas el 80% de una categoria' },
  { id: 'transactions', label: 'Nuevas transacciones', description: 'Cada vez que se registra un movimiento' },
  { id: 'goals', label: 'Metas de ahorro', description: 'Progreso hacia tus metas mensuales' },
  { id: 'reports', label: 'Reportes mensuales', description: 'Resumen al cierre de cada mes' },
];

export default function NotificationsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    budget: true,
    transactions: false,
    goals: true,
    reports: true,
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Notificaciones</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          {NOTIFICATION_ITEMS.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.row,
                index < NOTIFICATION_ITEMS.length - 1 && { borderBottomWidth: 0.5, borderBottomColor: theme.border },
              ]}
            >
              <View style={styles.rowInfo}>
                <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>{item.label}</Text>
                <Text style={[styles.rowDesc, { color: theme.textSecondary }]}>{item.description}</Text>
              </View>
              <Switch
                value={enabled[item.id]}
                onValueChange={(val) => setEnabled((prev) => ({ ...prev, [item.id]: val }))}
                trackColor={{ false: theme.border, true: Colors.brand }}
                thumbColor="#fff"
              />
            </View>
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
  row: { flexDirection: 'row', alignItems: 'center', padding: 16, columnGap: 12 },
  rowInfo: { flex: 1 },
  rowLabel: { fontSize: FontSize.body, fontWeight: '500' },
  rowDesc: { fontSize: FontSize.label, marginTop: 2 },
});