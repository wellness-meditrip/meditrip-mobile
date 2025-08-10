import React, { useState, useEffect } from 'react';
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
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAtom } from 'jotai';
import { userAtom, ProfileImageInfo } from '@/src/shared/lib/profile-store';
import { CountryLanguagePicker } from '@/src/shared/ui/custom';
import { useUpdateProfileImage } from '../../../shared/config/api-hooks';
import { getSafeImageUri } from '@/src/shared/lib/image-utils';

// 커스텀 훅: 프로필 이미지 관리
const useProfileImage = () => {
  const [user, setUser] = useAtom(userAtom);
  const {
    mutate: updateUserProfileImage,
    isPending: isUpdatingImage,
    isSuccess: isImageUploadSuccess,
    isError: isImageUploadError,
    error: imageUploadError,
    data: uploadResponse,
  } = useUpdateProfileImage();

  // 이미지를 base64로 변환하는 함수
  const convertImageToBase64 = async (uri: string): Promise<string> => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error('이미지 base64 변환 실패:', error);
      throw new Error('이미지 변환에 실패했습니다.');
    }
  };

  // 서버에 이미지 업데이트하는 함수
  const uploadImageToServer = async (imageInfo: ProfileImageInfo) => {
    try {
      const base64Data = await convertImageToBase64(imageInfo.uri);

      // 이미지 타입에서 확장자 추출
      const getImageType = (mimeType: string | null | undefined): string => {
        if (!mimeType) return 'jpg';
        if (mimeType.includes('jpeg') || mimeType.includes('jpg')) return 'jpg';
        if (mimeType.includes('png')) return 'png';
        if (mimeType.includes('gif')) return 'gif';
        if (mimeType.includes('webp')) return 'webp';
        return 'jpg';
      };

      updateUserProfileImage({
        user_id: Number(user?.id),
        image_data: base64Data,
        image_type: getImageType(imageInfo.type),
        original_filename: imageInfo.fileName || 'profile_image.jpg',
      });
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
    }
  };

  // 이미지 선택 함수
  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('권한 필요', '갤러리 접근 권한이 필요합니다.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.3,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const maxSize = 1024 * 1024; // 1MB

        if (asset.fileSize && asset.fileSize > maxSize) {
          Alert.alert(
            '파일 크기 초과',
            '프로필 이미지는 1MB 이하여야 합니다. 더 작은 이미지를 선택해주세요.',
            [
              { text: '다시 선택', onPress: () => pickImage() },
              { text: '취소', style: 'cancel' },
            ]
          );
          return;
        }

        const imageInfo: ProfileImageInfo = {
          uri: asset.uri,
          fileName: asset.fileName || null,
          fileSize: asset.fileSize,
          type: asset.type || null,
          width: asset.width,
          height: asset.height,
        };

        // 낙관적 업데이트
        setUser(prevUser => {
          if (!prevUser) return prevUser;
          return {
            ...prevUser,
            profileImage: asset.uri,
          };
        });

        uploadImageToServer(imageInfo);
      }
    } catch (error) {
      Alert.alert('오류', '이미지 선택 중 오류가 발생했습니다.');
    }
  };

  // 이미지 업로드 결과 처리
  useEffect(() => {
    if (isImageUploadSuccess && uploadResponse) {
      console.log('이미지 업로드 성공:', uploadResponse);
      if (uploadResponse.data?.profile_image_url) {
        setUser(prevUser => {
          if (!prevUser) return prevUser;
          return {
            ...prevUser,
            profileImage: uploadResponse.data.profile_image_url,
          };
        });
      }
      Alert.alert('성공', '프로필 이미지가 업로드되었습니다.');
    }
  }, [isImageUploadSuccess, uploadResponse, setUser]);

  useEffect(() => {
    if (isImageUploadError && imageUploadError) {
      console.log('이미지 업로드 에러:', imageUploadError);
      Alert.alert(
        '업로드 실패',
        `이미지 업로드에 실패했습니다: ${imageUploadError.message || '알 수 없는 오류'}`
      );
    }
  }, [isImageUploadError, imageUploadError]);

  return {
    user,
    pickImage,
    isUpdatingImage,
  };
};

