import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { scale } from '../../lib/scale-utils';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ColorPalette } from '@/constants/Colors';
import { Icon } from '../../../../components/icons';

interface DatePickerProps {
  placeholder?: string;
  selectedDate?: string;
  onChange?: (date: string) => void;
  style?: any;
  placeholderTextColor?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  placeholder = '날짜를 선택하세요',
  selectedDate,
  onChange,
  style,
  placeholderTextColor,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tempSelectedDate, setTempSelectedDate] = useState<string | undefined>(
    selectedDate
  );
  console.log(selectedDate);

  // 다크모드 색상 적용
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor(
    { light: '#e0e0e0', dark: '#2C2C2E' },
    'text'
  );
  const placeholderColor = useThemeColor(
    { light: '#333333', dark: '#9BA1A6' },
    'text'
  );
  const modalBgColor = useThemeColor(
    { light: '#ffffff', dark: '#1C1C1E' },
    'background'
  );
  const modalOverlayColor = useThemeColor(
    { light: 'rgba(0, 0, 0, 0.5)', dark: 'rgba(0, 0, 0, 0.7)' },
    'background'
  );
  const modalTitleColor = useThemeColor(
    { light: '#333333', dark: '#ECEDEE' },
    'text'
  );
  const closeButtonColor = useThemeColor(
    { light: ColorPalette.primaryColor50, dark: ColorPalette.primaryColor50 },
    'tint'
  );
  const disabledTextColor = useThemeColor(
    { light: '#d9e1e8', dark: '#6D6D70' },
    'text'
  );

  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}년 ${month}월 ${day}일`;
  };

  const handleDateSelect = (day: any) => {
    const dateString = day.dateString;
    setTempSelectedDate(dateString);
  };

  const handleConfirm = () => {
    if (tempSelectedDate) {
      onChange?.(tempSelectedDate);
    }
    setIsVisible(false);
  };

  const handleCancel = () => {
    setTempSelectedDate(selectedDate);
    setIsVisible(false);
  };

  const handleOpenModal = () => {
    setTempSelectedDate(selectedDate);
    setIsVisible(true);
  };

  return (
    <>
      <TouchableOpacity
        onPress={handleOpenModal}
        style={[
          styles.dateInput,
          {
            backgroundColor,
            borderColor,
          },
          style,
        ]}
      >
        <Text
          style={[
            styles.dateText,
            {
              color: selectedDate ? textColor : placeholderTextColor,
            },
          ]}
        >
          {selectedDate ? formatDisplayDate(selectedDate) : placeholder}
        </Text>
        <Icon
          name='ic-calendar'
          size={scale(20)}
          color={placeholderTextColor}
        />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType='slide'
        onRequestClose={handleCancel}
      >
        <View
          style={[styles.modalOverlay, { backgroundColor: modalOverlayColor }]}
        >
          <View
            style={[styles.modalContent, { backgroundColor: modalBgColor }]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: modalTitleColor }]}>
                날짜 선택
              </Text>
              <TouchableOpacity
                onPress={handleCancel}
                style={styles.closeButton}
              >
                <Text
                  style={[styles.closeButtonText, { color: closeButtonColor }]}
                >
                  닫기
                </Text>
              </TouchableOpacity>
            </View>
            <Calendar
              onDayPress={handleDateSelect}
              initialDate={tempSelectedDate || '2000-12-20'}
              markedDates={
                tempSelectedDate
                  ? {
                      [tempSelectedDate]: {
                        selected: true,
                        selectedColor: ColorPalette.primaryColor10,
                        selectedTextColor: ColorPalette.primaryColor50,
                      },
                    }
                  : {}
              }
              theme={{
                selectedDayBackgroundColor: ColorPalette.primaryColor10,
                selectedDayTextColor: ColorPalette.primaryColor50,
                todayTextColor: textColor,
                dayTextColor: textColor,
                textDisabledColor: disabledTextColor,
                arrowColor: textColor,
                monthTextColor: textColor,
                indicatorColor: textColor,
                textSectionTitleColor: textColor,
                textDayFontWeight: '300',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '300',
                textDayFontSize: 16,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 13,
                backgroundColor: modalBgColor,
              }}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={handleCancel}
                style={[styles.button, styles.cancelButton]}
              >
                <Text
                  style={[
                    styles.buttonText,
                    { color: ColorPalette.primaryColor50 },
                  ]}
                >
                  취소
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirm}
                style={[styles.button, styles.confirmButton]}
              >
                <Text style={[styles.buttonText, { color: '#ffffff' }]}>
                  확인
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  dateText: {
    fontSize: 16,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: scale(150),
  },
  modalContent: {
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: ColorPalette.primaryColor50,
  },
  confirmButton: {
    backgroundColor: ColorPalette.primaryColor50,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
