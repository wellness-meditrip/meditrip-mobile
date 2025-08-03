import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface DropdownOption {
  id: string;
  name: string;
  code?: string;
}

interface DropdownProps {
  label?: string;
  placeholder?: string;
  options: DropdownOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  disabled?: boolean;
  style?: any;
  containerStyle?: any;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  placeholder = '선택해주세요',
  options,
  selectedValue,
  onSelect,
  disabled = false,
  style,
  containerStyle,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // 테마 색상
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor(
    { light: '#f0f0f0', dark: '#2C2C2E' },
    'text'
  );
  const inputBackgroundColor = useThemeColor(
    { light: '#f8f8f8', dark: '#2C2C2E' },
    'background'
  );

  // 선택된 옵션 찾기
  const selectedOption = options.find(option => option.name === selectedValue);

  // 드롭다운 토글
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  // 옵션 선택
  const handleSelect = (option: DropdownOption) => {
    onSelect(option.name);
    setIsOpen(false);
  };

  // 바깥 영역 클릭 시 닫기
  const handleOutsideClick = () => {
    setIsOpen(false);
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsideClick}>
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text style={[styles.label, { color: textColor }]}>{label}</Text>
        )}
        <View style={[styles.dropdownContainer, style]}>
          <TouchableOpacity
            style={[
              styles.dropdownButton,
              {
                backgroundColor: inputBackgroundColor,
                borderColor: borderColor,
                opacity: disabled ? 0.6 : 1,
              },
            ]}
            onPress={toggleDropdown}
            disabled={disabled}
          >
            <Text
              style={[
                styles.dropdownButtonText,
                { color: selectedValue ? textColor : '#999' },
              ]}
            >
              {selectedOption?.name || placeholder}
            </Text>
            <Text style={styles.dropdownArrow}>{isOpen ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {isOpen && (
            <View
              style={[
                styles.dropdownList,
                { backgroundColor: backgroundColor, borderColor: borderColor },
              ]}
            >
              {options.map((option, index) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.dropdownItem,
                    {
                      borderBottomColor: borderColor,
                      borderBottomWidth: index === options.length - 1 ? 0 : 1,
                    },
                  ]}
                  onPress={() => handleSelect(option)}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      { color: textColor },
                      selectedValue === option.name && styles.selectedItemText,
                    ]}
                  >
                    {option.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  dropdownContainer: {
    position: 'relative',
    zIndex: 1,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  dropdownButtonText: {
    fontSize: 16,
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#666',
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 2,
    zIndex: 2,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 12,
  },
  dropdownItemText: {
    fontSize: 16,
  },
  selectedItemText: {
    fontWeight: '600',
    color: '#FF6B35',
  },
});

export default Dropdown;
