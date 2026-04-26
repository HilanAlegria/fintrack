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
import type { Transfer } from '../../src/types';

const ACCOUNTS = ['Bancolombia', 'Nequi', 'Efectivo', 'Otro'];

export default function TransferFormModal() {
  const theme = useTheme();
  const router = useRouter();
  const addTransfer = useAppStore((s) => s.addTransfer);

  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!fromAccount || !toAccount || !amount.trim()) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos obligatorios.');
      return;
    }
    if (fromAccount === toAccount) {
      Alert.alert('Cuentas iguales', 'La cuenta origen y destino no pueden ser la misma.');
      return;
    }
    const parsed = parseFloat(amount.replace(/\./g, '').replace(',', '.'));
    if (isNaN(parsed) || parsed <= 0) {
      Alert.alert('Monto invalido', 'Ingresa un monto valido mayor a cero.');
      return;
    }

    setSaving(true);
    try {
      const transfer: Transfer = {
        id: Date.now().toString(),
        fromAccount,
        toAccount,
        amount: parsed,
        date: new Date().toISOString().split('T')[0],
        note: note.trim(),
      };
      await addTransfer(transfer);
      router.back();
    } catch {
      Alert.alert('Error', 'No se pudo guardar la transferencia.');
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
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Nueva transferencia</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving}>
          <Text style={[styles.saveBtn, { color: saving ? theme.textSecondary : Colors.brand }]}>
            {saving ? 'Guardando...' : 'Guardar'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>Cuenta origen</Text>
        <View style={styles.accountsGrid}>
          {ACCOUNTS.map((acc) => (
            <TouchableOpacity
              key={`from-${acc}`}
              style={[
                styles.accountChip,
                {
                  backgroundColor: fromAccount === acc ? withAlpha(Colors.brand, 0.15) : theme.surfaceSolid,
                  borderColor: fromAccount === acc ? Colors.brand : theme.border,
                },
              ]}
              onPress={() => setFromAccount(acc)}
            >
              <Text style={[styles.accountLabel, { color: fromAccount === acc ? Colors.brand : theme.textSecondary }]}>
                {acc}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.arrowWrap, { backgroundColor: withAlpha(Colors.brand, 0.13) }]}>
          <Ionicons name="arrow-down" size={20} color={Colors.brand} />
        </View>

        <Text style={[styles.label, { color: theme.textSecondary }]}>Cuenta destino</Text>
        <View style={styles.accountsGrid}>
          {ACCOUNTS.map((acc) => (
            <TouchableOpacity
              key={`to-${acc}`}
              style={[
                styles.accountChip,
                {
                  backgroundColor: toAccount === acc ? withAlpha(Colors.portfolio, 0.15) : theme.surfaceSolid,
                  borderColor: toAccount === acc ? Colors.portfolio : theme.border,
                },
              ]}
              onPress={() => setToAccount(acc)}
            >
              <Text style={[styles.accountLabel, { color: toAccount === acc ? Colors.portfolio : theme.textSecondary }]}>
                {acc}
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

        <Text style={[styles.label, { color: theme.textSecondary }]}>Nota (opcional)</Text>
        <View style={[styles.inputWrap, { backgroundColor: theme.surfaceSolid, borderColor: theme.border }]}>
          <TextInput
            style={[styles.input, { color: theme.textPrimary }]}
            placeholder="Ej: Pago de arriendo"
            placeholderTextColor={theme.textSecondary}
            value={note}
            onChangeText={setNote}
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
  accountsGrid: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 8, rowGap: 8, marginBottom: 16 },
  accountChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: Radius.chip, borderWidth: 0.5 },
  accountLabel: { fontSize: FontSize.label, fontWeight: '500' },
  arrowWrap: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 16 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', borderRadius: Radius.card, borderWidth: 0.5, paddingHorizontal: 14, marginBottom: 16, height: 52, columnGap: 10 },
  currencySymbol: { fontSize: FontSize.body },
  input: { flex: 1, fontSize: FontSize.body },
});