import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../components/ui/useTheme';
import { Card } from '../../components/ui/Card';
import { Chip } from '../../components/ui/Chip';
import { useAppStore } from '../../store/appStore';
import { getAssetColor } from '../../components/shared/formatters';
import { Colors, FontSize, Radius } from '../../constants/tokens';

export default function PortfolioScreen() {
  const theme = useTheme();
  const router = useRouter();
  const positions = useAppStore((s) => s.portfolioPositions);

  const totalValue = positions.reduce((acc, p) => acc + p.currentPrice, 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.screenTitle, { color: theme.textPrimary }]}>Portafolio</Text>

        <View style={[styles.heroCard, { borderRadius: Radius.heroCard }]}>
          <Text style={styles.heroLabel}>Valor del portafolio</Text>
          <Text style={styles.heroAmount}>
            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Text>
          <View style={styles.heroMetrics}>
            <View>
              <Text style={styles.heroMetricLabel}>Rentabilidad YTD</Text>
              <Text style={styles.heroMetricValue}>0.00%</Text>
            </View>
            <View style={styles.heroDivider} />
            <View>
              <Text style={styles.heroMetricLabel}>Nivel de riesgo</Text>
              <Text style={styles.heroMetricValue}>-</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Posiciones activas</Text>

        {positions.length === 0 ? (
          <View style={[styles.emptyWrap, { borderColor: theme.border }]}>
            <Ionicons name="trending-up-outline" size={36} color={theme.textSecondary} />
            <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>Sin posiciones</Text>
            <Text style={[styles.emptyDesc, { color: theme.textSecondary }]}>
              Toca el boton + para agregar tu primera posicion de inversion.
            </Text>
          </View>
        ) : (
          positions.map((position) => {
            const assetColor = getAssetColor(position.type);
            const isPositive = position.returnPercent >= 0;
            return (
              <TouchableOpacity key={position.id}>
                <Card style={styles.positionCard}>
                  <View style={styles.positionRow}>
                    <View style={[styles.assetDot, { backgroundColor: assetColor }]} />
                    <View style={styles.positionInfo}>
                      <Text style={[styles.positionName, { color: theme.textPrimary }]}>{position.name}</Text>
                      <Text style={[styles.positionDesc, { color: theme.textSecondary }]}>{position.description}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', rowGap: 4 }}>
                      <Text style={[styles.positionPrice, { color: theme.textPrimary }]}>
                        ${position.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </Text>
                      <Chip
                        label={`${isPositive ? '+' : ''}${position.returnPercent}%`}
                        color={isPositive ? Colors.brand : Colors.danger}
                      />
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/modal/coming-soon')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 100 },
  screenTitle: { fontSize: FontSize.title, fontWeight: '600', marginBottom: 16 },
  heroCard: { backgroundColor: Colors.portfolio, padding: 24, marginBottom: 24 },
  heroLabel: { color: 'rgba(255,255,255,0.7)', fontSize: FontSize.label, marginBottom: 6 },
  heroAmount: { color: '#fff', fontSize: 30, fontWeight: '700', marginBottom: 8 },
  heroMetrics: { flexDirection: 'row', alignItems: 'center', columnGap: 20, marginTop: 20 },
  heroMetricLabel: { color: 'rgba(255,255,255,0.7)', fontSize: FontSize.label, marginBottom: 4 },
  heroMetricValue: { color: '#fff', fontSize: FontSize.body, fontWeight: '600' },
  heroDivider: { width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.2)' },
  sectionTitle: { fontSize: FontSize.body, fontWeight: '600', marginBottom: 12 },
  emptyWrap: { alignItems: 'center', paddingVertical: 40, borderRadius: Radius.card, borderWidth: 0.5, borderStyle: 'dashed', rowGap: 8 },
  emptyTitle: { fontSize: FontSize.body, fontWeight: '600' },
  emptyDesc: { fontSize: FontSize.label, textAlign: 'center', paddingHorizontal: 32, lineHeight: 18 },
  positionCard: { marginBottom: 8 },
  positionRow: { flexDirection: 'row', alignItems: 'center', columnGap: 12 },
  assetDot: { width: 10, height: 10, borderRadius: 5 },
  positionInfo: { flex: 1 },
  positionName: { fontSize: FontSize.body, fontWeight: '600' },
  positionDesc: { fontSize: FontSize.label, marginTop: 2 },
  positionPrice: { fontSize: FontSize.body, fontWeight: '600' },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.portfolio,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
});