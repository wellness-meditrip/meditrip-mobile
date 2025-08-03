import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useThemeColor } from '@/hooks/useThemeColor';

interface PickerOption {
  id: string;
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

  // iOS용 모달 피커
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

  // Android에서는 드롭다운 형태로 표시
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      )}
      <View style={[styles.pickerContainer, style]}>
        <TouchableOpacity
          style={[
            styles.pickerButton,
            {
              backgroundColor: inputBackgroundColor,
              borderColor: borderColor,
              opacity: disabled ? 0.6 : 1,
            },
          ]}
          onPress={() => setIsOpen(!isOpen)}
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
          <Text style={styles.pickerArrow}>{isOpen ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {isOpen && (
          <View
            style={[
              styles.pickerList,
              { backgroundColor: backgroundColor, borderColor: borderColor },
            ]}
          >
            <Picker
              selectedValue={selectedValue}
              onValueChange={itemValue => {
                if (itemValue) {
                  onSelect(itemValue as string);
                  setIsOpen(false);
                }
              }}
              style={styles.androidPicker}
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
        )}
      </View>
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
  pickerContainer: {
    position: 'relative',
    zIndex: 1,
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
  pickerList: {
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
  androidPicker: {
    height: 200,
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
  iosPicker: {
    height: 200,
  },
});

export default NativePicker;
