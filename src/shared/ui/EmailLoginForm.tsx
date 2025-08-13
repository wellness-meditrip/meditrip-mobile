import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Icon } from '../../../components/icons';
import { router } from 'expo-router';
import { useAtom } from 'jotai';

import { useLogin } from '../config/api-hooks';
import { api } from '../config/api-client';
import {
  userAtom,
  isLoggedInAtom,
  saveUserToStorage,
  saveLoginState,
} from '../lib/profile-store';
import { getUserProfileImage } from '../config';
import * as FileSystem from 'expo-file-system';
import { cleanupOldProfileImages } from '../lib/image-utils';

interface EmailLoginFormProps {
  onLoginSuccess?: () => void;
}

export const EmailLoginForm: React.FC<EmailLoginFormProps> = ({
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Jotai 상태 관리
  const [, setUser] = useAtom(userAtom);
  const [, setIsLoggedIn] = useAtom(isLoggedInAtom);

  const loginMutation = useLogin();

  // 이메일 유효성 검사
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 이메일 입력 시 유효성 검증
  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (text && !isValidEmail(text)) {
      setEmailError('올바른 이메일 형식을 입력해주세요.');
    } else {
      setEmailError('');
    }
  };

  // 로그인 버튼 활성화 조건
  const isLoginButtonEnabled = email && isValidEmail(email) && password;

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('오류', '이메일과 비밀번호를 입력해주세요.');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('오류', '올바른 이메일 형식을 입력해주세요.');
      return;
    }

    try {
      const result = await loginMutation.mutateAsync({
        email,
        password,
        remember_me: keepLoggedIn,
      });

      if (result.success) {
        // Jotai store에 사용자 정보 저장
        if (result.user) {
          // 국가 ID를 국가명으로 변환하는 함수
          const getCountryName = (countryId: number): string => {
            switch (countryId) {
              case 1:
                return '한국';
              case 2:
                return '일본';
              case 3:
                return '미국';
              default:
                return '한국';
            }
          };
          console.log('result.user', result.user);

          const profileImage = await getUserProfileImage(
            Number(result.user.id)
          );

          // base64 이미지를 파일로 저장
          let profileImagePath: string | undefined = undefined;
          if (profileImage.data?.image_data) {
            try {
              const fileName = `profile_${result.user.id}_${Date.now()}.jpg`;
              const filePath = `${FileSystem.documentDirectory}${fileName}`;

              await FileSystem.writeAsStringAsync(
                filePath,
                profileImage.data.image_data,
                {
                  encoding: FileSystem.EncodingType.Base64,
                }
              );

              profileImagePath = filePath;
              console.log('✅ 프로필 이미지를 파일로 저장했습니다:', filePath);
            } catch (error) {
              console.error('❌ 프로필 이미지 저장 실패:', error);
            }
          }

          const userData = {
            id: result.user.id,
            email: result.user.email,
            displayName:
              result.user.name ||
              result.user.display_name ||
              result.user.displayName,
            nickname: result.user.nickname,
            lineId: result.user.line_id || result.user.lineId,
            country: getCountryName(result.user.country_id),
            language: result.user.language || 'KO', // 기본값 설정
            profileImage: profileImagePath, // 파일 경로 저장
            isNewUser: result.is_new_user,
          };

          setUser(userData);

          // AsyncStorage에 사용자 정보 저장
          await saveUserToStorage(userData);

          // 오래된 프로필 이미지 파일 정리
          await cleanupOldProfileImages(result.user.id.toString());
        }

        // 토큰 저장 (AsyncStorage에서 관리)
        if (result.tokens) {
          const tokenKeys = Object.keys(result.tokens);
          if (tokenKeys.length > 0) {
            const firstToken = result.tokens[tokenKeys[0]];
            if (typeof firstToken === 'string') {
              await api.setAuthToken(firstToken);
            }
          }
        }

        // 로그인 상태 설정 및 저장
        setIsLoggedIn(true);
        await saveLoginState(true);

        Alert.alert('성공', '로그인이 완료되었습니다.');

        // 콜백 함수가 있으면 호출
        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          // 기본 동작: 메인 화면으로 이동
          router.replace('/(tabs)/home');
        }
      } else {
        // API 응답에서 에러 메시지를 찾는 로직
        let errorMessage = '로그인에 실패했습니다.';
        if (result.error) {
          errorMessage = result.error;
        } else if (result.message) {
          errorMessage = result.message;
        }

        Alert.alert('오류', errorMessage);
      }
    } catch (error: any) {
      Alert.alert('오류', error?.message || '로그인 중 문제가 발생했습니다.');
    }
  };

  return (
    <View style={styles.form}>
      {/* 이메일 입력 */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>이메일 주소</Text>
        <TextInput
          style={[styles.input, emailError && styles.inputError]}
          placeholder='example@email.com'
          value={email}
          onChangeText={handleEmailChange}
          keyboardType='email-address'
          autoCapitalize='none'
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      </View>

      {/* 비밀번호 입력 */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>비밀번호</Text>
        <View
          style={[styles.passwordContainer, emailError && styles.inputError]}
        >
          <TextInput
            style={styles.passwordInput}
            placeholder='password'
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize='none'
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Icon
              name={showPassword ? 'ic-eyeoff' : 'ic-eye'}
              size={20}
              color='#666'
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* 로그인 유지 및 비밀번호 찾기 */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setKeepLoggedIn(!keepLoggedIn)}
        >
          <View
            style={[styles.checkbox, keepLoggedIn && styles.checkboxChecked]}
          >
            {keepLoggedIn && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>로그인 유지</Text>
        </TouchableOpacity>
      </View>

      {/* 로그인 버튼 */}
      <TouchableOpacity
        style={[
          styles.loginButton,
          !isLoginButtonEnabled && styles.loginButtonDisabled,
        ]}
        onPress={handleEmailLogin}
        disabled={!isLoginButtonEnabled || loginMutation.isPending}
      >
        {loginMutation.isPending ? (
          <ActivityIndicator color='#fff' />
        ) : (
          <Text
            style={[
              styles.loginButtonText,
              !isLoginButtonEnabled && styles.loginButtonTextDisabled,
            ]}
          >
            로그인
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#ff6b6b',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginTop: 4,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  eyeButton: {
    padding: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#FF6B35',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    backgroundColor: '#ccc',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginButtonTextDisabled: {
    color: '#999',
  },
});
