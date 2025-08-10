import React from 'react';
import {
  StyleSheet,
  Text as RNText,
  TextProps as RNTextProps,
} from 'react-native';
import { ScaledStyleProps, applyScaledStyles } from './types';
import { useThemeColor } from '@/hooks/useThemeColor';

interface TextProps extends RNTextProps, ScaledStyleProps {
  variant?:
    | 'title-l'
    | 'title-m'
    | 'title-s'
    | 'body-m'
    | 'body-s'
    | 'button-l'
    | 'button-m'
    | 'button-s';
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
      case 'title-l':
        return styles.titleL;
      case 'title-m':
        return styles.titleM;
      case 'title-s':
        return styles.titleS;
      case 'body-m':
        return styles.bodyM;
      case 'body-s':
        return styles.bodyS;
      case 'button-l':
        return styles.buttonL;
      case 'button-m':
        return styles.buttonM;
      case 'button-s':
        return styles.buttonS;
      default:
        return styles.bodyM;
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
    fontFamily: 'Pretendard-Regular',
    // color는 동적으로 적용
  },
  // Title Variants
  titleL: {
    fontSize: 20,
    lineHeight: 28,
    fontFamily: 'Pretendard-ExtraBold',
    fontWeight: 'bold',
  },
  titleM: {
    fontSize: 18,
    lineHeight: 26,
    fontFamily: 'Pretendard-SemiBold',
  },
  titleS: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Pretendard-Medium',
  },
  // Body Variants
  bodyM: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Pretendard-Regular',
  },
  bodyS: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'Pretendard-Regular',
  },
  // Button Variants
  buttonL: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Pretendard-Medium',
  },
  buttonM: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Pretendard-Medium',
  },
  buttonS: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'Pretendard-Medium',
  },
  // Weights (기존 weight prop 사용 시)
  normal: {
    fontFamily: 'Pretendard-Regular',
  },
  medium: {
    fontFamily: 'Pretendard-Medium',
  },
  semibold: {
    fontFamily: 'Pretendard-SemiBold',
  },
  bold: {
    fontFamily: 'Pretendard-Bold',
  },
});

export default Text;
