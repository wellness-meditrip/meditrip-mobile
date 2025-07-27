import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
} from 'react-native';
import { Text } from './Text';

export interface ButtonProps extends PressableProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  children,
  style,
  ...props
}) => {
  const textColor = getTextColor(variant, disabled);

  return (
    <Pressable
      style={({ pressed }) => {
        const buttonStyles: any[] = [
          styles.base,
          styles[variant],
          styles[size],
        ];
        
        if (disabled) buttonStyles.push(styles.disabled);
        if (pressed) buttonStyles.push(styles.pressed);
        if (style) buttonStyles.push(style);
        
        return buttonStyles;
      }}
      disabled={disabled || loading}
      hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text
          variant="body"
          weight="semibold"
          color={textColor}
          align="center"
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
};

const getTextColor = (variant: string, disabled: boolean): string => {
  if (disabled) return '#999999';
  
  switch (variant) {
    case 'primary':
      return '#FFFFFF';
    case 'secondary':
      return '#007AFF';
    case 'outline':
      return '#007AFF';
    case 'ghost':
      return '#007AFF';
    default:
      return '#FFFFFF';
  }
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Variants
  primary: {
    backgroundColor: '#007AFF',
  },
  secondary: {
    backgroundColor: '#F2F2F7',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  // Sizes
  small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 32,
  },
  medium: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    minHeight: 44,
  },
  large: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    minHeight: 56,
  },
  // States
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
}); 