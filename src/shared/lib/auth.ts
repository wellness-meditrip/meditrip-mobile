import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// OAuth 설정
const GOOGLE_CLIENT_ID =
  '397287998102-o0gei5mtv0l86lf12hcqg5lo0mtsim3e.apps.googleusercontent.com';
const LINE_CHANNEL_ID = '2007839926';

// 딥링크 URI 확인
const DEEP_LINK_URI = Linking.createURL('/auth');
console.log('Deep Link URI:', DEEP_LINK_URI);

// 개발용 리디렉트 URI (실제 배포 시에는 도메인 필요)
const REDIRECT_URI = 'https://meditrip-mobile.vercel.app/';

interface AuthResult {
  success: boolean;
  user?: any;
  error?: string;
}

// 구글 로그인 (실제 OAuth 플로우 + 모의 데이터)
export const signInWithGoogle = async (): Promise<AuthResult> => {
  try {
    console.log('Starting Google OAuth...');

    // 실제 OAuth URL 생성
    const googleAuthUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent('openid email profile')}&` +
      `access_type=offline`;

    console.log('Google OAuth URL:', googleAuthUrl);

    // 웹브라우저로 인증 시작 (안드로이드 호환)
    const result = await WebBrowser.openAuthSessionAsync(
      googleAuthUrl,
      REDIRECT_URI,
      {
        showInRecents: Platform.OS === 'ios',
        createTask: Platform.OS === 'android',
      }
    );

    console.log('Google OAuth result:', result);

    if (result.type === 'success' && result.url) {
      // URL에서 인증 코드 추출
      const url = new URL(result.url);
      const code = url.searchParams.get('code');

      console.log('Google OAuth code:', code);

      if (code) {
        // 인증 코드로 사용자 정보 가져오기 (모의 데이터)
        const userInfo = await exchangeCodeForUserInfo(code, 'google');
        return {
          success: true,
          user: userInfo,
        };
      } else {
        return {
          success: false,
          error: '인증 코드를 받지 못했습니다.',
        };
      }
    } else if (result.type === 'cancel') {
      return {
        success: false,
        error: '로그인이 취소되었습니다.',
      };
    } else {
      return {
        success: false,
        error: '로그인 중 오류가 발생했습니다.',
      };
    }
  } catch (error) {
    console.error('Google 로그인 오류:', error);
    return {
      success: false,
      error: '로그인 중 오류가 발생했습니다.',
    };
  }
};

// 라인 로그인 (실제 OAuth 플로우 + 모의 데이터)
export const signInWithLine = async (): Promise<AuthResult> => {
  try {
    console.log('Starting LINE OAuth...');

    // 실제 라인 OAuth URL 생성 (웹 URL 사용)
    const lineAuthUrl =
      `https://access.line.me/oauth2/v2.1/authorize?` +
      `response_type=code&` +
      `client_id=${LINE_CHANNEL_ID}&` +
      `redirect_uri=${encodeURIComponent('https://meditrip-mobile.vercel.app/auth-callback')}&` +
      `state=random_state_string&` +
      `scope=profile%20openid%20email`;

    console.log('LINE OAuth URL:', lineAuthUrl);

    // 웹브라우저로 인증 시작 (웹 URL 사용)
    const result = await WebBrowser.openAuthSessionAsync(
      lineAuthUrl,
      'https://meditrip-mobile.vercel.app/auth-callback',
      {
        showInRecents: Platform.OS === 'ios',
        createTask: Platform.OS === 'android',
      }
    );

    console.log('LINE OAuth result:', result);

    if (result.type === 'success' && result.url) {
      // URL에서 인증 코드 추출
      const url = new URL(result.url);
      const code = url.searchParams.get('code');

      console.log('LINE OAuth code:', code);

      if (code) {
        // 인증 코드로 사용자 정보 가져오기 (모의 데이터)
        const userInfo = await exchangeCodeForUserInfo(code, 'line');
        return {
          success: true,
          user: userInfo,
        };
      } else {
        return {
          success: false,
          error: '인증 코드를 받지 못했습니다.',
        };
      }
    } else if (result.type === 'cancel') {
      return {
        success: false,
        error: '로그인이 취소되었습니다.',
      };
    } else {
      return {
        success: false,
        error: '로그인 중 오류가 발생했습니다.',
      };
    }
  } catch (error) {
    console.error('LINE 로그인 오류:', error);
    return {
      success: false,
      error: '로그인 중 오류가 발생했습니다.',
    };
  }
};

// 인증 코드를 사용자 정보로 교환 (모의 데이터 반환)
const exchangeCodeForUserInfo = async (
  code: string,
  provider: 'google' | 'line'
) => {
  try {
    console.log(`Exchanging code for user info (${provider}):`, code);

    // 실제 구현에서는 서버에 인증 코드를 보내서 액세스 토큰을 받아야 함
    // 현재는 모의 사용자 정보를 반환

    // 서버에 토큰 교환 요청을 보내는 로직 (실제 구현 시)
    // const response = await fetch('your-server-url/token', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     code,
    //     provider,
    //     client_id: provider === 'google' ? GOOGLE_CLIENT_ID : LINE_CHANNEL_ID,
    //     redirect_uri: REDIRECT_URI
    //   })
    // });
    // const { access_token } = await response.json();

    // 액세스 토큰으로 사용자 정보 가져오기 (실제 구현 시)
    // const userResponse = await fetch(provider === 'google'
    //   ? 'https://www.googleapis.com/oauth2/v2/userinfo'
    //   : 'https://api.line.me/v2/profile', {
    //   headers: { 'Authorization': `Bearer ${access_token}` }
    // });
    // const userInfo = await userResponse.json();

    // 현재는 모의 사용자 정보 반환
    await new Promise(resolve => setTimeout(resolve, 1000)); // 실제 API 호출 시뮬레이션

    if (provider === 'google') {
      return {
        uid: `google-${Date.now()}`,
        email: 'user@google.com',
        displayName: 'Google User',
        photoURL: 'https://via.placeholder.com/150',
        provider: 'google',
      };
    } else {
      return {
        uid: `line-${Date.now()}`,
        email: 'user@line.com',
        displayName: 'LINE User',
        photoURL: 'https://via.placeholder.com/150',
        provider: 'line',
      };
    }
  } catch (error) {
    console.error('사용자 정보 가져오기 오류:', error);
    throw error;
  }
};
