import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useState, useCallback } from 'react';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button, Input, Text, View, DatePicker } from '@/src/shared/ui/custom';
import { BoxLayout } from '@/src/shared/ui/box-layout';
import Footer from '@/src/widgets/footer';
import { SEARCH } from '@/assets/icons/components';
import { CategoryButton } from '@/src/shared/ui/CategoryButton';
import { ClinicSlider } from '@/src/shared/ui/ClinicSlider';
import { CATEGORIES, Category } from '@/src/shared/lib/constants';
import { ARROW_LEFT } from '@/assets/icons/components/header';
import { ColorPalette } from '@/constants/Colors';
import { scale } from '../../../shared/lib';
import { Icon } from '../../../../components/icons';

export default function HomeScreen() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const handleCategoryPress = useCallback((categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  }, []);

  const handleDateChange = useCallback((date: string) => {
    setSelectedDate(date);
  }, []);

  // 임시 클리닉 데이터
  const mockClinics = [
    {
      id: '1',
      name: 'Healing Clinic',
      specialty: 'Weight Loss Treatment',
      location: 'Sinchon',
      rating: 4.1,
      image: require('@/assets/images/react-logo.png'), // 임시 이미지
    },
    {
      id: '2',
      name: 'Healing Clinic',
      specialty: 'Weight Loss Treatment',
      location: 'Sinchon',
      rating: 4.1,
      image: require('@/assets/images/react-logo.png'), // 임시 이미지
    },
    {
      id: '3',
      name: 'Healing Clinic',
      specialty: 'Weight Loss Treatment',
      location: 'Sinchon',
      rating: 4.1,
      image: require('@/assets/images/react-logo.png'), // 임시 이미지
    },
  ];

  const handleClinicPress = useCallback((clinic: any) => {
    console.log('Selected clinic:', clinic);
    // 여기에 클리닉 상세 페이지로 이동하는 로직 추가
  }, []);

  const renderCategoryButton = useCallback(
    (category: Category) => (
      <CategoryButton
        key={category.id}
        icon={category.icon}
        label={category.label}
        isSelected={selectedCategories.includes(category.id)}
        onPress={() => handleCategoryPress(category.id)}
      />
    ),
    [selectedCategories, handleCategoryPress]
  );

  return (
    <ParallaxScrollView>
      {/* <BoxLayout>
        <Input
          placeholder='Search'
          rightIcon={<SEARCH />}
          style={styles.searchInput}
        />
      </BoxLayout> */}
      <BoxLayout>
        <Text style={styles.title}>진료 카테고리를 선택해보세요</Text>

        <View style={styles.categoryContainer}>
          {CATEGORIES.map(renderCategoryButton)}
        </View>
      </BoxLayout>

      <BoxLayout>
        <Text style={styles.title}>Select your visit date</Text>
        <DatePicker
          placeholder='방문 날짜를 선택하세요'
          placeholderTextColor={ColorPalette.tertiary}
          selectedDate={selectedDate}
          onChange={handleDateChange}
          style={styles.datePicker}
        />
      </BoxLayout>
      <ThemedView style={styles.stepContainer}>
        <Button
          style={styles.button}
          onPress={() => router.push('/home/dashboard')}
        >
          <ThemedText style={styles.buttonText}>찾기</ThemedText>
        </Button>
      </ThemedView>
      <BoxLayout horizontal={16} backgroundColor={ColorPalette.primaryColor10}>
        <TouchableOpacity
          style={styles.recomendedClinicsContainer}
          onPress={() => router.push('/clinics')}
        >
          <Text style={styles.title}>추천 병원</Text>
          <ARROW_LEFT style={{ transform: [{ rotate: '180deg' }] }} />
        </TouchableOpacity>
        <View style={styles.recommendedClinicsBackground}>
          <ClinicSlider
            clinics={mockClinics}
            onClinicPress={handleClinicPress}
          />
        </View>
      </BoxLayout>
      <Footer />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    backgroundColor: '#fafafa',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 4,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginTop: 16,
    width: '100%',

    justifyContent: 'space-between',
  },
  stepContainer: {
    alignItems: 'center',
  },
  button: {
    width: '34%',
    backgroundColor: ColorPalette.primaryColor50,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 100,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  datePicker: {
    marginTop: 16,
  },
  recomendedClinicsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recommendedClinicsBackground: {
    marginTop: 8,
    paddingVertical: 16,
  },
});
