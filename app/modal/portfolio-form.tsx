import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, ScrollView, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/components/ui/useTheme';
import { useAppStore } from '../../src/store/appStore';
import { Colors, FontSize, Radius } from '../../src/constants/tokens';
import { withAlpha } from '../../src/components/shared/colors';
import type { AssetType, PortfolioPosition } from '../../src/types';

const ASSET_TYPES: { label: string; value: AssetType; icon: string }[] = [
  { label: 'ETF', value: 'etf', icon: 'bar-chart-outline' },
  { label: 'Cripto', value: 'crypto', icon: 'logo-bitcoin' },
  { label: 'Accion', value: 'stock', icon: 'trending-up-outline' },
  { label: 'Fondo', value: 'fund', icon: 'wallet-outline' },
];

export default function PortfolioFormModal() {
  const theme = useTheme();
  const router = useRouter();
  const addPortfolioPosition = useAppStore((s) => s.addPortfolioPosition);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [selectedType, setSelectedType] = useState<AssetType | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!name.trim() || !description.trim() || !price.trim() || !selectedType) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos.');
      return;
    }

    const parsed = parseFloat(price.replace(/,/g, '.'));
    if (isNaN(parsed) || parsed <= 0) {
      Alert.alert('Precio invalido', 'Ingresa un precio valido mayor a cero.');
      return;
    }

    setSaving(true);
    try {
      const position: PortfolioPosition = {
        id: Date.now().toString(),
        name: name.trim(),
        description: description.trim(),
        currentPrice: parsed,
        returnPercent: 0,
        type: selectedType,
      };
      await addPortfolioPosition(position);
      router.back();
    } catch (e) {
      Alert.alert('Error', 'No se pudo guardar la posicion.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Nueva posicion</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving}>
          <Text style={[styles.saveBtn, { color: saving ? theme.textSecondary : Colors.brand }]}>
            {saving ? 'Guardando...' : 'Guardar'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <Text style={[styles.label, { color: theme.textSecondary }]}>Tipo de activo</Text>
        <View style={styles.typeGrid}>
          {ASSET_TYPES.map((asset) => (
            <TouchableOpacity
              key={asset.value}
              style={[
                styles.typeBtn,
                {
                  backgroundColor: selectedType === asset.value
                    ? withAlpha(Colors.brand, 0.15)
                    : theme.surfaceSolid,
                  borderColor: selectedType === asset.value ? Colors.brand : theme.border,
                },
              ]}
              onPress={() => setSelectedType(asset.value)}
            >
              <Ionicons
                name={asset.icon as any}
                size={20}
                color={selectedType === asset.value ? Colors.brand : theme.textSecondary}
              />
              <Text style={[
                styles.typeBtnLabel,
                { color: selectedType === asset.value ? Colors.brand : theme.textSecondary },
              ]}>
                {asset.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, { color: theme.textSecondary }]}>Nombre</Text>
        <View style={[styles.inputWrap, { backgroundColor: theme.surfaceSolid, borderColor: theme.border }]}>
          <TextInput
            style={[styles.input, { color: theme.textPrimary }]}
            placeholder="Ej: Bitcoin, Tesla, S&P 500"
            placeholderTextColor={theme.textSecondary}
            value={name}
            onChangeText={setName}
          />
        </View>

        <Text style={[styles.label, { color: theme.textSecondary }]}>Descripcion</Text>
        <View style={[styles.inputWrap, { backgroundColor: theme.surfaceSolid, borderColor: theme.border }]}>
          <TextInput
            style={[styles.input, { color: theme.textPrimary }]}
            placeholder="Ej: 0.5 BTC, 10 acciones"
            placeholderTextColor={theme.textSecondary}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <Text style={[styles.label, { color: theme.textSecondary }]}>Precio actual (USD)</Text>
        <View style={[styles.inputWrap, { backgroundColor: theme.surfaceSolid, borderColor: theme.border }]}>
          <Text style={[styles.currencySymbol, { color: theme.textSecondary }]}>$</Text>
          <TextInput
            style={[styles.input, { color: theme.textPrimary }]}
            placeholder="0.00"
            placeholderTextColor={theme.textSecondary}
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingBottom: 12 },
  headerTitle: { fontSize: FontSize.title, fontWeight: '600' },
  saveBtn: { fontSize: FontSize.body, fontWeight: '600' },
  content: { padding: 20, paddingBottom: 40 },
  label: { fontSize: FontSize.label, fontWeight: '500', marginBottom: 8, marginTop: 4 },
  typeGrid: { flexDirection: 'row', columnGap: 10, marginBottom: 20 },
  typeBtn: { flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: Radius.card, borderWidth: 0.5, rowGap: 6 },
  typeBtnLabel: { fontSize: FontSize.label, fontWeight: '500' },
  inputWrap: { flexDirection: 'row', alignItems: 'center', borderRadius: Radius.card, borderWidth: 0.5, paddingHorizontal: 14, marginBottom: 16, height: 52, columnGap: 10 },
  currencySymbol: { fontSize: FontSize.body },
  input: { flex: 1, fontSize: FontSize.body },
});