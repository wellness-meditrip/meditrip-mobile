import { router } from 'expo-router';
import { StyleSheet } from 'react-native';
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

export default function HomeScreen() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleCategoryPress = useCallback((categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
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
      <BoxLayout horizontal={8}>
        <View style={{ paddingHorizontal: 8 }}>
          <Text style={styles.title}>Choose your interests</Text>
        </View>
        <View style={styles.categoryContainer}>
          {CATEGORIES.map(renderCategoryButton)}
        </View>
      </BoxLayout>
      <BoxLayout>
        <Text style={styles.title}>Select your visit date</Text>
        <DatePicker
          placeholder='방문 날짜를 선택하세요'
          onChange={date => console.log('Selected date:', date)}
          style={styles.datePicker}
        />
      </BoxLayout>
      <ThemedView style={styles.stepContainer}>
        <Button
          style={styles.button}
          onPress={() => router.push('/home/dashboard')}
        >
          <ThemedText style={styles.buttonText}>Search</ThemedText>
        </Button>
      </ThemedView>
      <BoxLayout>
        <View style={styles.recomendedClinicsContainer}>
          <Text style={styles.title}>Recomended Clinics</Text>
          <ARROW_LEFT style={{ transform: [{ rotate: '180deg' }] }} />
        </View>
        <ClinicSlider clinics={mockClinics} onClinicPress={handleClinicPress} />
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
  },
  categoryContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  stepContainer: {
    alignItems: 'center',
  },
  button: {
    width: '34%',
    backgroundColor: '#007AFF',
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
});
