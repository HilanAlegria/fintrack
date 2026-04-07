import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import { Colors, FontSize, Radius } from '../../constants/tokens';
import { withAlpha } from '../shared/colors';

interface ChipProps {
  label: string;
  color?: string;
  style?: ViewStyle;
}

export function Chip({ label, color = Colors.brand, style }: ChipProps) {
  return (
    <View
      style={[
        {
          backgroundColor: withAlpha(color, 0.13),
          borderRadius: Radius.chip,
          paddingHorizontal: 8,
          paddingVertical: 3,
          alignSelf: 'flex-start',
        },
        style,
      ]}
    >
      <Text style={{ color, fontSize: FontSize.label, fontWeight: '600' }}>
        {label}
      </Text>
    </View>
  );
}