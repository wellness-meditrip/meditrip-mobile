import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';

// WebBrowser를 AuthSession에서 사용할 수 있도록 설정
WebBrowser.maybeCompleteAuthSession();

// 구글 OAuth 설정
const GOOGLE_CLIENT_ID =
  Constants.expoConfig?.extra?.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID'; // Google Cloud Console에서 가져와야 함
const GOOGLE_REDIRECT_URI = AuthSession.makeRedirectUri({
  scheme: 'meditrip-mobile',
  path: 'auth',
});

export const googleAuthConfig = {
  clientId: GOOGLE_CLIENT_ID,
  redirectUri: GOOGLE_REDIRECT_URI,
  scopes: ['openid', 'profile', 'email'],
  responseType: AuthSession.ResponseType.Code,
  additionalParameters: {},
  extraParams: {
    access_type: 'offline',
  },
};

// 라인 OAuth 설정
const LINE_CHANNEL_ID = Constants.expoConfig?.extra?.LINE_CHANNEL_ID; // app.json에서 설정
const LINE_CHANNEL_SECRET = Constants.expoConfig?.extra?.LINE_CHANNEL_SECRET; // app.json에서 설정

const LINE_REDIRECT_URI =
  Constants.expoConfig?.extra?.LINE_REDIRECT_URI ||
  'https://auth.expo.io/@lumpenop/meditrip-mobile';

export const lineAuthConfig = {
  clientId: LINE_CHANNEL_ID,
  redirectUri: LINE_REDIRECT_URI,
  scopes: ['profile', 'openid'],
  responseType: AuthSession.ResponseType.Code,
  additionalParameters: {},
};

// 구글 로그인 함수
export const signInWithGoogle = async () => {
  try {
    // Client ID가 설정되지 않은 경우
    if (GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID') {
      return {
        success: false,
        error: 'Google Client ID가 설정되지 않았습니다. 개발자에게 문의하세요.',
      };
    }

    const request = new AuthSession.AuthRequest(googleAuthConfig);
    const result = await request.promptAsync({
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    });

    if (result.type === 'success') {
      // 토큰 교환 및 사용자 정보 가져오기
      const tokenResponse = await AuthSession.exchangeCodeAsync(
        {
          clientId: GOOGLE_CLIENT_ID,
          code: result.params.code,
          redirectUri: GOOGLE_REDIRECT_URI,
          extraParams: {
            code_verifier: request.codeVerifier || '',
          },
        },
        {
          tokenEndpoint: 'https://oauth2.googleapis.com/token',
        }
      );

      // 사용자 정보 가져오기
      const userInfoResponse = await fetch(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenResponse.accessToken}`
      );
      const userInfo = await userInfoResponse.json();

      return {
        success: true,
        user: userInfo,
        accessToken: tokenResponse.accessToken,
      };
    }

    return { success: false, error: '사용자가 로그인을 취소했습니다.' };
  } catch (error) {
    console.error('Google 로그인 오류:', error);
    return { success: false, error: '로그인 중 오류가 발생했습니다.' };
  }
};

// 라인 로그인 함수
export const signInWithLine = async () => {
  if (!LINE_CHANNEL_ID) {
    return {
      success: false,
      error: 'LINE Channel ID가 설정되지 않았습니다. 개발자에게 문의하세요.',
    };
  }

  try {
    console.log('LINE Redirect URI:', LINE_REDIRECT_URI);
    const request = new AuthSession.AuthRequest({
      ...lineAuthConfig,
      clientId: LINE_CHANNEL_ID,
    });
    const result = await request.promptAsync({
      authorizationEndpoint: 'https://access.line.me/oauth2/v2.1/authorize',
    });

    if (result.type === 'success') {
      // 토큰 교환
      const tokenResponse = await AuthSession.exchangeCodeAsync(
        {
          clientId: LINE_CHANNEL_ID!,
          code: result.params.code,
          redirectUri: LINE_REDIRECT_URI,
          extraParams: {
            code_verifier: request.codeVerifier || '',
          },
        },
        {
          tokenEndpoint: 'https://api.line.me/oauth2/v2.1/token',
        }
      );

      // 사용자 정보 가져오기
      const userInfoResponse = await fetch('https://api.line.me/v2/profile', {
        headers: {
          Authorization: `Bearer ${tokenResponse.accessToken}`,
        },
      });
      const userInfo = await userInfoResponse.json();

      return {
        success: true,
        user: userInfo,
        accessToken: tokenResponse.accessToken,
      };
    }

    return { success: false, error: '사용자가 로그인을 취소했습니다.' };
  } catch (error) {
    console.error('LINE 로그인 오류:', error);
    return { success: false, error: '로그인 중 오류가 발생했습니다.' };
  }
};
