import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { CountryLanguagePicker } from '@/src/shared/ui/custom';
import { useSignup } from '@/src/shared/config/api-hooks';
import { type SignupRequest } from '@/src/shared/config/schemas';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [country, setCountry] = useState('');
  const [countryId, setCountryId] = useState<number | undefined>(undefined);
  const [language, setLanguage] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAgreement, setTermsAgreement] = useState(false);
  const [marketingAgreement, setMarketingAgreement] = useState(false);

  const signupMutation = useSignup();

  // 이메일 유효성 검사
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 비밀번호 유효성 검사 (8자 이상, 영문/숫자 혼합)
  const isValidPassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  // 닉네임 유효성 검사 (2-50자)
  const isValidNickname = (nickname: string) => {
    return nickname.length >= 2 && nickname.length <= 50;
  };

  // 모든 필수 필드가 완성되었는지 확인
  const isFormComplete = useMemo(() => {
    return (
      email &&
      isValidEmail(email) &&
      isEmailVerified &&
      password &&
      isValidPassword(password) &&
      password === confirmPassword &&
      nickname &&
      isValidNickname(nickname) &&
      country &&
      countryId &&
      termsAgreement
    );
  }, [
    email,
    isEmailVerified,
    password,
    confirmPassword,
    nickname,
    country,
    countryId,
    termsAgreement,
  ]);

  const handleEmailVerification = () => {
    if (email && isValidEmail(email)) {
      setIsEmailVerified(true);
      Alert.alert('인증 완료', '이메일 인증이 완료되었습니다.');
    } else {
      Alert.alert('오류', '올바른 이메일 주소를 입력해주세요.');
    }
  };

  const handleSignup = async () => {
    console.log('📝 회원가입 시도 시작');
    console.log('📧 이메일:', email);
    console.log('🔑 비밀번호:', password ? '***' : '입력되지 않음');
    console.log('🔑 비밀번호 확인:', confirmPassword ? '***' : '입력되지 않음');
    console.log('👤 닉네임:', nickname);
    console.log('🌍 국가:', country);
    console.log('🆔 국가 ID:', countryId);
    console.log('📧 이메일 인증:', isEmailVerified);
    console.log('📋 약관 동의:', termsAgreement);
    console.log('📢 마케팅 동의:', marketingAgreement);

    // 모든 필수 필드 검증
    if (!email || !isEmailVerified) {
      console.log('❌ 이메일 인증 미완료');
      Alert.alert('오류', '이메일 인증을 완료해주세요.');
      return;
    }

    if (!password) {
      console.log('❌ 비밀번호 누락');
      Alert.alert('오류', '비밀번호를 입력해주세요.');
      return;
    }

    if (!isValidPassword(password)) {
      console.log('❌ 비밀번호 형식 오류');
      Alert.alert(
        '오류',
        '비밀번호는 8자 이상, 영문과 숫자를 혼합하여 입력해주세요.'
      );
      return;
    }

    if (password !== confirmPassword) {
      console.log('❌ 비밀번호 불일치');
      Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!nickname) {
      console.log('❌ 닉네임 누락');
      Alert.alert('오류', '닉네임을 입력해주세요.');
      return;
    }

    if (!isValidNickname(nickname)) {
      console.log('❌ 닉네임 형식 오류');
      Alert.alert('오류', '닉네임은 2-50자 사이로 입력해주세요.');
      return;
    }

    if (!country) {
      console.log('❌ 국가 선택 누락');
      Alert.alert('오류', '국가를 선택해주세요.');
      return;
    }

    if (!countryId) {
      console.log('❌ 국가 ID 누락');
      Alert.alert('오류', '국가를 선택해주세요.');
      return;
    }

    if (!termsAgreement) {
      console.log('❌ 약관 동의 누락');
      Alert.alert('오류', '개인정보 수집·이용에 동의해주세요.');
      return;
    }

    try {
      console.log('💾 언어 저장 시작');
      // 선택한 언어를 AsyncStorage에 저장
      if (language) {
        await AsyncStorage.setItem('selectedLanguage', language);
        console.log('✅ 언어가 저장되었습니다:', language);
      }

      console.log('🚀 회원가입 API 호출 시작');
      // 회원가입 API 호출
      const signupData: SignupRequest = {
        email,
        password,
        confirm_password: confirmPassword,
        nickname,
        country_id: countryId,
        terms_agreement: termsAgreement,
        marketing_agreement: marketingAgreement,
      };

      console.log('📤 전송할 데이터:', JSON.stringify(signupData, null, 2));

      const result = await signupMutation.mutateAsync(signupData);

      console.log('📡 API 응답:', JSON.stringify(result, null, 2));

      if (result.success) {
        console.log('✅ 회원가입 성공');
        console.log('👤 사용자 정보:', result.user);
        console.log('🔑 토큰 정보:', result.tokens);
        console.log('🆕 신규 사용자:', result.is_new_user);
        Alert.alert('성공', result.message || '회원가입이 완료되었습니다.');
        router.push('/(auth)/signup/user-profile');
      } else {
        console.log('❌ 회원가입 실패');
        console.log('📝 에러 메시지:', result.message);
        console.log('📝 전체 응답:', JSON.stringify(result, null, 2));

        // API 응답에서 에러 메시지를 찾는 로직
        let errorMessage = '회원가입에 실패했습니다.';
        if (result.error) {
          errorMessage = result.error;
        } else if (result.message) {
          errorMessage = result.message;
        }

        Alert.alert('오류', errorMessage);
      }
    } catch (error: any) {
      console.log('💥 회원가입 중 예외 발생');
      console.log('❌ 에러 객체:', error);
      console.log('📝 에러 메시지:', error?.message);
      console.log('🔗 에러 스택:', error?.stack);
      console.error('회원가입 중 오류 발생:', error);
      Alert.alert('오류', error?.message || '회원가입 중 문제가 발생했습니다.');
    }
  };

  const handleBackToLogin = () => {
    router.back();
  };

  const handleCountrySelect = (
    selectedCountry: string,
    selectedCountryId?: number
  ) => {
    setCountry(selectedCountry);
    setCountryId(selectedCountryId);
    console.log('🌍 국가 선택:', selectedCountry, 'ID:', selectedCountryId);
  };

  const handleLanguageSelect = (selectedLanguage: string) => {
    setLanguage(selectedLanguage);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* 이메일 입력 */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>이메일 주소</Text>
            <View style={styles.emailContainer}>
              <TextInput
                style={styles.emailInput}
                placeholder='example@email.com'
                value={email}
                onChangeText={setEmail}
                keyboardType='email-address'
                autoCapitalize='none'
              />
              <TouchableOpacity
                style={[
                  styles.verifyButton,
                  !isValidEmail(email) && styles.verifyButtonDisabled,
                ]}
                onPress={handleEmailVerification}
                disabled={!isValidEmail(email)}
              >
                <Text
                  style={[
                    styles.verifyButtonText,
                    !isValidEmail(email) && styles.verifyButtonTextDisabled,
                  ]}
                >
                  인증
                </Text>
              </TouchableOpacity>
            </View>
            {isEmailVerified && (
              <Text style={styles.verifiedText}>
                * 이메일 인증이 완료되었습니다.
              </Text>
            )}
            {email && !isValidEmail(email) && (
              <Text style={styles.errorText}>
                * 올바른 이메일 형식을 입력해주세요.
              </Text>
            )}
          </View>

          {/* 비밀번호 입력 */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>비밀번호</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder='비밀번호를 입력하세요'
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.eyeIcon}>👁</Text>
              </TouchableOpacity>
            </View>
            {password && !isValidPassword(password) && (
              <Text style={styles.errorText}>
                * 비밀번호는 8자 이상, 영문과 숫자를 혼합하여 입력해주세요.
              </Text>
            )}
          </View>

          {/* 비밀번호 확인 */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>비밀번호 확인</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder='비밀번호를 다시 입력하세요'
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Text style={styles.eyeIcon}>👁</Text>
              </TouchableOpacity>
            </View>
            {confirmPassword && password !== confirmPassword && (
              <Text style={styles.errorText}>
                * 같은 비밀번호를 입력해주세요
              </Text>
            )}
          </View>

          {/* 별명 입력 */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>별명</Text>
            <TextInput
              style={styles.input}
              placeholder='사용하실 별명을 입력해주세요.'
              value={nickname}
              onChangeText={setNickname}
              maxLength={50}
            />
            {nickname && !isValidNickname(nickname) && (
              <Text style={styles.errorText}>
                * 닉네임은 2-50자 사이로 입력해주세요.
              </Text>
            )}
          </View>

          {/* 국가 및 언어 선택 */}
          <CountryLanguagePicker
            selectedCountry={country}
            selectedLanguage={language}
            onCountrySelect={handleCountrySelect}
            onLanguageSelect={handleLanguageSelect}
          />

          {/* 약관 동의 */}
          <View style={styles.agreementContainer}>
            <TouchableOpacity
              style={styles.agreementRow}
              onPress={() => setTermsAgreement(!termsAgreement)}
            >
              <View style={styles.checkboxContainer}>
                {termsAgreement ? (
                  <View style={styles.checkedBox}>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                ) : (
                  <View style={styles.uncheckedBox} />
                )}
              </View>
              <Text style={styles.agreementText}>
                개인정보 수집·이용에 동의합니다
                <Text style={styles.requiredText}>(필수)</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* 마케팅 수신 동의 */}
          <View style={styles.agreementContainer}>
            <TouchableOpacity
              style={styles.agreementRow}
              onPress={() => setMarketingAgreement(!marketingAgreement)}
            >
              <View style={styles.checkboxContainer}>
                {marketingAgreement ? (
                  <View style={styles.checkedBox}>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                ) : (
                  <View style={styles.uncheckedBox} />
                )}
              </View>
              <Text style={styles.agreementText}>
                마케팅 정보 수신 및 활용에 동의합니다
                <Text style={styles.optionalText}>(선택)</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* 회원가입 버튼 */}
          <TouchableOpacity
            style={[
              styles.signupButton,
              !isFormComplete && styles.signupButtonDisabled,
            ]}
            onPress={handleSignup}
            disabled={!isFormComplete || signupMutation.isPending}
          >
            {signupMutation.isPending ? (
              <ActivityIndicator color='#fff' />
            ) : (
              <Text
                style={[
                  styles.signupButtonText,
                  !isFormComplete && styles.signupButtonTextDisabled,
                ]}
              >
                회원가입
              </Text>
            )}
          </TouchableOpacity>

          {/* 로그인 링크 */}
          <TouchableOpacity
            style={styles.loginLink}
            onPress={handleBackToLogin}
          >
            <Text style={styles.loginLinkText}>
              이미 계정이 있으신가요?{' '}
              <Text style={styles.loginText}>로그인</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
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
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  emailInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  verifyButton: {
    backgroundColor: '#FFE4B5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  verifyButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },
  verifyButtonDisabled: {
    backgroundColor: '#f0f0f0',
  },
  verifyButtonTextDisabled: {
    color: '#999',
  },
  verifiedText: {
    fontSize: 12,
    color: '#4CAF50',
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
  eyeIcon: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    color: '#FF0000',
    marginTop: 4,
  },
  agreementContainer: {
    marginBottom: 15,
  },
  agreementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkboxContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uncheckedBox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  agreementText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  requiredText: {
    color: '#FF0000',
  },
  optionalText: {
    color: '#666',
  },
  signupButton: {
    backgroundColor: '#FFE4B5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  signupButtonDisabled: {
    backgroundColor: '#f0f0f0',
  },
  signupButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  signupButtonTextDisabled: {
    color: '#999',
  },
  loginLink: {
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: 14,
    color: '#666',
  },
  loginText: {
    color: '#FF6B35',
    textDecorationLine: 'underline',
  },
});
