import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../components/ui/useTheme';
import { Card } from '../../components/ui/Card';
import { formatCOP } from '../../components/shared/formatters';
import { withAlpha } from '../../components/shared/colors';
import { useAppStore } from '../../store/appStore';
import { mockReports } from '../../constants/mockData';
import { Colors, FontSize } from '../../constants/tokens';

const BAR_MAX_HEIGHT = 80;

export default function ReportsScreen() {
  const theme = useTheme();
  const transactions = useAppStore((s) => s.transactions);

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0;
  const hasData = transactions.length > 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.screenTitle, { color: theme.textPrimary }]}>Contabilidad</Text>
          <TouchableOpacity style={[styles.downloadBtn, { backgroundColor: withAlpha(Colors.brand, 0.13) }]}>
            <Ionicons name="download-outline" size={18} color={Colors.brand} />
          </TouchableOpacity>
        </View>

        <View style={styles.metricsGrid}>
          {[
            { label: 'Ingresos', value: formatCOP(totalIncome), color: Colors.brand },
            { label: 'Egresos', value: formatCOP(totalExpenses), color: Colors.danger },
            { label: 'Balance neto', value: formatCOP(balance), color: balance >= 0 ? Colors.brand : Colors.danger },
            { label: 'Tasa de ahorro', value: `${savingsRate}%`, color: Colors.warning },
          ].map((metric) => (
            <Card key={metric.label} style={styles.metricCard}>
              <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>{metric.label}</Text>
              <Text style={[styles.metricValue, { color: metric.color }]}>{metric.value}</Text>
            </Card>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Resumen</Text>

        {!hasData ? (
          <View style={[styles.emptyWrap, { borderColor: theme.border }]}>
            <Ionicons name="bar-chart-outline" size={36} color={theme.textSecondary} />
            <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>Sin datos aun</Text>
            <Text style={[styles.emptyDesc, { color: theme.textSecondary }]}>
              Registra transacciones para ver tu resumen financiero aqui.
            </Text>
          </View>
        ) : (
          <Card style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View style={[styles.summaryDot, { backgroundColor: Colors.brand }]} />
              <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Ingresos totales</Text>
              <Text style={[styles.summaryValue, { color: Colors.brand }]}>{formatCOP(totalIncome)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <View style={[styles.summaryDot, { backgroundColor: Colors.danger }]} />
              <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Egresos totales</Text>
              <Text style={[styles.summaryValue, { color: Colors.danger }]}>{formatCOP(totalExpenses)}</Text>
            </View>
            <View style={[styles.summaryDivider, { backgroundColor: theme.border }]} />
            <View style={styles.summaryRow}>
              <View style={[styles.summaryDot, { backgroundColor: Colors.warning }]} />
              <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Balance</Text>
              <Text style={[styles.summaryValue, { color: balance >= 0 ? Colors.brand : Colors.danger }]}>
                {formatCOP(balance)}
              </Text>
            </View>
          </Card>
        )}

        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Reportes</Text>

        {mockReports.map((report) => (
          <Card key={report.id} style={styles.reportRow}>
            <View style={styles.reportInner}>
              <View style={[styles.reportIcon, { backgroundColor: withAlpha(Colors.portfolio, 0.13) }]}>
                <Ionicons
                  name={report.format === 'PDF' ? 'document-text-outline' : 'grid-outline'}
                  size={18}
                  color={Colors.portfolio}
                />
              </View>
              <View style={styles.reportInfo}>
                <Text style={[styles.reportTitle, { color: theme.textPrimary }]}>{report.title}</Text>
                <Text style={[styles.reportFormat, { color: theme.textSecondary }]}>{report.format}</Text>
              </View>
              <TouchableOpacity onPress={() => Alert.alert('Proximamente', 'La exportacion de reportes estara disponible cuando se conecte el backend.')}>
                <Ionicons name="download-outline" size={20} color={Colors.brand} />
              </TouchableOpacity>
            </View>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  screenTitle: { fontSize: FontSize.title, fontWeight: '600' },
  downloadBtn: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 10, rowGap: 10, marginBottom: 24 },
  metricCard: { flex: 1, minWidth: 0, padding: 14 },
  metricLabel: { fontSize: FontSize.label, marginBottom: 6 },
  metricValue: { fontSize: 16, fontWeight: '700' },
  sectionTitle: { fontSize: FontSize.body, fontWeight: '600', marginBottom: 12 },
  emptyWrap: { alignItems: 'center', paddingVertical: 40, borderRadius: 14, borderWidth: 0.5, borderStyle: 'dashed', rowGap: 8, marginBottom: 24 },
  emptyTitle: { fontSize: FontSize.body, fontWeight: '600' },
  emptyDesc: { fontSize: FontSize.label, textAlign: 'center', paddingHorizontal: 32, lineHeight: 18 },
  summaryCard: { marginBottom: 24 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', columnGap: 10, paddingVertical: 6 },
  summaryDot: { width: 8, height: 8, borderRadius: 4 },
  summaryLabel: { flex: 1, fontSize: FontSize.body },
  summaryValue: { fontSize: FontSize.body, fontWeight: '600' },
  summaryDivider: { height: 0.5, marginVertical: 8 },
  reportRow: { marginBottom: 8, padding: 12 },
  reportInner: { flexDirection: 'row', alignItems: 'center', columnGap: 12 },
  reportIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  reportInfo: { flex: 1 },
  reportTitle: { fontSize: FontSize.body, fontWeight: '500' },
  reportFormat: { fontSize: FontSize.label, marginTop: 2 },
});