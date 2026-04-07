import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../components/ui/useTheme';
import { Card } from '../../components/ui/Card';
import { formatCOP } from '../../components/shared/formatters';
import { withAlpha } from '../../components/shared/colors';
import { mockMonthlyMetrics, mockReports } from '../../constants/mockData';
import { Colors, FontSize } from '../../constants/tokens';

const BAR_MAX_HEIGHT = 80;

export default function ReportsScreen() {
  const theme = useTheme();

  const maxIncome = Math.max(...mockMonthlyMetrics.map((m) => m.income));
  const currentMonth = mockMonthlyMetrics[mockMonthlyMetrics.length - 1];
  const balance = currentMonth.income - currentMonth.expenses;
  const savingsRate = Math.round((balance / currentMonth.income) * 100);

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
            { label: 'Ingresos', value: formatCOP(currentMonth.income), color: Colors.brand },
            { label: 'Egresos', value: formatCOP(currentMonth.expenses), color: Colors.danger },
            { label: 'Balance neto', value: formatCOP(balance), color: Colors.brand },
            { label: 'Tasa de ahorro', value: `${savingsRate}%`, color: Colors.warning },
          ].map((metric) => (
            <Card key={metric.label} style={styles.metricCard}>
              <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>{metric.label}</Text>
              <Text style={[styles.metricValue, { color: metric.color }]}>{metric.value}</Text>
            </Card>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Ingresos vs Egresos</Text>

        <Card style={styles.chartCard}>
          <View style={styles.chart}>
            {mockMonthlyMetrics.map((m) => (
              <View key={m.month} style={styles.barGroup}>
                <View style={styles.bars}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: (m.income / maxIncome) * BAR_MAX_HEIGHT,
                        backgroundColor: Colors.brand,
                        marginRight: 3,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.bar,
                      {
                        height: (m.expenses / maxIncome) * BAR_MAX_HEIGHT,
                        backgroundColor: Colors.danger,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.barLabel, { color: theme.textSecondary }]}>{m.month}</Text>
              </View>
            ))}
          </View>
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.brand }]} />
              <Text style={[styles.legendLabel, { color: theme.textSecondary }]}>Ingresos</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.danger }]} />
              <Text style={[styles.legendLabel, { color: theme.textSecondary }]}>Egresos</Text>
            </View>
          </View>
        </Card>

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
              <TouchableOpacity>
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
  chartCard: { marginBottom: 24 },
  chart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: BAR_MAX_HEIGHT + 20, marginBottom: 12 },
  barGroup: { alignItems: 'center', flex: 1 },
  bars: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 6 },
  bar: { width: 12, borderRadius: 4 },
  barLabel: { fontSize: 9, fontWeight: '500' },
  legend: { flexDirection: 'row', columnGap: 16, justifyContent: 'center' },
  legendItem: { flexDirection: 'row', alignItems: 'center', columnGap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { fontSize: FontSize.label },
  reportRow: { marginBottom: 8, padding: 12 },
  reportInner: { flexDirection: 'row', alignItems: 'center', columnGap: 12 },
  reportIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  reportInfo: { flex: 1 },
  reportTitle: { fontSize: FontSize.body, fontWeight: '500' },
  reportFormat: { fontSize: FontSize.label, marginTop: 2 },
});