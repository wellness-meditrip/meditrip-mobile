import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { signInWithGoogle, signInWithLine } from '../../shared/lib/auth';
import { useLogin } from '../../shared/config/api-hooks';
import { type LoginResponse } from '../../shared/config/schemas';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [lineLoading, setLineLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

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

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result.success && result.user) {
        Alert.alert(
          '성공',
          `${result.user.displayName || result.user.email || '사용자'}님, 환영합니다!\n이메일: ${result.user.email || '이메일 없음'}`
        );
        // 로그인 성공 후 메인 화면으로 이동
        router.replace('/(tabs)/home');
      } else {
        Alert.alert('오류', result.error);
      }
    } catch (error) {
      Alert.alert('오류', '로그인 중 문제가 발생했습니다.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleLineLogin = async () => {
    setLineLoading(true);
    try {
      const result = await signInWithLine();
      if (result.success && result.user) {
        Alert.alert(
          '성공',
          `${result.user.displayName || '사용자'}님, 환영합니다!\n라인 ID: ${result.user.uid || 'ID 없음'}`
        );
        // 로그인 성공 후 메인 화면으로 이동
        router.replace('/(tabs)/home');
      } else {
        Alert.alert('오류', result.error);
      }
    } catch (error) {
      Alert.alert('오류', '로그인 중 문제가 발생했습니다.');
    } finally {
      setLineLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    console.log('🔐 로그인 시도 시작');
    console.log('📧 이메일:', email);
    console.log('🔑 비밀번호:', password ? '***' : '입력되지 않음');
    console.log('💾 로그인 유지:', keepLoggedIn);

    if (!email || !password) {
      console.log('❌ 필수 필드 누락');
      Alert.alert('오류', '이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    if (!isValidEmail(email)) {
      console.log('❌ 이메일 형식 오류');
      Alert.alert('오류', '올바른 이메일 형식을 입력해주세요.');
      return;
    }

    try {
      console.log('🚀 API 호출 시작');
      const result = await loginMutation.mutateAsync({
        email,
        password,
        remember_me: keepLoggedIn,
      });

      console.log('📡 API 응답:', JSON.stringify(result, null, 2));

      if (result.success) {
        console.log('✅ 로그인 성공');
        console.log('👤 사용자 정보:', result.user);
        console.log('🔑 토큰 정보:', result.tokens);
        console.log('🆕 신규 사용자:', result.is_new_user);
        Alert.alert('성공', result.message || '로그인되었습니다.');
        router.replace('/(tabs)/home');
      } else {
        console.log('❌ 로그인 실패');
        console.log('📝 에러 메시지:', result.message);
        console.log('📝 전체 응답:', JSON.stringify(result, null, 2));

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
      console.log('💥 로그인 중 예외 발생');
      console.log('❌ 에러 객체:', error);
      console.log('📝 에러 메시지:', error?.message);
      console.log('🔗 에러 스택:', error?.stack);
      Alert.alert('오류', error?.message || '로그인 중 문제가 발생했습니다.');
    }
  };

  // const handleForgotPassword = () => {
  //   Alert.alert('알림', '비밀번호 찾기 기능은 준비 중입니다.');
  // };

  const handleSignup = () => {
    router.push('/(auth)/signup');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>MEDITRIP</Text>
        <Text style={styles.subtitle}>맞춤 의료 여행을 위한 로그인</Text>

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
            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}
          </View>

          {/* 비밀번호 입력 */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>비밀번호</Text>
            <View
              style={[
                styles.passwordContainer,
                emailError && styles.inputError,
              ]}
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
                <Text style={styles.eyeIcon}>👁</Text>
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
                style={[
                  styles.checkbox,
                  keepLoggedIn && styles.checkboxChecked,
                ]}
              >
                {keepLoggedIn && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>로그인 유지</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.forgotPassword}>비밀번호 찾기</Text>
            </TouchableOpacity> */}
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

          {/* 구분선 */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>Or Continue with</Text>
            <View style={styles.divider} />
          </View>

          {/* 소셜 로그인 버튼들 */}
          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity
              style={[styles.socialButton, styles.googleButton]}
              onPress={handleGoogleLogin}
              disabled={googleLoading || lineLoading || loginMutation.isPending}
            >
              {googleLoading ? (
                <ActivityIndicator color='#fff' />
              ) : (
                <Text style={styles.googleIcon}>G</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialButton, styles.lineButton]}
              onPress={handleLineLogin}
              disabled={googleLoading || lineLoading || loginMutation.isPending}
            >
              {lineLoading ? (
                <ActivityIndicator color='#fff' />
              ) : (
                <Text style={styles.lineIcon}>L</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.signupSection}>
          <Text style={styles.signupText}>아직 계정이 없으신가요? </Text>
          <TouchableOpacity onPress={handleSignup}>
            <Text style={styles.signupLink}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
  },
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
  eyeIcon: {
    fontSize: 20,
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
  forgotPassword: {
    fontSize: 14,
    color: '#FF6B35',
    textDecorationLine: 'underline',
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
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#666',
    fontSize: 14,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  googleIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4285F4',
  },
  lineButton: {
    backgroundColor: '#00C300',
  },
  lineIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  signupSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signupText: {
    color: '#666',
    fontSize: 14,
  },
  signupLink: {
    color: '#FF6B35',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});
