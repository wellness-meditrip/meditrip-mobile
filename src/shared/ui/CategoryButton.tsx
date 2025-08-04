import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ColorPalette } from '@/constants/Colors';
import { Icon, IconName } from '../../../components/icons';
import { scale } from '../lib/scale-utils';

interface CategoryButtonProps {
  icon: IconName;
  label: string;
  isSelected?: boolean;
  onPress?: () => void;
  disabled?: boolean;
}

export const CategoryButton = React.memo<CategoryButtonProps>(
  ({ icon, label, isSelected = false, onPress, disabled = false }) => {
    CategoryButton.displayName = 'CategoryButton';
    const handlePress = () => {
      if (!disabled && onPress) {
        onPress();
      }
    };

    return (
      <TouchableOpacity
        onPress={handlePress}
        style={styles.container}
        disabled={disabled}
        activeOpacity={1}
      >
        <ThemedView
          style={[
            styles.button,
            isSelected
              ? [
                  styles.selectedButton,
                  { backgroundColor: ColorPalette.primaryColor10 },
                ]
              : styles.defaultButton,
            disabled && styles.disabledButton,
          ]}
        >
          <ThemedView
            style={[
              styles.iconContainer,
              isSelected && [
                styles.selectedIconContainer,
                { backgroundColor: ColorPalette.primaryColor10 },
              ],
            ]}
          >
            <Icon name={icon} size={scale(24)} color={ColorPalette.primary} />
          </ThemedView>
          <ThemedText style={[styles.label, disabled && styles.disabledLabel]}>
            {label}
          </ThemedText>
        </ThemedView>
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 2,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    minHeight: 80,
  },
  defaultButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedButton: {
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  disabledButton: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
    opacity: 0.6,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  selectedIconContainer: {
    backgroundColor: '#E3F2FD',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  disabledLabel: {
    color: '#999',
  },
});
