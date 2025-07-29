import { useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';

export default function AuthCallback() {
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    // OAuth 인증 코드가 있으면 처리
    if (params.code) {
      console.log('OAuth callback received:', params);
      // 여기서 인증 코드를 처리하고 메인 화면으로 이동
      router.replace('/(tabs)/home');
    } else {
      // 인증 코드가 없으면 로그인 화면으로 이동
      router.replace('/(auth)/login');
    }
  }, [params, router]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>인증 처리 중...</Text>
    </View>
  );
}
