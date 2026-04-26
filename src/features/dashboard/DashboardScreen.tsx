import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../components/ui/useTheme';
import { Card } from '../../components/ui/Card';
import { useAppStore } from '../../store/appStore';
import { formatCOP } from '../../components/shared/formatters';
import { withAlpha } from '../../components/shared/colors';
import { Colors, FontSize, Radius } from '../../constants/tokens';

const QUICK_ACTIONS = [
  { label: 'Transferir', icon: 'arrow-forward-circle-outline', route: '/modal/transfer-form' },
  { label: 'Analizar', icon: 'bar-chart-outline', route: '/(tabs)/reports' },
  { label: 'Metas', icon: 'flag-outline', route: '/goals' },
  { label: 'Registrar', icon: 'add-circle-outline', route: '/modal/transaction-form' },
] as const;

export default function DashboardScreen() {
  const theme = useTheme();
  const router = useRouter();
  const transactions = useAppStore((s) => s.transactions);

  const user = useAppStore((s) => s.user);

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const netWorth = totalIncome - totalExpenses;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.textSecondary }]}>Buenos dias</Text>
            <Text style={[styles.userName, { color: theme.textPrimary }]}>{user?.name ?? 'Bienvenido'}</Text>
          </View>
          <TouchableOpacity
            style={[styles.notifBtn, { backgroundColor: theme.surfaceSolid, borderColor: theme.border }]}
          >
            <Ionicons name="notifications-outline" size={20} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={[styles.heroCard, { borderRadius: Radius.heroCard }]}>
          <Text style={styles.heroLabel}>Patrimonio neto</Text>
          <Text style={styles.heroAmount}>{formatCOP(netWorth)}</Text>
          <View style={styles.heroMetrics}>
            <View>
              <Text style={styles.heroMetricLabel}>Ingresos del mes</Text>
              <Text style={[styles.heroMetricValue, { color: '#a8f0d8' }]}>{formatCOP(totalIncome)}</Text>
            </View>
            <View style={styles.heroDivider} />
            <View>
              <Text style={styles.heroMetricLabel}>Gastos del mes</Text>
              <Text style={[styles.heroMetricValue, { color: '#fca5a5' }]}>{formatCOP(totalExpenses)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsGrid}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={[styles.actionBtn, { backgroundColor: theme.surfaceSolid, borderColor: theme.border }]}
              onPress={() => router.push(action.route as any)}
            >
              <Ionicons name={action.icon as any} size={22} color={Colors.brand} />
              <Text style={[styles.actionLabel, { color: theme.textPrimary }]}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Ultimas transacciones</Text>

        {transactions.length === 0 ? (
          <View style={[styles.emptyWrap, { borderColor: theme.border }]}>
            <Ionicons name="receipt-outline" size={36} color={theme.textSecondary} />
            <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>Sin transacciones</Text>
            <Text style={[styles.emptyDesc, { color: theme.textSecondary }]}>
              Toca Registrar o el boton + para agregar tu primera transaccion.
            </Text>
          </View>
        ) : (
          transactions.slice(0, 4).map((tx) => (
            <Card key={tx.id} style={styles.txCard}>
              <View style={styles.txRow}>
                <View style={[styles.txIconWrap, { backgroundColor: withAlpha(Colors.brand, 0.13) }]}>
                  <Ionicons name={tx.icon as any} size={16} color={Colors.brand} />
                </View>
                <View style={styles.txInfo}>
                  <Text style={[styles.txName, { color: theme.textPrimary }]}>{tx.name}</Text>
                  <Text style={[styles.txCategory, { color: theme.textSecondary }]}>{tx.category}</Text>
                </View>
                <Text style={[styles.txAmount, { color: tx.type === 'income' ? Colors.brand : Colors.danger }]}>
                  {tx.type === 'income' ? '+' : '-'}{formatCOP(tx.amount)}
                </Text>
              </View>
            </Card>
          ))
        )}
      </ScrollView>

      <Pressable
        style={styles.fab}
        onPress={() => router.push('/modal/transaction-form')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 20, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greeting: { fontSize: FontSize.label },
  userName: { fontSize: FontSize.title, fontWeight: '600', marginTop: 2 },
  notifBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 0.5 },
  heroCard: { backgroundColor: Colors.brand, padding: 24, marginBottom: 20 },
  heroLabel: { color: 'rgba(255,255,255,0.7)', fontSize: FontSize.label, marginBottom: 6 },
  heroAmount: { color: '#fff', fontSize: 32, fontWeight: '700', marginBottom: 20 },
  heroMetrics: { flexDirection: 'row', alignItems: 'center', columnGap: 20 },
  heroMetricLabel: { color: 'rgba(255,255,255,0.7)', fontSize: FontSize.label, marginBottom: 4 },
  heroMetricValue: { fontSize: FontSize.body, fontWeight: '600' },
  heroDivider: { width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.2)' },
  actionsGrid: { flexDirection: 'row', columnGap: 10, marginBottom: 28 },
  actionBtn: { flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: Radius.actionIcon, borderWidth: 0.5, rowGap: 6 },
  actionLabel: { fontSize: 10, fontWeight: '500' },
  sectionTitle: { fontSize: FontSize.body, fontWeight: '600', marginBottom: 12 },
  emptyWrap: { alignItems: 'center', paddingVertical: 40, borderRadius: Radius.card, borderWidth: 0.5, borderStyle: 'dashed', rowGap: 8 },
  emptyTitle: { fontSize: FontSize.body, fontWeight: '600' },
  emptyDesc: { fontSize: FontSize.label, textAlign: 'center', paddingHorizontal: 32, lineHeight: 18 },
  txCard: { marginBottom: 8, padding: 12 },
  txRow: { flexDirection: 'row', alignItems: 'center', columnGap: 12 },
  txIconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  txInfo: { flex: 1 },
  txName: { fontSize: FontSize.body, fontWeight: '500' },
  txCategory: { fontSize: FontSize.label, marginTop: 2 },
  txAmount: { fontSize: FontSize.body, fontWeight: '600' },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
});