import React from 'react';
import {
  StyleSheet,
  Text as RNText,
  TextProps as RNTextProps,
} from 'react-native';
import { ScaledStyleProps, applyScaledStyles } from './types';
import { useThemeColor } from '@/hooks/useThemeColor';

interface TextProps extends RNTextProps, ScaledStyleProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
  color?: string;
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
  children?: React.ReactNode;
}

const Text: React.FC<TextProps> = ({
  variant = 'body',
  color,
  weight = 'normal',
  align = 'left',
  style,
  children,
  ...props
}) => {
  // 다크모드 기본 색상 적용
  const defaultColor = useThemeColor({}, 'text');
  const textColor = color || defaultColor;

  const getVariantStyle = () => {
    switch (variant) {
      case 'h1':
        return styles.h1;
      case 'h2':
        return styles.h2;
      case 'h3':
        return styles.h3;
      case 'caption':
        return styles.caption;
      case 'label':
        return styles.label;
      default:
        return styles.body;
    }
  };

  const getWeightStyle = () => {
    switch (weight) {
      case 'medium':
        return styles.medium;
      case 'semibold':
        return styles.semibold;
      case 'bold':
        return styles.bold;
      default:
        return styles.normal;
    }
  };

  // scale 적용된 스타일
  const scaledStyle = applyScaledStyles(props);

  const textStyle = [
    styles.base,
    getVariantStyle(),
    getWeightStyle(),
    { textAlign: align, color: textColor },
    scaledStyle,
    style,
  ];

  return (
    <RNText style={textStyle} {...props}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  base: {
    // color는 동적으로 적용
  },
  // Variants
  h1: {
    fontSize: 32,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
  },
  // Weights
  normal: {
    fontWeight: '400',
  },
  medium: {
    fontWeight: '500',
  },
  semibold: {
    fontWeight: '600',
  },
  bold: {
    fontWeight: '700',
  },
});

export default Text;
