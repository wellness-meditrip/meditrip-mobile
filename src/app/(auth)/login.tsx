import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { signInWithGoogle, signInWithLine } from '../../shared/lib/auth';

const Login = () => {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [lineLoading, setLineLoading] = useState(false);

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

  const handleSignup = () => {
    router.push('/(auth)/signup');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>MEDITRIP</Text>
        <Text style={styles.subtitle}>맞춤 의료 여행을 위한 로그인</Text>

        <View style={styles.form}>
          <TouchableOpacity
            style={[
              styles.googleButton,
              googleLoading && styles.disabledButton,
            ]}
            onPress={handleGoogleLogin}
            disabled={googleLoading || lineLoading}
          >
            <View style={styles.googleIcon}>
              <Text style={styles.googleIconText}>G</Text>
            </View>
            <Text style={styles.googleButtonText}>
              {googleLoading ? '로그인 중...' : 'Google로 로그인'}
            </Text>
            {googleLoading && (
              <ActivityIndicator
                size='small'
                color='#333'
                style={styles.loader}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.lineButton, lineLoading && styles.disabledButton]}
            onPress={handleLineLogin}
            disabled={googleLoading || lineLoading}
          >
            <View style={styles.lineIcon}>
              <Text style={styles.lineIconText}>L</Text>
            </View>
            <Text style={styles.lineButtonText}>
              {lineLoading ? '로그인 중...' : 'LINE으로 로그인'}
            </Text>
            {lineLoading && (
              <ActivityIndicator
                size='small'
                color='#fff'
                style={styles.loader}
              />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.signupSection}>
          <Text style={styles.signupText}>계정이 없으신가요? </Text>
          <TouchableOpacity
            onPress={handleSignup}
            disabled={googleLoading || lineLoading}
          >
            <Text
              style={[
                styles.signupLink,
                (googleLoading || lineLoading) && styles.disabledText,
              ]}
            >
              회원가입
            </Text>
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
    gap: 16,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 16,
    borderRadius: 8,
    justifyContent: 'center',
  },
  googleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  googleIconText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  googleButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  lineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00C300',
    padding: 16,
    borderRadius: 8,
    justifyContent: 'center',
  },
  lineIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  lineIconText: {
    color: '#00C300',
    fontSize: 14,
    fontWeight: 'bold',
  },
  lineButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.6,
  },
  loader: {
    marginLeft: 8,
  },
  signupButton: {
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  signupButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  disabledText: {
    opacity: 0.6,
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
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
});
