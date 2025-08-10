import { useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, Text, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

// 딥링크 처리 시 인증 세션 정리
WebBrowser.maybeCompleteAuthSession();

export default function DeepLinkHandler() {
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    const handleDeepLink = async () => {
      try {
        console.log('Deep link received:', params);

        // OAuth 인증 코드가 있으면 처리
        if (params.code) {
          console.log('OAuth code received:', params.code);

          // 인증 코드로 사용자 정보 가져오기 (모의 데이터)
          const userInfo = await exchangeCodeForUserInfo(params.code as string);

          if (userInfo) {
            // 성공적으로 사용자 정보를 받았으면 메인 화면으로 이동
            console.log('Authentication successful:', userInfo);
            Alert.alert(
              '로그인 성공',
              `${userInfo.displayName}님, 환영합니다!`
            );
            router.replace('/(tabs)/home');
          } else {
            // 사용자 정보 가져오기 실패
            console.error('Failed to get user info');
            Alert.alert(
              '로그인 실패',
              '사용자 정보를 가져오는데 실패했습니다.'
            );
            router.replace('/(auth)/login');
          }
        } else if (params.error) {
          // OAuth 에러가 있는 경우
          console.error('OAuth error:', params.error);
          Alert.alert(
            '로그인 실패',
            `인증 중 오류가 발생했습니다: ${params.error}`
          );
          router.replace('/(auth)/login');
        } else {
          // 인증 코드가 없으면 로그인 화면으로 이동
          console.log('No auth code found, redirecting to login');
          router.replace('/(auth)/login');
        }
      } catch (error) {
        console.error('Deep link processing error:', error);
        Alert.alert('로그인 실패', '인증 처리 중 오류가 발생했습니다.');
        router.replace('/(auth)/login');
      }
    };

    handleDeepLink();
  }, [params, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size='large' color='#FF6B35' />
      <Text style={styles.text}>인증 처리 중...</Text>
    </View>
  );
}

// 인증 코드를 사용자 정보로 교환하는 함수
const exchangeCodeForUserInfo = async (code: string) => {
  try {
    console.log('Exchanging code for user info:', code);

    // 실제 구현에서는 서버에 인증 코드를 보내서 액세스 토큰을 받아야 함
    // 여기서는 모의 사용자 정보를 반환

    // 서버에 토큰 교환 요청을 보내는 로직 (실제 구현 시)
    // const response = await fetch('your-server-url/token', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ code })
    // });
    // const { access_token } = await response.json();

    // 액세스 토큰으로 사용자 정보 가져오기 (실제 구현 시)
    // const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    //   headers: { 'Authorization': `Bearer ${access_token}` }
    // });
    // const userInfo = await userResponse.json();

    // 현재는 모의 사용자 정보 반환
    await new Promise(resolve => setTimeout(resolve, 2000)); // 실제 API 호출 시뮬레이션

    return {
      uid: `user-${Date.now()}`,
      email: 'user@example.com',
      displayName: '테스트 사용자',
      photoURL: 'https://via.placeholder.com/150',
      provider: 'google', // 또는 'line'
    };
  } catch (error) {
    console.error('사용자 정보 가져오기 오류:', error);
    return null;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#333',
  },
});
