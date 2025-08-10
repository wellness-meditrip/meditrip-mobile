import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useState, useCallback, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button, Input, Text, View, DatePicker } from '@/src/shared/ui/custom';
import { BoxLayout } from '@/src/shared/ui/box-layout';
import Footer from '@/src/widgets/footer';
import { CategoryButton } from '@/src/shared/ui/CategoryButton';
import { ClinicSlider } from '@/src/shared/ui/ClinicSlider';
import { CATEGORIES } from '@/src/shared/lib/constants';
import { ARROW_LEFT } from '@/assets/icons/components/header';
import { ColorPalette } from '@/constants/Colors';
import { useGetClinicList } from '../../../shared/config';
import { processImageSource } from '../../../shared/lib/image-utils';

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

type LanguageCode = keyof typeof LANGUAGE_TEXTS;
type LanguageTexts = (typeof LANGUAGE_TEXTS)[LanguageCode];

export interface Clinic {
  id: string;
  name: string;
  specialty: string;
  location: string;
  rating: number;
  image: any;
  tags: string[];
}

export default function HomeScreen() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('KO');
  const [texts, setTexts] = useState<LanguageTexts>(LANGUAGE_TEXTS.KO);

  const { data: clinics, isLoading, error } = useGetClinicList();

  // 저장된 언어 확인 및 설정
  useEffect(() => {
    const loadSavedLanguage = async () => {
      try {
        const savedLanguage = (await AsyncStorage.getItem(
          'selectedLanguage'
        )) as LanguageCode;
        if (savedLanguage && savedLanguage in LANGUAGE_TEXTS) {
          setCurrentLanguage(savedLanguage);
          setTexts(LANGUAGE_TEXTS[savedLanguage as LanguageCode]);
        }
      } catch (error) {
        console.error('언어 설정 로드 실패:', error);
        setTexts(LANGUAGE_TEXTS.KO);
      }
    };

    loadSavedLanguage();
  }, []);

  const handleCategoryPress = useCallback((categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  }, []);

  const handleDateChange = useCallback((date: string) => {
    setSelectedDate(date);
  }, []);

  const handleSearchPress = useCallback(() => {
    router.push('/clinics');
  }, []);

  const handleRecommendedPress = useCallback(() => {
    router.push('/clinics');
  }, []);

  const handleClinicPress = useCallback((clinic: Clinic) => {
    // 클리닉 상세 페이지로 이동하는 로직 추가
    console.log('클리닉 선택:', clinic);
  }, []);

  // 랜덤 별점 생성 함수
  const generateRandomRating = useCallback(() => {
    return Math.round((Math.random() * 1.5 + 3.5) * 10) / 10;
  }, []);

  // API 데이터를 활용한 mockClinics 생성
  const mockClinics = useMemo((): Clinic[] => {
    if (!clinics?.hospitals) {
      return [
        {
          id: '1',
          name: 'Healing Clinic',
          specialty: 'Weight Loss Treatment',
          location: 'Sinchon',
          rating: 4.1,
          image: require('@/assets/images/react-logo.png'),
          tags: ['tag1', 'tag2', 'tag3'],
        },
        {
          id: '2',
          name: 'Healing Clinic',
          specialty: 'Weight Loss Treatment',
          location: 'Sinchon',
          rating: 4.1,
          image: require('@/assets/images/react-logo.png'),
          tags: ['tag1', 'tag2', 'tag3'],
        },
        {
          id: '3',
          name: 'Healing Clinic',
          specialty: 'Weight Loss Treatment',
          location: 'Sinchon',
          rating: 4.1,
          image: require('@/assets/images/react-logo.png'),
          tags: ['tag1', 'tag2', 'tag3'],
        },
      ];
    }

    return clinics.hospitals
      .map(hospital => {
        const imageUrl = hospital.hospital_details?.[0]?.images?.[0]?.image_url;

        return {
          id: hospital.hospital_id.toString(),
          name: hospital.hospital_name,
          specialty: hospital.hospital_description,
          location: hospital.address,
          rating: generateRandomRating(),
          image: imageUrl
            ? { uri: processImageSource(imageUrl) }
            : require('@/assets/images/react-logo.png'),
          tags: ['다이어트', '안티에이징'], // 빈 배열로 tags 추가
        };
      })
      .filter(clinic => clinic.name !== '한방스파 여용국');
  }, [clinics?.hospitals, generateRandomRating]);

  // 카테고리 버튼들을 렌더링
  const categoryButtons = useMemo(() => {
    return CATEGORIES.map(category => (
      <CategoryButton
        key={category.id}
        icon={category.icon}
        label={category.label}
        isSelected={selectedCategories.includes(category.id)}
        onPress={() => handleCategoryPress(category.id)}
      />
    ));
  }, [selectedCategories, handleCategoryPress]);

  return (
    <ParallaxScrollView>
      <BoxLayout>
        <Text style={styles.title}>{texts.categoryTitle}</Text>
        <View style={styles.categoryContainer}>{categoryButtons}</View>
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
        <Button style={styles.button} onPress={handleSearchPress}>
          <ThemedText style={styles.buttonText}>
            {texts.searchButton}
          </ThemedText>
        </Button>
      </ThemedView>

      <BoxLayout horizontal={16} backgroundColor={ColorPalette.bgSurface1}>
        <TouchableOpacity
          style={styles.recomendedClinicsContainer}
          onPress={handleRecommendedPress}
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
