import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import Text from './text';
import { useThemeColor } from '@/hooks/useThemeColor';

interface ButtonProps extends TouchableOpacityProps {
  backgroundColor?: 'primary' | 'secondary' | 'outline' | 'ghost';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  disabled?: boolean;
  children?: React.ReactNode;
  style?: ViewStyle;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'ghost',
  disabled = false,
  children,
  style,
  ...props
}) => {
  // 다크모드 색상 적용 - Hook은 최상위 레벨에서만 호출
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const secondaryBgColor = useThemeColor(
    { light: '#F2F2F7', dark: '#2C2C2E' },
    'background'
  );
  const disabledBgColor = useThemeColor(
    { light: '#F2F2F7', dark: '#2C2C2E' },
    'background'
  );
  const disabledBorderColor = useThemeColor(
    { light: '#E0E0E0', dark: '#3A3A3C' },
    'text'
  );
  const disabledTextColor = useThemeColor(
    { light: '#999999', dark: '#6D6D70' },
    'text'
  );

  const getBackgroundColor = (): string => {
    if (disabled) return disabledBgColor;

    switch (variant) {
      case 'primary':
        return tintColor;
      case 'secondary':
        return secondaryBgColor;
      case 'outline':
        return 'transparent';
      case 'ghost':
        return 'transparent';
      default:
        return tintColor;
    }
  };

  const getBorderColor = (): string => {
    if (disabled) return disabledBorderColor;

    switch (variant) {
      case 'outline':
        return tintColor;
      default:
        return 'transparent';
    }
  };

  const getTextColor = (): string => {
    if (disabled) return disabledTextColor;

    switch (variant) {
      case 'primary':
        return '#FFFFFF';
      case 'secondary':
        return textColor;
      case 'outline':
        return tintColor;
      case 'ghost':
        return textColor;
      default:
        return '#FFFFFF';
    }
  };

  const buttonStyle = [
    {
      backgroundColor: getBackgroundColor(),
      borderColor: getBorderColor(),
    },
    disabled && styles.disabled,
    style,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      disabled={disabled}
      activeOpacity={0.8}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text
          variant='button-m'
          weight='semibold'
          color={getTextColor()}
          align='center'
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
});

export default Button;
