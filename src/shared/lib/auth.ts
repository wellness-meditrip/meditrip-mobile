import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import * as Linking from 'expo-linking';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// OAuth 설정
const GOOGLE_CLIENT_ID =
  '397287998102-o0gei5mtv0l86lf12hcqg5lo0mtsim3e.apps.googleusercontent.com';
const LINE_CHANNEL_ID = '2007839926';

// 앱 시작 시 인증 세션 정리
WebBrowser.maybeCompleteAuthSession();

// AuthSession을 사용한 올바른 리디렉션 URI 생성
const createRedirectUri = (provider: 'google' | 'line') => {
  if (provider === 'line') {
    // LINE은 HTTPS URL만 지원하므로 고정된 HTTPS URL 사용
    // 실제 배포된 Vercel URL 사용
    const lineRedirectUri =
      'https://meditrip-mobile-9jb9y9kjd-lumpenops-projects.vercel.app/auth-callback';
    console.log('LINE Redirect URI:', lineRedirectUri);
    return lineRedirectUri;
  }

  // Google은 네이티브 스키마도 지원
  const nativeRedirectUri = AuthSession.makeRedirectUri({
    native: 'meditrip-mobile://auth',
  });

  const webRedirectUri = AuthSession.makeRedirectUri({
    scheme: 'meditrip-mobile',
  });

  console.log(`${provider} Native Redirect URI:`, nativeRedirectUri);
  console.log(`${provider} Web Redirect URI:`, webRedirectUri);

  // 개발 환경에서는 웹 URI, 프로덕션에서는 네이티브 URI 사용
  return __DEV__ ? webRedirectUri : nativeRedirectUri;
};

// 딥링크 URI 확인
const DEEP_LINK_URI = Linking.createURL('/auth');
console.log('Deep Link URI:', DEEP_LINK_URI);

interface AuthResult {
  success: boolean;
  user?: any;
  error?: string;
}

// 구글 로그인 (실제 OAuth 플로우 + 모의 데이터)
export const signInWithGoogle = async (): Promise<AuthResult> => {
  try {
    console.log('Starting Google OAuth...');

    const redirectUri = createRedirectUri('google');

    // 실제 OAuth URL 생성
    const googleAuthUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent('openid email profile')}&` +
      `access_type=offline`;

    console.log('Google OAuth URL:', googleAuthUrl);

    // 웹브라우저로 인증 시작 (안드로이드 호환)
    const result = await WebBrowser.openAuthSessionAsync(
      googleAuthUrl,
      redirectUri,
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

    const redirectUri = createRedirectUri('line');
    console.log('Using redirect URI:', redirectUri);

    // 실제 라인 OAuth URL 생성
    const lineAuthUrl =
      `https://access.line.me/oauth2/v2.1/authorize?` +
      `response_type=code&` +
      `client_id=${LINE_CHANNEL_ID}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `state=random_state_string&` +
      `scope=profile%20openid%20email`;

    console.log('LINE OAuth URL:', lineAuthUrl);
    console.log('LINE Channel ID:', LINE_CHANNEL_ID);

    // 웹브라우저로 인증 시작
    const result = await WebBrowser.openAuthSessionAsync(
      lineAuthUrl,
      redirectUri,
      {
        showInRecents: Platform.OS === 'ios',
        createTask: Platform.OS === 'android',
        preferEphemeralSession: true, // 임시 세션 사용
      }
    );

    console.log('LINE OAuth result:', result);

    // 인증 세션 수동 종료
    WebBrowser.maybeCompleteAuthSession();

    // 결과 타입별 처리
    console.log('Result type:', result.type);
    if ('url' in result) {
      console.log('Result URL:', result.url);
    }

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
