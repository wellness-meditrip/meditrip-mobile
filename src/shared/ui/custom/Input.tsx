import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import Text from './text';
import { ScaledStyleProps, applyScaledStyles } from './types';

import { useThemeColor } from '@/hooks/useThemeColor';
import Button from './button';

interface InputProps extends Omit<TextInputProps, 'style'>, ScaledStyleProps {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  variant?: 'outlined' | 'filled';
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  style?: any;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helper,
  leftIcon,
  rightIcon,
  onRightIconPress,
  variant = 'outlined',
  style,
  ...props
}) => {
  // 다크모드 색상 적용
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor(
    { light: '#8E8E93', dark: '#9BA1A6' },
    'text'
  );
  const labelColor = useThemeColor(
    { light: '#333333', dark: '#ECEDEE' },
    'text'
  );
  const helperColor = useThemeColor(
    { light: '#666666', dark: '#9BA1A6' },
    'text'
  );
  const errorColor = '#FF3B30';
  const borderColor = useThemeColor(
    { light: '#E0E0E0', dark: '#2C2C2E' },
    'text'
  );

  // scale 적용된 스타일
  const scaledStyle = applyScaledStyles(props);

  const inputStyle = [
    styles.base,
    styles[variant],
    {
      backgroundColor,
      color: textColor,
      borderColor: error ? errorColor : borderColor,
    },
    error ? styles.error : null,
    leftIcon ? styles.withLeftIcon : null,
    rightIcon ? styles.withRightIcon : null,
    scaledStyle,
    style,
  ];

  return (
    <View>
      {label && (
        <Text
          variant='label'
          weight='medium'
          style={[styles.label, { color: labelColor }]}
        >
          {label}
        </Text>
      )}

      <View style={styles.inputContainer}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          style={inputStyle}
          placeholderTextColor={placeholderColor}
          {...props}
        />

        {rightIcon && (
          <Button
            style={
              [
                styles.rightIcon,
                props.value && props.value.length > 0
                  ? styles.rightIconEnabled
                  : styles.rightIconDisabled,
              ] as any
            }
            onPress={onRightIconPress}
            disabled={
              !props.value || props.value.length === 0 || !onRightIconPress
            }
          >
            {rightIcon}
          </Button>
        )}
      </View>

      {(error || helper) && (
        <Text
          variant='caption'
          color={error ? errorColor : helperColor}
          style={styles.helper}
        >
          {error || helper}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  base: {
    flex: 1,
    fontSize: 16,
    minHeight: 48,
    textAlignVertical: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  outlined: {
    // backgroundColor는 동적으로 적용
  },
  filled: {
    // backgroundColor는 동적으로 적용
  },
  focused: {
    borderColor: '#007AFF',
  },
  error: {
    borderColor: '#FF3B30',
  },
  withLeftIcon: {
    paddingLeft: 48,
  },
  withRightIcon: {
    paddingRight: 48,
  },
  leftIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  rightIcon: {
    position: 'absolute',
    right: 16,
    zIndex: 1,
  },
  rightIconEnabled: {
    opacity: 1,
  },
  rightIconDisabled: {
    opacity: 0.3,
  },
  helper: {
    marginTop: 4,
  },
});

export default Input;
