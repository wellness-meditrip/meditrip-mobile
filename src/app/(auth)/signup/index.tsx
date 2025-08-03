import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { CountryLanguagePicker } from '@/src/shared/ui/custom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [country, setCountry] = useState('');
  const [language, setLanguage] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleEmailVerification = () => {
    if (email && email.includes('@')) {
      setIsEmailVerified(true);
      Alert.alert('인증 완료', '이메일 인증이 완료되었습니다.');
    } else {
      Alert.alert('오류', '올바른 이메일 주소를 입력해주세요.');
    }
  };

  const handleSignup = () => {
    if (!nickname || !country || !language) {
      Alert.alert('오류', '별명, 국가, 언어를 모두 입력해주세요.');
      return;
    }

    // 회원가입 로직 처리
    Alert.alert('성공', '회원가입이 완료되었습니다.');
    router.push('/(auth)/signup/user-profile');
  };

  const handleBackToLogin = () => {
    router.back();
  };

  const handleCountrySelect = (selectedCountry: string) => {
    setCountry(selectedCountry);
  };

  const handleLanguageSelect = (selectedLanguage: string) => {
    setLanguage(selectedLanguage);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>회원가입</Text>

          {/* 이메일 입력 */}
          {/* <View style={styles.inputContainer}>
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
                style={styles.verifyButton}
                onPress={handleEmailVerification}
              >
                <Text style={styles.verifyButtonText}>인증</Text>
              </TouchableOpacity>
            </View>
            {isEmailVerified && (
              <Text style={styles.verifiedText}>
                * 이메일 인증이 완료되었습니다.
              </Text>
            )}
          </View> */}

          {/* 비밀번호 입력 */}
          {/* <View style={styles.inputContainer}>
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
          </View> */}

          {/* 비밀번호 확인 */}
          {/* <View style={styles.inputContainer}>
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
          </View> */}

          {/* 별명 입력 */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>별명</Text>
            <TextInput
              style={styles.input}
              placeholder='사용하실 별명을 입력해주세요.'
              value={nickname}
              onChangeText={setNickname}
            />
          </View>

          {/* 국가 및 언어 선택 */}
          <CountryLanguagePicker
            selectedCountry={country}
            selectedLanguage={language}
            onCountrySelect={handleCountrySelect}
            onLanguageSelect={handleLanguageSelect}
          />

          {/* 회원가입 버튼 */}
          <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
            <Text style={styles.signupButtonText}>회원가입</Text>
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
    fontSize: 20,
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
    fontSize: 20,
    backgroundColor: '#fff',
  },
  verifyButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  verifiedText: {
    fontSize: 12,
    color: '#8B4513',
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
    fontSize: 20,
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
  signupButton: {
    backgroundColor: '#FFE4B5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  signupButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  loginLink: {
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: 14,
    color: '#666',
  },
  loginText: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
});
