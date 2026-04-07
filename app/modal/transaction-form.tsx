import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, ScrollView, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/components/ui/useTheme';
import { Colors, FontSize, Radius } from '../../src/constants/tokens';
import { withAlpha } from '../../src/components/shared/colors';

type TransactionType = 'income' | 'expense';

const CATEGORIES_EXPENSE = ['Alimentacion', 'Transporte', 'Entretenimiento', 'Salud', 'Educacion', 'Otro'];
const CATEGORIES_INCOME = ['Nomina', 'Freelance', 'Inversiones', 'Otro'];

export default function TransactionFormModal() {
  const theme = useTheme();
  const router = useRouter();

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = type === 'expense' ? CATEGORIES_EXPENSE : CATEGORIES_INCOME;

  function handleSave() {
    if (!amount || !name || !selectedCategory) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos.');
      return;
    }
    Alert.alert('Transaccion guardada', 'La transaccion fue registrada correctamente.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Nueva transaccion</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={[styles.saveBtn, { color: Colors.brand }]}>Guardar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.typeSelector, { backgroundColor: theme.surfaceSolid, borderColor: theme.border }]}>
          {(['expense', 'income'] as TransactionType[]).map((t) => (
            <TouchableOpacity
              key={t}
              style={[
                styles.typeBtn,
                type === t && { backgroundColor: t === 'expense' ? Colors.danger : Colors.brand },
              ]}
              onPress={() => { setType(t); setSelectedCategory(''); }}
            >
              <Text style={[
                styles.typeBtnLabel,
                { color: type === t ? '#fff' : theme.textSecondary },
              ]}>
                {t === 'expense' ? 'Gasto' : 'Ingreso'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, { color: theme.textSecondary }]}>Monto (COP)</Text>
        <View style={[styles.inputWrap, { backgroundColor: theme.surfaceSolid, borderColor: theme.border }]}>
          <Text style={[styles.currencySymbol, { color: theme.textSecondary }]}>$</Text>
          <TextInput
            style={[styles.input, { color: theme.textPrimary }]}
            placeholder="0"
            placeholderTextColor={theme.textSecondary}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        <Text style={[styles.label, { color: theme.textSecondary }]}>Descripcion</Text>
        <View style={[styles.inputWrap, { backgroundColor: theme.surfaceSolid, borderColor: theme.border }]}>
          <TextInput
            style={[styles.input, { color: theme.textPrimary }]}
            placeholder="Ej: Supermercado Exito"
            placeholderTextColor={theme.textSecondary}
            value={name}
            onChangeText={setName}
          />
        </View>

        <Text style={[styles.label, { color: theme.textSecondary }]}>Categoria</Text>
        <View style={styles.categoriesGrid}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                {
                  backgroundColor: selectedCategory === cat
                    ? withAlpha(Colors.brand, 0.15)
                    : theme.surfaceSolid,
                  borderColor: selectedCategory === cat ? Colors.brand : theme.border,
                },
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[
                styles.categoryLabel,
                { color: selectedCategory === cat ? Colors.brand : theme.textSecondary },
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
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
  typeSelector: { flexDirection: 'row', borderRadius: Radius.card, borderWidth: 0.5, padding: 4, marginBottom: 24 },
  typeBtn: { flex: 1, paddingVertical: 10, borderRadius: Radius.card - 2, alignItems: 'center' },
  typeBtnLabel: { fontSize: FontSize.body, fontWeight: '600' },
  label: { fontSize: FontSize.label, fontWeight: '500', marginBottom: 8, marginTop: 4 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', borderRadius: Radius.card, borderWidth: 0.5, paddingHorizontal: 14, marginBottom: 20, height: 50 },
  currencySymbol: { fontSize: FontSize.body, marginRight: 4 },
  input: { flex: 1, fontSize: FontSize.body },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 8, rowGap: 8 },
  categoryChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.chip, borderWidth: 0.5 },
  categoryLabel: { fontSize: FontSize.label, fontWeight: '500' },
});