import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from './useTheme';
import { Radius } from '../../constants/tokens';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  radius?: number;
}

export function Card({ children, style, radius = Radius.card }: CardProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: theme.surfaceSolid,
          borderRadius: radius,
          borderWidth: 0.5,
          borderColor: theme.border,
          padding: 16,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}