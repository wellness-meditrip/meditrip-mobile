import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';

import { EmailLoginForm, WebViewLoginModal } from '../../shared/ui';
import type { LoginProvider } from '../../shared/ui/WebViewLoginModal';

const Login = () => {
  const [webViewModalVisible, setWebViewModalVisible] = useState(false);
  const [currentProvider, setCurrentProvider] =
    useState<LoginProvider>('google');

  const handleSignup = () => {
    router.push('/(auth)/signup');
  };

  const handleLoginSuccess = () => {
    router.replace('/(tabs)/home');
  };

  const handleGoogleLogin = () => {
    setCurrentProvider('google');
    setWebViewModalVisible(true);
  };

  const handleAppleLogin = () => {
    // TODO: 애플 로그인 기능 구현
    console.log('Apple 로그인 클릭');
  };

  const handleLineLogin = () => {
    setCurrentProvider('line');
    setWebViewModalVisible(true);
  };

  const handleCloseWebViewModal = () => {
    setWebViewModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>MEDITRIP</Text>
        <Text style={styles.subtitle}>맞춤 의료 여행을 위한 로그인</Text>

        <EmailLoginForm onLoginSuccess={handleLoginSuccess} />

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
          >
            <Text style={styles.googleIcon}>G</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.socialButton, styles.appleButton]}
            onPress={handleAppleLogin}
          ></TouchableOpacity>

          <TouchableOpacity
            style={[styles.socialButton, styles.lineButton]}
            onPress={handleLineLogin}
          >
            <Text style={styles.lineIcon}>L</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.signupSection}>
          <Text style={styles.signupText}>아직 계정이 없으신가요? </Text>
          <TouchableOpacity onPress={handleSignup}>
            <Text style={styles.signupLink}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 웹뷰 로그인 모달 */}
      <WebViewLoginModal
        visible={webViewModalVisible}
        onClose={handleCloseWebViewModal}
        onLoginSuccess={handleLoginSuccess}
        provider={currentProvider}
      />
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
    marginBottom: 20,
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
  appleButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  appleIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
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
