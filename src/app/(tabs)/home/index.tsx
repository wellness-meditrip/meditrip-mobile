import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

// 언어별 텍스트 정의
const LANGUAGE_TEXTS = {
  KO: {
    categoryTitle: '진료 카테고리를 선택해보세요',
    dateTitle: '방문 날짜를 선택하세요',
    datePlaceholder: '방문 날짜를 선택하세요',
    searchButton: '찾기',
    recommendedTitle: '추천 병원',
  },
  JP: {
    categoryTitle: '診療カテゴリーを選択してください',
    dateTitle: '訪問日を選択してください',
    datePlaceholder: '訪問日を選択してください',
    searchButton: '検索',
    recommendedTitle: 'おすすめ病院',
  },
  EN: {
    categoryTitle: 'Select a treatment category',
    dateTitle: 'Select your visit date',
    datePlaceholder: 'Select your visit date',
    searchButton: 'Search',
    recommendedTitle: 'Recommended Clinics',
  },
};

export default function HomeScreen() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [currentLanguage, setCurrentLanguage] = useState('KO'); // 기본값은 한국어
  const [texts, setTexts] = useState(LANGUAGE_TEXTS.KO);

  // 저장된 언어 확인 및 설정
  useEffect(() => {
    const loadSavedLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (savedLanguage) {
          setCurrentLanguage(savedLanguage);
          setTexts(
            LANGUAGE_TEXTS[savedLanguage as keyof typeof LANGUAGE_TEXTS] ||
              LANGUAGE_TEXTS.KO
          );
          console.log('저장된 언어를 불러왔습니다:', savedLanguage);
        } else {
          console.log('저장된 언어가 없어 기본값(한국어)을 사용합니다.');
        }
      } catch (error) {
        console.error('언어 로드 중 오류 발생:', error);
        setTexts(LANGUAGE_TEXTS.KO);
      }
    };

    loadSavedLanguage();
  }, []);

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
        <Text style={styles.title}>{texts.categoryTitle}</Text>

        <View style={styles.categoryContainer}>
          {CATEGORIES.map(renderCategoryButton)}
        </View>
      </BoxLayout>

      <BoxLayout>
        <Text style={styles.title}>{texts.dateTitle}</Text>
        <DatePicker
          placeholder={texts.datePlaceholder}
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
          <ThemedText style={styles.buttonText}>
            {texts.searchButton}
          </ThemedText>
        </Button>
      </ThemedView>
      <BoxLayout horizontal={16} backgroundColor={ColorPalette.primaryColor10}>
        <TouchableOpacity
          style={styles.recomendedClinicsContainer}
          onPress={() => router.push('/clinics')}
        >
          <Text style={styles.title}>{texts.recommendedTitle}</Text>
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