// 커스텀 훅: 프로필 데이터 관리
const useProfileData = () => {
  const [user, setUser] = useAtom(userAtom);
  const [localData, setLocalData] = useState({
    nickname: user?.nickname || '',
    email: user?.email || '',
    lineId: user?.lineId || '',
    country: user?.country || '',
    language: user?.language || '',
  });

  // user 상태가 변경될 때 로컬 상태 동기화
  useEffect(() => {
    if (user) {
      setLocalData({
        nickname: user.nickname || '',
        email: user.email || '',
        lineId: user.lineId || '',
        country: user.country || '',
        language: user.language || '',
      });
    }
  }, [user]);

  // AsyncStorage에서 언어 설정 불러오기
  useEffect(() => {
    const loadSavedLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (savedLanguage) {
          setUser(prevUser => {
            if (!prevUser) return prevUser;
            return {
              ...prevUser,
              language: savedLanguage,
            };
          });
        }
      } catch (error) {
        console.error('언어 로드 중 오류 발생:', error);
      }
    };

    loadSavedLanguage();
  }, []);

  const updateLocalData = (field: keyof typeof localData, value: string) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (user) {
      setUser({
        ...user,
        ...localData,
      });

      if (localData.language) {
        AsyncStorage.setItem('selectedLanguage', localData.language).catch(
          error => {
            console.error('언어 저장 중 오류 발생:', error);
          }
        );
      }
    }
  };

  return {
    localData,
    updateLocalData,
    handleSave,
  };
};

// 프로필 이미지 컴포넌트
const ProfileImage = ({
  user,
  onPickImage,
  isUpdating,
}: {
  user: any;
  onPickImage: () => void;
  isUpdating: boolean;
}) => {
  const avatarBackgroundColor = useThemeColor(
    { light: '#e0e0e0', dark: '#3A3A3C' },
    'background'
  );

  console.log('user', user);

  return (
    <TouchableOpacity
      style={styles.avatarContainer}
      onPress={onPickImage}
      disabled={isUpdating}
    >
      <View style={[styles.avatar, { backgroundColor: avatarBackgroundColor }]}>
        {user?.profileImage ? (
          <Image
            source={{ uri: getSafeImageUri(user.profileImage) }}
            style={styles.profileImage}
          />
        ) : (
          <Text style={styles.cameraIcon}>📷</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

// 입력 필드 컴포넌트
const ProfileInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'email-address';
}) => {
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor(
    { light: '#666', dark: '#9BA1A6' },
    'text'
  );
  const borderColor = useThemeColor(
    { light: '#f0f0f0', dark: '#2C2C2E' },
    'text'
  );
  const inputBackgroundColor = useThemeColor(
    { light: '#f8f8f8', dark: '#2C2C2E' },
    'background'
  );

  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.inputLabel, { color: textColor }]}>{label}</Text>
      <TextInput
        style={[
          styles.textInput,
          {
            backgroundColor: inputBackgroundColor,
            borderColor: borderColor,
            color: textColor,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={secondaryTextColor}
        keyboardType={keyboardType}
      />
    </View>
  );
};

// 섹션 컴포넌트
const ProfileSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const textColor = useThemeColor({}, 'text');
  const cardBackgroundColor = useThemeColor({}, 'background');

  return (
    <View style={[styles.section, { backgroundColor: cardBackgroundColor }]}>
      <Text style={[styles.sectionTitle, { color: textColor }]}>{title}</Text>
      {children}
    </View>
  );
};

const Profile = () => {
  const { user, pickImage, isUpdatingImage } = useProfileImage();
  const { localData, updateLocalData, handleSave } = useProfileData();
  const backgroundColor = useThemeColor({}, 'background');

  const handleCountrySelect = (countryName: string) => {
    updateLocalData('country', countryName);
  };

  const handleLanguageSelect = async (languageName: string) => {
    updateLocalData('language', languageName);
  };

  return (
    <>
      <ScrollView style={[styles.container, { backgroundColor }]}>
        {/* 계정 정보 섹션 */}
        <ProfileSection title='계정 정보'>
          <ProfileImage
            user={user}
            onPickImage={pickImage}
            isUpdating={isUpdatingImage}
          />

          <ProfileInput
            label='별명'
            value={localData.nickname}
            onChangeText={text => updateLocalData('nickname', text)}
            placeholder='별명을 입력하세요'
          />
        </ProfileSection>

        {/* 연락처 정보 섹션 */}
        <ProfileSection title='연락처 정보'>
          <ProfileInput
            label='이메일 주소'
            value={localData.email}
            onChangeText={text => updateLocalData('email', text)}
            placeholder='이메일을 입력하세요'
            keyboardType='email-address'
          />

          <ProfileInput
            label='라인 ID'
            value={localData.lineId}
            onChangeText={text => updateLocalData('lineId', text)}
            placeholder='라인 ID를 입력하세요'
          />
        </ProfileSection>

        {/* 국가 및 언어 설정 섹션 */}
        <ProfileSection title='국가 및 언어 설정'>
          <CountryLanguagePicker
            selectedCountry={localData.country}
            selectedLanguage={localData.language}
            onCountrySelect={handleCountrySelect}
            onLanguageSelect={handleLanguageSelect}
          />
        </ProfileSection>
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
