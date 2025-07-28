import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
} from 'react-native';
import Text from './text';
import { ScaledStyleProps, applyScaledStyles } from './types';

interface ButtonProps extends PressableProps, ScaledStyleProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'ghost',
  size = 'medium',
  loading = false,
  disabled = false,
  children,
  style,
  ...props
}) => {
  const textColor = getTextColor(variant, disabled);

  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primary;
      case 'secondary':
        return styles.secondary;
      case 'outline':
        return styles.outline;
      default:
        return styles.ghost;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.small;
      case 'large':
        return styles.large;
      default:
        return styles.medium;
    }
  };

  // scale 적용된 스타일
  const scaledStyle = applyScaledStyles(props);

  return (
    <Pressable
      style={({ pressed }) => {
        const buttonStyles: any[] = [
          styles.base,
          getVariantStyle(),
          getSizeStyle(),
          scaledStyle,
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
        <ActivityIndicator color={textColor} size='small' />
      ) : (
        <Text
          variant='body'
          weight='semibold'
          color={textColor}
          align='center'
          fontSize={props.fontSize}
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
      return '#333333';
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
    paddingHorizontal: 0,
    paddingVertical: 0,
    minHeight: 0,
  },
  medium: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    minHeight: 0,
  },
  large: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    minHeight: 0,
  },
  // States
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
});

export default Button;
