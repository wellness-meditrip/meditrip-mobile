import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface GapProps {
  size: number;
  horizontal?: boolean;
  style?: ViewStyle;
}

const Gap: React.FC<GapProps> = ({ size, horizontal = false, style }) => {
  const gapStyle = horizontal ? { width: size } : { height: size };

  return <View style={[styles.gap, gapStyle, style]} />;
};

export default Gap;

const styles = StyleSheet.create({
  gap: {
    // 기본 스타일은 비어있음
  },
});
