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
import type { Goal } from '../../src/types';

export default function GoalFormModal() {
  const theme = useTheme();
  const router = useRouter();
  const addGoal = useAppStore((s) => s.addGoal);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [saving, setSaving] = useState(false);

  function formatDeadlineInput(text: string) {
    const clean = text.replace(/\D/g, '');
    if (clean.length <= 2) return clean;
    if (clean.length <= 4) return `${clean.slice(0, 2)}/${clean.slice(2)}`;
    return `${clean.slice(0, 2)}/${clean.slice(2, 4)}/${clean.slice(4, 8)}`;
  }

  async function handleSave() {
    if (!name.trim() || !targetAmount.trim() || !deadline.trim()) {
      Alert.alert('Campos incompletos', 'Nombre, monto objetivo y fecha son obligatorios.');
      return;
    }
    const parsed = parseFloat(targetAmount.replace(/\./g, '').replace(',', '.'));
    if (isNaN(parsed) || parsed <= 0) {
      Alert.alert('Monto invalido', 'Ingresa un monto valido mayor a cero.');
      return;
    }
    const parts = deadline.split('/');
    if (parts.length !== 3 || parts[2].length !== 4) {
      Alert.alert('Fecha invalida', 'Ingresa la fecha en formato DD/MM/AAAA.');
      return;
    }

    setSaving(true);
    try {
      const [day, month, year] = parts;
      const goal: Goal = {
        id: Date.now().toString(),
        name: name.trim(),
        description: description.trim(),
        targetAmount: parsed,
        savedAmount: 0,
        deadline: `${year}-${month}-${day}`,
        status: 'active',
      };
      await addGoal(goal);
      router.back();
    } catch {
      Alert.alert('Error', 'No se pudo guardar la meta.');
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
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Nueva meta</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving}>
          <Text style={[styles.saveBtn, { color: saving ? theme.textSecondary : Colors.brand }]}>
            {saving ? 'Guardando...' : 'Guardar'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>Nombre de la meta</Text>
        <View style={[styles.inputWrap, { backgroundColor: theme.surfaceSolid, borderColor: theme.border }]}>
          <TextInput
            style={[styles.input, { color: theme.textPrimary }]}
            placeholder="Ej: Boletas para concierto"
            placeholderTextColor={theme.textSecondary}
            value={name}
            onChangeText={setName}
          />
        </View>

        <Text style={[styles.label, { color: theme.textSecondary }]}>Descripcion (opcional)</Text>
        <View style={[styles.inputWrap, { backgroundColor: theme.surfaceSolid, borderColor: theme.border }]}>
          <TextInput
            style={[styles.input, { color: theme.textPrimary }]}
            placeholder="Describe tu meta"
            placeholderTextColor={theme.textSecondary}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <Text style={[styles.label, { color: theme.textSecondary }]}>Monto objetivo (COP)</Text>
        <View style={[styles.inputWrap, { backgroundColor: theme.surfaceSolid, borderColor: theme.border }]}>
          <Text style={[styles.currencySymbol, { color: theme.textSecondary }]}>$</Text>
          <TextInput
            style={[styles.input, { color: theme.textPrimary }]}
            placeholder="0"
            placeholderTextColor={theme.textSecondary}
            keyboardType="numeric"
            value={targetAmount}
            onChangeText={setTargetAmount}
          />
        </View>

        <Text style={[styles.label, { color: theme.textSecondary }]}>Fecha limite</Text>
        <View style={[styles.inputWrap, { backgroundColor: theme.surfaceSolid, borderColor: theme.border }]}>
          <Ionicons name="calendar-outline" size={18} color={theme.textSecondary} />
          <TextInput
            style={[styles.input, { color: theme.textPrimary }]}
            placeholder="DD/MM/AAAA"
            placeholderTextColor={theme.textSecondary}
            keyboardType="numeric"
            value={deadline}
            onChangeText={(t) => setDeadline(formatDeadlineInput(t))}
            maxLength={10}
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
  inputWrap: { flexDirection: 'row', alignItems: 'center', borderRadius: Radius.card, borderWidth: 0.5, paddingHorizontal: 14, marginBottom: 16, height: 52, columnGap: 10 },
  currencySymbol: { fontSize: FontSize.body },
  input: { flex: 1, fontSize: FontSize.body },
});