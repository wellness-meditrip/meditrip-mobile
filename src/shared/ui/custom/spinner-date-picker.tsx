import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
} from 'react-native';
import { scale } from '../../lib/scale-utils';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ColorPalette } from '@/constants/Colors';
import { Icon } from '../../../../components/icons';

interface SpinnerDatePickerProps {
  placeholder?: string;
  selectedDate?: string;
  onChange?: (date: string) => void;
  style?: any;
  placeholderTextColor?: string;
}

const { width: screenWidth } = Dimensions.get('window');

export const SpinnerDatePicker: React.FC<SpinnerDatePickerProps> = ({
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

  // 스크롤뷰 참조
  const yearScrollRef = useRef<ScrollView>(null);
  const monthScrollRef = useRef<ScrollView>(null);
  const dayScrollRef = useRef<ScrollView>(null);

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

  // 현재 날짜 기준으로 년도, 월, 일 배열 생성
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - 49 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // 선택된 날짜 파싱
  const parseSelectedDate = (dateString?: string) => {
    if (!dateString) return { year: currentYear, month: 1, day: 1 };
    const date = new Date(dateString);
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
  };

  // 현재 선택된 날짜
  const [selectedYear, setSelectedYear] = useState(
    parseSelectedDate(selectedDate).year
  );
  const [selectedMonth, setSelectedMonth] = useState(
    parseSelectedDate(selectedDate).month
  );
  const [selectedDay, setSelectedDay] = useState(
    parseSelectedDate(selectedDate).day
  );

  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}년 ${month}월 ${day}일`;
  };

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    updateSelectedDate(year, selectedMonth, selectedDay);
  };

  const handleMonthSelect = (month: number) => {
    setSelectedMonth(month);
    updateSelectedDate(selectedYear, month, selectedDay);
  };

  const handleDaySelect = (day: number) => {
    setSelectedDay(day);
    updateSelectedDate(selectedYear, selectedMonth, day);
  };

  const updateSelectedDate = (year: number, month: number, day: number) => {
    const dateString = `${year}-${month.toString().padStart(2, '0')}-${day
      .toString()
      .padStart(2, '0')}`;
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
    const parsed = parseSelectedDate(selectedDate);
    setSelectedYear(parsed.year);
    setSelectedMonth(parsed.month);
    setSelectedDay(parsed.day);
    setIsVisible(false);
  };

  const handleOpenModal = () => {
    // 선택된 날짜가 없으면 기본값(1990-07-29) 사용
    const defaultDate = '1990-07-29';
    const dateToUse = selectedDate || defaultDate;
    const parsed = parseSelectedDate(dateToUse);
    setSelectedYear(parsed.year);
    setSelectedMonth(parsed.month);
    setSelectedDay(parsed.day);
    setTempSelectedDate(selectedDate || defaultDate);
    setIsVisible(true);
  };

  // 모달이 열릴 때 스크롤뷰를 초기 위치로 이동
  useEffect(() => {
    if (isVisible) {
      const itemHeight = 50;
      const yearIndex = years.indexOf(selectedYear);
      const monthIndex = months.indexOf(selectedMonth);
      const dayIndex = days.indexOf(selectedDay);

      setTimeout(() => {
        if (yearScrollRef.current && yearIndex >= 0) {
          yearScrollRef.current.scrollTo({
            y: yearIndex * itemHeight,
            animated: false,
          });
        }
        if (monthScrollRef.current && monthIndex >= 0) {
          monthScrollRef.current.scrollTo({
            y: monthIndex * itemHeight,
            animated: false,
          });
        }
        if (dayScrollRef.current && dayIndex >= 0) {
          dayScrollRef.current.scrollTo({
            y: dayIndex * itemHeight,
            animated: false,
          });
        }
      }, 100);
    }
  }, [isVisible, selectedYear, selectedMonth, selectedDay]);

  const renderSpinnerColumn = (
    data: number[],
    selectedValue: number,
    onSelect: (value: number) => void,
    format: (value: number) => string,
    scrollRef: React.RefObject<ScrollView>
  ) => {
    const itemHeight = 50;
    const visibleItems = 3;
    const selectedIndex = data.indexOf(selectedValue);
    const scrollOffset = selectedIndex * itemHeight;

    return (
      <View style={styles.spinnerColumn}>
        <View style={styles.spinnerHighlight} />
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={itemHeight}
          decelerationRate='fast'
          onMomentumScrollEnd={event => {
            const offset = event.nativeEvent.contentOffset.y;
            const index = Math.round(offset / itemHeight);
            if (data[index] !== undefined) {
              onSelect(data[index]);
            }
          }}
          contentContainerStyle={{
            paddingVertical: itemHeight * Math.floor(visibleItems / 2),
          }}
          style={[
            styles.spinnerScrollView,
            { height: itemHeight * visibleItems },
          ]}
        >
          {data.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.spinnerItem,
                { height: itemHeight },
                selectedValue === item && styles.selectedSpinnerItem,
              ]}
              onPress={() => onSelect(item)}
            >
              <Text
                style={[
                  styles.spinnerItemText,
                  selectedValue === item && styles.selectedSpinnerItemText,
                ]}
              >
                {format(item)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
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

            <View style={styles.spinnerContainer}>
              {renderSpinnerColumn(
                years,
                selectedYear,
                handleYearSelect,
                year => `${year}년`,
                yearScrollRef
              )}
              {renderSpinnerColumn(
                months,
                selectedMonth,
                handleMonthSelect,
                month => `${month.toString().padStart(2, '0')}월`,
                monthScrollRef
              )}
              {renderSpinnerColumn(
                days,
                selectedDay,
                handleDaySelect,
                day => `${day.toString().padStart(2, '0')}일`,
                dayScrollRef
              )}
            </View>

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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
  spinnerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 10,
  },
  spinnerColumn: {
    flex: 1,
    position: 'relative',
    marginHorizontal: 5,
  },
  spinnerScrollView: {
    backgroundColor: 'transparent',
  },
  spinnerItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerItemText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '400',
  },
  selectedSpinnerItem: {
    // 선택된 아이템은 하이라이트 박스 안에 있으므로 스타일링 불필요
  },
  selectedSpinnerItemText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  spinnerHighlight: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    borderRadius: 8,
    transform: [{ translateY: -25 }],
    zIndex: -1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
