import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../src/components/ui/useTheme';
import { Card } from '../../../src/components/ui/Card';
import { Colors, FontSize } from '../../../src/constants/tokens';
import { withAlpha } from '../../../src/components/shared/colors';

const CURRENCIES = [
  { code: 'COP', label: 'Peso colombiano', symbol: '$' },
  { code: 'USD', label: 'Dolar estadounidense', symbol: 'US$' },
  { code: 'EUR', label: 'Euro', symbol: '€' },
  { code: 'BTC', label: 'Bitcoin', symbol: '₿' },
];

export default function CurrencyScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [selected, setSelected] = useState('COP');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Moneda base</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={[styles.hint, { color: theme.textSecondary }]}>
          Todos los montos de la app se mostraran en la moneda seleccionada.
        </Text>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          {CURRENCIES.map((currency, index) => (
            <TouchableOpacity
              key={currency.code}
              style={[
                styles.row,
                index < CURRENCIES.length - 1 && { borderBottomWidth: 0.5, borderBottomColor: theme.border },
                selected === currency.code && { backgroundColor: withAlpha(Colors.brand, 0.06) },
              ]}
              onPress={() => setSelected(currency.code)}
            >
              <View style={[styles.symbolWrap, { backgroundColor: withAlpha(Colors.brand, 0.13) }]}>
                <Text style={[styles.symbol, { color: Colors.brand }]}>{currency.symbol}</Text>
              </View>
              <View style={styles.rowInfo}>
                <Text style={[styles.code, { color: theme.textPrimary }]}>{currency.code}</Text>
                <Text style={[styles.currencyLabel, { color: theme.textSecondary }]}>{currency.label}</Text>
              </View>
              {selected === currency.code && (
                <Ionicons name="checkmark-circle" size={20} color={Colors.brand} />
              )}
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
  hint: { fontSize: FontSize.label, marginBottom: 16, lineHeight: 18 },
  row: { flexDirection: 'row', alignItems: 'center', padding: 14, columnGap: 12 },
  symbolWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  symbol: { fontSize: FontSize.body, fontWeight: '700' },
  rowInfo: { flex: 1 },
  code: { fontSize: FontSize.body, fontWeight: '600' },
  currencyLabel: { fontSize: FontSize.label, marginTop: 2 },
});