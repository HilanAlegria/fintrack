import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/components/ui/useTheme';
import { Card } from '../src/components/ui/Card';
import { useAppStore } from '../src/store/appStore';
import { formatCOP } from '../src/components/shared/formatters';
import { withAlpha } from '../src/components/shared/colors';
import { Colors, FontSize, Radius } from '../src/constants/tokens';
import type { Goal } from '../src/types';

export default function GoalsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const goals = useAppStore((s) => s.goals);
  const updateGoalSavings = useAppStore((s) => s.updateGoalSavings);
  const completeGoal = useAppStore((s) => s.completeGoal);

  const activeGoals = goals.filter((g) => g.status === 'active');
  const completedGoals = goals.filter((g) => g.status === 'completed');

  function handleAddSavings(goal: Goal) {
    Alert.prompt(
      'Agregar ahorro',
      `Cuanto quieres agregar a "${goal.name}"?`,
      async (value) => {
        if (!value) return;
        const parsed = parseFloat(value.replace(/\./g, '').replace(',', '.'));
        if (isNaN(parsed) || parsed <= 0) {
          Alert.alert('Monto invalido', 'Ingresa un monto valido.');
          return;
        }
        await updateGoalSavings(goal.id, parsed);
        if (goal.savedAmount + parsed >= goal.targetAmount) {
          Alert.alert('Meta alcanzada', `Felicitaciones! Alcanzaste tu meta "${goal.name}".`);
        }
      },
      'plain-text',
      '',
      'numeric'
    );
  }

  function handleComplete(goal: Goal) {
    Alert.alert(
      'Completar meta',
      `Marcar "${goal.name}" como completada? El dinero ahorrado se mantendra separado de tus gastos.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Completar', onPress: () => completeGoal(goal.id) },
      ]
    );
  }

  function formatDeadline(dateStr: string) {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  }

  function getProgressColor(saved: number, target: number) {
    const ratio = saved / target;
    if (ratio >= 1) return Colors.brand;
    if (ratio >= 0.7) return Colors.warning;
    return Colors.portfolio;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Metas de ahorro</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {goals.length === 0 ? (
          <View style={[styles.emptyWrap, { borderColor: theme.border }]}>
            <Ionicons name="flag-outline" size={40} color={theme.textSecondary} />
            <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>Sin metas aun</Text>
            <Text style={[styles.emptyDesc, { color: theme.textSecondary }]}>
              Crea una meta de ahorro para empezar a planificar tus finanzas.
            </Text>
          </View>
        ) : (
          <>
            {activeGoals.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Activas</Text>
                {activeGoals.map((goal) => {
                  const ratio = goal.savedAmount / goal.targetAmount;
                  const barColor = getProgressColor(goal.savedAmount, goal.targetAmount);
                  return (
                    <Card key={goal.id} style={styles.goalCard}>
                      <View style={styles.goalHeader}>
                        <View style={[styles.goalIcon, { backgroundColor: withAlpha(Colors.portfolio, 0.13) }]}>
                          <Ionicons name="flag-outline" size={18} color={Colors.portfolio} />
                        </View>
                        <View style={styles.goalInfo}>
                          <Text style={[styles.goalName, { color: theme.textPrimary }]}>{goal.name}</Text>
                          {goal.description ? (
                            <Text style={[styles.goalDesc, { color: theme.textSecondary }]}>{goal.description}</Text>
                          ) : null}
                        </View>
                        <Text style={[styles.goalDeadline, { color: theme.textSecondary }]}>
                          {formatDeadline(goal.deadline)}
                        </Text>
                      </View>

                      <View style={styles.goalAmounts}>
                        <Text style={[styles.goalSaved, { color: theme.textPrimary }]}>
                          {formatCOP(goal.savedAmount)}
                        </Text>
                        <Text style={[styles.goalTarget, { color: theme.textSecondary }]}>
                          de {formatCOP(goal.targetAmount)}
                        </Text>
                      </View>

                      <View style={[styles.barTrack, { backgroundColor: theme.border }]}>
                        <View style={[styles.barFill, { flex: Math.min(ratio, 1), backgroundColor: barColor }]} />
                        <View style={{ flex: Math.max(1 - ratio, 0) }} />
                      </View>

                      <Text style={[styles.goalPercent, { color: barColor }]}>
                        {Math.round(ratio * 100)}%
                      </Text>

                      <View style={styles.goalActions}>
                        <TouchableOpacity
                          style={[styles.actionBtn, { backgroundColor: withAlpha(Colors.portfolio, 0.13), borderColor: Colors.portfolio }]}
                          onPress={() => handleAddSavings(goal)}
                        >
                          <Ionicons name="add" size={16} color={Colors.portfolio} />
                          <Text style={[styles.actionBtnLabel, { color: Colors.portfolio }]}>Agregar ahorro</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.actionBtn, { backgroundColor: withAlpha(Colors.brand, 0.13), borderColor: Colors.brand }]}
                          onPress={() => handleComplete(goal)}
                        >
                          <Ionicons name="checkmark" size={16} color={Colors.brand} />
                          <Text style={[styles.actionBtnLabel, { color: Colors.brand }]}>Completar</Text>
                        </TouchableOpacity>
                      </View>
                    </Card>
                  );
                })}
              </>
            )}

            {completedGoals.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Completadas</Text>
                {completedGoals.map((goal) => (
                  <Card key={goal.id} style={{ ...styles.goalCard, opacity: 0.7 }}>
                    <View style={styles.goalHeader}>
                      <View style={[styles.goalIcon, { backgroundColor: withAlpha(Colors.brand, 0.13) }]}>
                        <Ionicons name="checkmark-circle-outline" size={18} color={Colors.brand} />
                      </View>
                      <View style={styles.goalInfo}>
                        <Text style={[styles.goalName, { color: theme.textPrimary }]}>{goal.name}</Text>
                        <Text style={[styles.goalDesc, { color: Colors.brand }]}>Meta alcanzada</Text>
                      </View>
                      <Text style={[styles.goalTarget, { color: theme.textSecondary }]}>
                        {formatCOP(goal.targetAmount)}
                      </Text>
                    </View>
                  </Card>
                ))}
              </>
            )}
          </>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/modal/goal-form')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  headerTitle: { fontSize: FontSize.title, fontWeight: '600' },
  content: { padding: 20, paddingBottom: 100 },
  emptyWrap: { alignItems: 'center', paddingVertical: 60, borderRadius: Radius.card, borderWidth: 0.5, borderStyle: 'dashed', rowGap: 10 },
  emptyTitle: { fontSize: FontSize.body, fontWeight: '600' },
  emptyDesc: { fontSize: FontSize.label, textAlign: 'center', paddingHorizontal: 32, lineHeight: 18 },
  sectionTitle: { fontSize: FontSize.body, fontWeight: '600', marginBottom: 12 },
  goalCard: { marginBottom: 12 },
  goalHeader: { flexDirection: 'row', alignItems: 'flex-start', columnGap: 12, marginBottom: 12 },
  goalIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  goalInfo: { flex: 1 },
  goalName: { fontSize: FontSize.body, fontWeight: '600' },
  goalDesc: { fontSize: FontSize.label, marginTop: 2 },
  goalDeadline: { fontSize: FontSize.label },
  goalAmounts: { flexDirection: 'row', alignItems: 'baseline', columnGap: 6, marginBottom: 8 },
  goalSaved: { fontSize: 18, fontWeight: '700' },
  goalTarget: { fontSize: FontSize.label },
  barTrack: { height: 6, borderRadius: 3, overflow: 'hidden', flexDirection: 'row', marginBottom: 4 },
  barFill: { height: 6, borderRadius: 3 },
  goalPercent: { fontSize: FontSize.label, fontWeight: '600', textAlign: 'right', marginBottom: 12 },
  goalActions: { flexDirection: 'row', columnGap: 10 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', columnGap: 6, paddingVertical: 8, borderRadius: Radius.chip, borderWidth: 0.5 },
  actionBtnLabel: { fontSize: FontSize.label, fontWeight: '500' },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
});