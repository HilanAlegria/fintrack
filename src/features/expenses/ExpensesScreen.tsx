import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../components/ui/useTheme';
import { Card } from '../../components/ui/Card';
import { useAppStore } from '../../store/appStore';
import { formatCOP, getBudgetColor } from '../../components/shared/formatters';
import { withAlpha } from '../../components/shared/colors';
import { Colors, FontSize, Radius } from '../../constants/tokens';

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export default function ExpensesScreen() {
  const theme = useTheme();
  const categories = useAppStore((s) => s.budgetCategories);
  const currentMonthIndex = new Date().getMonth();
  const [selectedMonth, setSelectedMonth] = useState(currentMonthIndex);

  const totalSpent = categories.reduce((acc, c) => acc + c.spent, 0);
  const hasActivity = totalSpent > 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.screenTitle, { color: theme.textPrimary }]}>Gastos y presupuestos</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.monthScroll}>
          {MONTHS.map((m, i) => (
            <TouchableOpacity
              key={m}
              onPress={() => setSelectedMonth(i)}
              style={[
                styles.monthChip,
                {
                  backgroundColor: selectedMonth === i ? Colors.brand : theme.surfaceSolid,
                  borderColor: selectedMonth === i ? Colors.brand : theme.border,
                },
              ]}
            >
              <Text style={{ color: selectedMonth === i ? '#fff' : theme.textSecondary, fontSize: FontSize.label, fontWeight: '500' }}>
                {m}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Card style={styles.summaryCard}>
          <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
            Total gastado en {MONTHS[selectedMonth]}
          </Text>
          <Text style={[styles.summaryAmount, { color: theme.textPrimary }]}>
            {formatCOP(totalSpent)}
          </Text>
        </Card>

        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Presupuestos</Text>

        {categories.map((cat) => {
          const ratio = cat.spent / cat.limit;
          const barColor = getBudgetColor(cat.spent, cat.limit);
          return (
            <Card key={cat.id} style={styles.budgetCard}>
              <View style={styles.budgetHeader}>
                <View style={styles.budgetLeft}>
                  <Ionicons name={cat.icon as any} size={16} color={barColor} />
                  <Text style={[styles.budgetName, { color: theme.textPrimary }]}>{cat.name}</Text>
                </View>
                <Text style={[styles.budgetAmounts, { color: theme.textSecondary }]}>
                  {formatCOP(cat.spent)} / {formatCOP(cat.limit)}
                </Text>
              </View>
              <View style={[styles.barTrack, { backgroundColor: theme.border }]}>
                <View style={[styles.barFill, { flex: Math.min(ratio, 1), backgroundColor: barColor }]} />
                <View style={{ flex: Math.max(1 - ratio, 0) }} />
              </View>
              <Text style={[styles.budgetPercent, { color: barColor }]}>{Math.round(ratio * 100)}%</Text>
            </Card>
          );
        })}

        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Por categoria</Text>

        {!hasActivity ? (
          <View style={[styles.emptyWrap, { borderColor: theme.border }]}>
            <Ionicons name="pie-chart-outline" size={36} color={theme.textSecondary} />
            <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>Sin actividad</Text>
            <Text style={[styles.emptyDesc, { color: theme.textSecondary }]}>
              Registra un gasto para ver el desglose por categoria.
            </Text>
          </View>
        ) : (
          categories.filter((c) => c.spent > 0).map((cat) => (
            <Card key={`cat-${cat.id}`} style={styles.catRow}>
              <View style={styles.catInner}>
                <View style={[styles.catIcon, { backgroundColor: withAlpha(Colors.brand, 0.13) }]}>
                  <Ionicons name={cat.icon as any} size={18} color={Colors.brand} />
                </View>
                <View style={styles.catInfo}>
                  <Text style={[styles.catName, { color: theme.textPrimary }]}>{cat.name}</Text>
                  <Text style={[styles.catTxCount, { color: theme.textSecondary }]}>{cat.transactionCount} transacciones</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.catAmount, { color: Colors.danger }]}>{formatCOP(cat.spent)}</Text>
                  <Text style={[styles.catPercent, { color: theme.textSecondary }]}>
                    {Math.round((cat.spent / totalSpent) * 100)}%
                  </Text>
                </View>
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 40 },
  screenTitle: { fontSize: FontSize.title, fontWeight: '600', marginBottom: 16 },
  monthScroll: { marginBottom: 20 },
  monthChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.chip, borderWidth: 1, marginRight: 8 },
  summaryCard: { marginBottom: 24 },
  summaryLabel: { fontSize: FontSize.label, marginBottom: 4 },
  summaryAmount: { fontSize: 26, fontWeight: '700' },
  sectionTitle: { fontSize: FontSize.body, fontWeight: '600', marginBottom: 12 },
  budgetCard: { marginBottom: 10 },
  budgetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  budgetLeft: { flexDirection: 'row', alignItems: 'center', columnGap: 6 },
  budgetName: { fontSize: FontSize.body, fontWeight: '500' },
  budgetAmounts: { fontSize: FontSize.label },
  barTrack: { height: 6, borderRadius: 3, overflow: 'hidden', flexDirection: 'row' },
  barFill: { height: 6, borderRadius: 3 },
  budgetPercent: { fontSize: FontSize.label, fontWeight: '600', marginTop: 6, textAlign: 'right' },
  emptyWrap: { alignItems: 'center', paddingVertical: 40, borderRadius: Radius.card, borderWidth: 0.5, borderStyle: 'dashed', rowGap: 8 },
  emptyTitle: { fontSize: FontSize.body, fontWeight: '600' },
  emptyDesc: { fontSize: FontSize.label, textAlign: 'center', paddingHorizontal: 32, lineHeight: 18 },
  catRow: { marginBottom: 8, padding: 12 },
  catInner: { flexDirection: 'row', alignItems: 'center', columnGap: 12 },
  catIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  catInfo: { flex: 1 },
  catName: { fontSize: FontSize.body, fontWeight: '500' },
  catTxCount: { fontSize: FontSize.label, marginTop: 2 },
  catAmount: { fontSize: FontSize.body, fontWeight: '600' },
  catPercent: { fontSize: FontSize.label, marginTop: 2 },
});