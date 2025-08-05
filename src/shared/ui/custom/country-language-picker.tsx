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
    { id: 1, name: '한국', code: 'KR' },
    { id: 2, name: '일본', code: 'JP' },
    { id: 3, name: '미국', code: 'US' },
  ];

  const languages = [
    { id: 'KO', name: '한국어', code: 'KO' },
    { id: 'JP', name: '日本語', code: 'JP' },
    { id: 'EN', name: 'English', code: 'EN' },
  ];

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

      <NativePicker
        label='언어'
        placeholder='언어를 선택'
        options={languages}
        selectedValue={selectedLanguage}
        onSelect={onLanguageSelect}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
});

export default CountryLanguagePicker;
