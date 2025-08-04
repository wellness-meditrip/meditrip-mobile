import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import * as ImagePicker from 'expo-image-picker';
import { useAtom } from 'jotai';
import {
  profileImageAtom,
  profileInfoAtom,
} from '@/src/shared/lib/profile-store';
import { CountryLanguagePicker } from '@/src/shared/ui/custom';

const Profile = () => {
  // jotai 상태 관리
  const [profileImage, setProfileImage] = useAtom(profileImageAtom);
  const [profileInfo, setProfileInfo] = useAtom(profileInfoAtom);

  // 로컬 상태 (UI용)
  const [nickname, setNickname] = useState(profileInfo.nickname);
  const [email, setEmail] = useState(profileInfo.email);
  const [lineId, setLineId] = useState(profileInfo.lineId);
  const [selectedCountry, setSelectedCountry] = useState(profileInfo.country);
  const [selectedLanguage, setSelectedLanguage] = useState(
    profileInfo.language
  );

  // 다크모드 색상 적용
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor(
    { light: '#666', dark: '#9BA1A6' },
    'text'
  );
  const borderColor = useThemeColor(
    { light: '#f0f0f0', dark: '#2C2C2E' },
    'text'
  );
  const avatarBackgroundColor = useThemeColor(
    { light: '#e0e0e0', dark: '#3A3A3C' },
    'background'
  );
  const inputBackgroundColor = useThemeColor(
    { light: '#f8f8f8', dark: '#2C2C2E' },
    'background'
  );

  // 이미지 선택 함수
  const pickImage = async () => {
    try {
      // 권한 요청
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('권한 필요', '갤러리 접근 권한이 필요합니다.');
        return;
      }

      // 이미지 선택
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('오류', '이미지 선택 중 오류가 발생했습니다.');
    }
  };

  // 드롭다운 핸들러
  const handleCountrySelect = (countryName: string) => {
    setSelectedCountry(countryName);
  };

  const handleLanguageSelect = (languageName: string) => {
    setSelectedLanguage(languageName);
  };

  // 저장 버튼 처리
  const handleSave = () => {
    // jotai store 업데이트
    setProfileInfo({
      nickname,
      email,
      lineId,
      country: selectedCountry,
      language: selectedLanguage,
    });
    Alert.alert('저장 완료', '프로필 정보가 저장되었습니다!');
  };

  return (
    <>
      <ScrollView style={[styles.container, { backgroundColor }]}>
        {/* 계정 정보 섹션 */}
        <View
          style={[styles.section, { backgroundColor: cardBackgroundColor }]}
        >
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            계정 정보
          </Text>

          {/* 프로필 사진 */}
          <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: avatarBackgroundColor },
              ]}
            >
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={styles.profileImage}
                />
              ) : (
                <Text style={styles.cameraIcon}>📷</Text>
              )}
            </View>
          </TouchableOpacity>

          {/* 별명 */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: textColor }]}>별명</Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: inputBackgroundColor,
                  borderColor: borderColor,
                  color: textColor,
                },
              ]}
              value={nickname}
              onChangeText={setNickname}
              placeholder='별명을 입력하세요'
              placeholderTextColor={secondaryTextColor}
            />
          </View>
        </View>

        {/* 연락처 정보 섹션 */}
        <View
          style={[styles.section, { backgroundColor: cardBackgroundColor }]}
        >
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            연락처 정보
          </Text>

          {/* 이메일 주소 */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: textColor }]}>
              이메일 주소
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: inputBackgroundColor,
                  borderColor: borderColor,
                  color: textColor,
                },
              ]}
              value={email}
              onChangeText={setEmail}
              placeholder='이메일을 입력하세요'
              placeholderTextColor={secondaryTextColor}
              keyboardType='email-address'
            />
          </View>

          {/* 라인 ID */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: textColor }]}>
              라인 ID
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: inputBackgroundColor,
                  borderColor: borderColor,
                  color: textColor,
                },
              ]}
              value={lineId}
              onChangeText={setLineId}
              placeholder='라인 ID를 입력하세요'
              placeholderTextColor={secondaryTextColor}
            />
          </View>
        </View>

        {/* 국가 및 언어 설정 섹션 */}
        <View
          style={[styles.section, { backgroundColor: cardBackgroundColor }]}
        >
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            국가 및 언어 설정
          </Text>

          <CountryLanguagePicker
            selectedCountry={selectedCountry}
            selectedLanguage={selectedLanguage}
            onCountrySelect={handleCountrySelect}
            onLanguageSelect={handleLanguageSelect}
          />
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>저장하기</Text>
      </TouchableOpacity>
    </>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    fontSize: 24,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#FF6B35',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
