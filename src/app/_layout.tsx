import React from 'react';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as WebBrowser from 'expo-web-browser';
import 'react-native-reanimated';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useColorScheme } from '@/hooks/useColorScheme';
import { queryClient } from '../shared/config';
import { api } from '../shared/config/api-client';

// 앱 시작 시 인증 세션 정리
WebBrowser.maybeCompleteAuthSession();

// 스플래시 화면이 자동으로 숨겨지지 않도록 방지
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    'Pretendard-Regular': require('../../assets/fonts/Pretendard-Regular.otf'),
    'Pretendard-Medium': require('../../assets/fonts/Pretendard-Medium.otf'),
    'Pretendard-SemiBold': require('../../assets/fonts/Pretendard-SemiBold.otf'),
    'Pretendard-Bold': require('../../assets/fonts/Pretendard-Bold.otf'),
    'Pretendard-Light': require('../../assets/fonts/Pretendard-Light.otf'),
    'Pretendard-ExtraBold': require('../../assets/fonts/Pretendard-ExtraBold.otf'),
    'Pretendard-Black': require('../../assets/fonts/Pretendard-Black.otf'),
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // 앱 시작 시 저장된 토큰 불러오기
  React.useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await api.loadAuthToken();
        if (token) {
          console.log('🔑 앱 시작 시 저장된 토큰을 불러왔습니다');
        }
      } catch (error) {
        console.error('❌ 토큰 불러오기 실패:', error);
      }
    };

    loadToken();
  }, []);

  if (!loaded) {
    // 글꼴 로딩 중에는 스플래시 화면 유지
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView
        style={{ flex: 1 }}
        onLayout={async () => {
          // 앱이 준비되면 스플래시 화면 숨기기
          await SplashScreen.hideAsync();
        }}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ThemeProvider
            value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
          >
            <Stack
              screenOptions={{
                animation: 'none', // 네비게이션 애니메이션 비활성화
                headerShown: false,
              }}
            >
              <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
              <Stack.Screen name='(auth)' options={{ headerShown: false }} />
              <Stack.Screen name='+not-found' />
            </Stack>
            <StatusBar style='auto' />
          </ThemeProvider>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </QueryClientProvider>
  );
}
