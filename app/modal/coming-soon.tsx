import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/components/ui/useTheme';
import { Colors, FontSize, Radius } from '../../src/constants/tokens';

export default function ComingSoonModal() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.card, { backgroundColor: theme.surfaceSolid, borderColor: theme.border }]}>
        <View style={[styles.iconWrap, { backgroundColor: `${Colors.brand}22` }]}>
          <Ionicons name="construct-outline" size={32} color={Colors.brand} />
        </View>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Proximamente</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Esta funcion estara disponible en una proxima version de FinTrack.
        </Text>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: Colors.brand }]}
          onPress={() => router.back()}
        >
          <Text style={styles.btnLabel}>Volver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: {
    width: '100%',
    borderRadius: Radius.heroCard,
    borderWidth: 0.5,
    padding: 32,
    alignItems: 'center',
  },
  iconWrap: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 10 },
  subtitle: { fontSize: FontSize.body, textAlign: 'center', lineHeight: 20, marginBottom: 28 },
  btn: { paddingHorizontal: 32, paddingVertical: 12, borderRadius: Radius.card },
  btnLabel: { color: '#fff', fontSize: FontSize.body, fontWeight: '600' },
});