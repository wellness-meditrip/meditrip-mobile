import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { scale } from '../../lib/scale-utils';
import { useThemeColor } from '@/hooks/useThemeColor';

interface DatePickerProps {
  placeholder?: string;
  selectedDate?: string;
  onChange?: (date: string) => void;
  style?: any;
}

const CalendarIcon = ({ width, height }: { width: number; height: number }) => (
  <View style={{ width, height, backgroundColor: 'transparent' }} />
);

export const DatePicker: React.FC<DatePickerProps> = ({
  placeholder = '날짜를 선택하세요',
  selectedDate,
  onChange,
  style,
}) => {
  const [isVisible, setIsVisible] = useState(false);

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
    { light: '#007AFF', dark: '#0A84FF' },
    'tint'
  );
  const disabledTextColor = useThemeColor(
    { light: '#d9e1e8', dark: '#6D6D70' },
    'text'
  );

  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDateSelect = (day: any) => {
    const dateString = day.dateString;
    onChange?.(dateString);
    setIsVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setIsVisible(true)}
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
            { color: selectedDate ? textColor : placeholderColor },
          ]}
        >
          {selectedDate ? formatDisplayDate(selectedDate) : placeholder}
        </Text>
        <CalendarIcon width={20} height={20} />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType='slide'
        onRequestClose={() => setIsVisible(false)}
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
                onPress={() => setIsVisible(false)}
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
              markedDates={
                selectedDate
                  ? {
                      [selectedDate]: {
                        selected: true,
                        selectedColor: '#007AFF',
                      },
                    }
                  : {}
              }
              theme={{
                selectedDayBackgroundColor: '#007AFF',
                selectedDayTextColor: '#ffffff',
                todayTextColor: textColor,
                dayTextColor: textColor,
                textDisabledColor: disabledTextColor,
                arrowColor: textColor,
                monthTextColor: textColor,
                indicatorColor: textColor,
                textDayFontWeight: '300',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '300',
                textDayFontSize: 16,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 13,
                backgroundColor: modalBgColor,
              }}
            />
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
});
