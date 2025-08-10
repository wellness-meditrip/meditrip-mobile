import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Modal,
  FlatList,
} from 'react-native';
// @ts-ignore
import { Picker } from '@react-native-picker/picker';
import { useThemeColor } from '@/hooks/useThemeColor';

interface PickerOption {
  id: string | number;
  name: string;
  code?: string;
}

interface NativePickerProps {
  label?: string;
  placeholder?: string;
  options: PickerOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  disabled?: boolean;
  style?: any;
  containerStyle?: any;
}

const NativePicker: React.FC<NativePickerProps> = ({
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

  const handleValueChange = (value: string) => {
    console.log('NativePicker handleValueChange:', value);
    if (value && value !== '') {
      onSelect(value);
    }
  };

  // iOS에서는 Modal 안에 Picker 사용 (이전 방식)
  if (Platform.OS === 'ios') {
    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text style={[styles.label, { color: textColor }]}>{label}</Text>
        )}
        <TouchableOpacity
          style={[
            styles.pickerButton,
            {
              backgroundColor: inputBackgroundColor,
              borderColor: borderColor,
              opacity: disabled ? 0.6 : 1,
            },
            style,
          ]}
          onPress={() => !disabled && setIsOpen(true)}
          disabled={disabled}
        >
          <Text
            style={[
              styles.pickerButtonText,
              { color: selectedValue ? textColor : '#999' },
            ]}
          >
            {selectedOption?.name || placeholder}
          </Text>
          <Text style={styles.pickerArrow}>▼</Text>
        </TouchableOpacity>

        <Modal
          visible={isOpen}
          transparent={true}
          animationType='slide'
          onRequestClose={() => setIsOpen(false)}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContent,
                { backgroundColor: backgroundColor },
              ]}
            >
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  onPress={() => setIsOpen(false)}
                  style={styles.cancelButton}
                >
                  <Text style={[styles.cancelButtonText, { color: '#007AFF' }]}>
                    취소
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setIsOpen(false)}
                  style={styles.doneButton}
                >
                  <Text style={[styles.doneButtonText, { color: '#007AFF' }]}>
                    완료
                  </Text>
                </TouchableOpacity>
              </View>
              <Picker
                selectedValue={selectedValue}
                onValueChange={itemValue => {
                  if (itemValue) {
                    onSelect(itemValue as string);
                  }
                }}
                style={styles.iosPicker}
              >
                <Picker.Item label={placeholder} value='' color='#999' />
                {options.map(option => (
                  <Picker.Item
                    key={option.id}
                    label={option.name}
                    value={option.name}
                    color={textColor}
                  />
                ))}
              </Picker>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // Android에서는 커스텀 모달 사용
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      )}
      <TouchableOpacity
        style={[
          styles.pickerButton,
          {
            backgroundColor: inputBackgroundColor,
            borderColor: borderColor,
            opacity: disabled ? 0.6 : 1,
          },
          style,
        ]}
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
      >
        <Text
          style={[
            styles.pickerButtonText,
            { color: selectedValue ? textColor : '#999' },
          ]}
        >
          {selectedOption?.name || placeholder}
        </Text>
        <Text style={styles.pickerArrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType='slide'
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, { backgroundColor: backgroundColor }]}
          >
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => setIsOpen(false)}
                style={styles.cancelButton}
              >
                <Text style={[styles.cancelButtonText, { color: '#007AFF' }]}>
                  취소
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsOpen(false)}
                style={styles.doneButton}
              >
                <Text style={[styles.doneButtonText, { color: '#007AFF' }]}>
                  완료
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.pickerContainer}>
              <FlatList
                data={options}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.optionItem,
                      selectedValue === item.name && styles.selectedOptionItem,
                    ]}
                    onPress={() => {
                      handleValueChange(item.name);
                      setIsOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        { color: textColor },
                        selectedValue === item.name &&
                          styles.selectedOptionText,
                      ]}
                    >
                      {item.name}
                    </Text>
                    {selectedValue === item.name && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.optionsList}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    height: 50,
  },
  pickerButtonText: {
    fontSize: 16,
  },
  pickerArrow: {
    fontSize: 12,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  cancelButton: {
    padding: 8,
  },
  cancelButtonText: {
    fontSize: 16,
  },
  doneButton: {
    padding: 8,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  pickerContainer: {
    padding: 20,
    maxHeight: 300, // 최대 높이 제한으로 스크롤 가능하게
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    minHeight: 56, // 터치 영역 확보
  },
  selectedOptionItem: {
    backgroundColor: '#f0f8ff', // 연한 파란색 배경
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  optionText: {
    fontSize: 16,
    flex: 1, // 텍스트가 공간을 차지하도록
  },
  selectedOptionText: {
    fontWeight: '600',
    color: '#007AFF',
  },
  checkmark: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  optionsList: {
    paddingBottom: 20,
  },
  iosPickerContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
  },
  iosPicker: {
    height: 200,
  },
});

export default NativePicker;
