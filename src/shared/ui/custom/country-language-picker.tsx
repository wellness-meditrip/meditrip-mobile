import React from 'react';
import { View, StyleSheet } from 'react-native';
import NativePicker from './native-picker';

interface CountryLanguagePickerProps {
  selectedCountry?: string;
  selectedLanguage?: string;
  onCountrySelect: (country: string, countryId?: number) => void;
  onLanguageSelect: (language: string) => void;
  containerStyle?: any;
}

const CountryLanguagePicker: React.FC<CountryLanguagePickerProps> = ({
  selectedCountry,
  selectedLanguage,
  onCountrySelect,
  onLanguageSelect,
  containerStyle,
}) => {
  const countries = [
    { id: 1, name: 'South Korea', code: 'KR' },
    { id: 2, name: 'Japan', code: 'JP' },
    { id: 3, name: 'United States', code: 'US' },
  ];

  const languages = [
    { id: 'KO', name: '한국어', code: 'KO' },
    { id: 'JP', name: '日本語', code: 'JP' },
    { id: 'EN', name: 'English', code: 'EN' },
  ];

  // 언어 코드를 언어명으로 변환하는 함수
  const getLanguageName = (languageCode: string): string => {
    const language = languages.find(lang => lang.code === languageCode);
    return language?.name || languageCode;
  };

  const handleCountrySelect = (countryName: string) => {
    const selectedCountryData = countries.find(
      country => country.name === countryName
    );
    onCountrySelect(countryName, selectedCountryData?.id);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <NativePicker
        label='국가'
        placeholder='국가를 선택'
        options={countries}
        selectedValue={selectedCountry}
        onSelect={handleCountrySelect}
      />

      {/* <NativePicker
        label='언어'
        placeholder='언어를 선택'
        options={languages}
        selectedValue={getLanguageName(selectedLanguage || '')}
        onSelect={languageName => {
          // 언어명을 언어 코드로 변환
          const language = languages.find(lang => lang.name === languageName);
          if (language) {
            onLanguageSelect(language.code);
          }
        }}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
});

export default CountryLanguagePicker;
