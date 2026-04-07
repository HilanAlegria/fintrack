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
          <Chip label="+$1,240 este mes" color="#fff" style={{ marginTop: 4 }} />
          <View style={styles.heroMetrics}>
            <View>
              <Text style={styles.heroMetricLabel}>Rentabilidad YTD</Text>
              <Text style={styles.heroMetricValue}>+14.3%</Text>
            </View>
            <View style={styles.heroDivider} />
            <View>
              <Text style={styles.heroMetricLabel}>Nivel de riesgo</Text>
              <Text style={styles.heroMetricValue}>Moderado</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Posiciones activas</Text>

        {positions.map((position) => {
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
        })}
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
  heroMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  heroDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  heroMetricLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: FontSize.small,
    marginBottom: 4,
  },
  heroMetricValue: {
    color: '#fff',
    fontSize: FontSize.body,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: FontSize.title2,
    fontWeight: '600',
    marginBottom: 16,
  },
  positionCard: {
    marginBottom: 12,
  },
  positionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assetDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  positionInfo: {
    flex: 1,
  },
  positionName: {
    fontSize: FontSize.body,
    fontWeight: '600',
    marginBottom: 2,
  },
  positionDesc: {
    fontSize: FontSize.small,
  },
  positionPrice: {
    fontSize: FontSize.body,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.brand,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});