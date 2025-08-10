import { atom } from 'jotai';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 이미지 정보 타입 정의
export interface ProfileImageInfo {
  uri: string;
  fileName?: string | null;
  fileSize?: number;
  type?: string | null;
  width?: number;
  height?: number;
}

// 프로필 이미지 상태 (파일 형식 정보 포함)
export const profileImageAtom = atom<ProfileImageInfo | null>(null);

// 프로필 정보 상태
export const profileInfoAtom = atom({
  nickname: 'Elena122',
  email: 'Elena122@email.com',
  lineId: 'Elena122',
  country: '일본',
  language: 'KO',
});

// 로그인된 사용자 정보 상태
export const userAtom = atom<{
  id?: string;
  email?: string;
  displayName?: string;
  nickname?: string;
  lineId?: string;
  country?: string;
  language?: string;
  profileImage?: string;
  isNewUser?: boolean;
} | null>({
  id: '1',
  email: 'test@example.com',
  displayName: '테스트 사용자',
  nickname: '테스트',
  lineId: '',
  country: '한국',
  language: 'KO',
  profileImage: undefined,
  isNewUser: false,
});

// 로그인 상태
export const isLoggedInAtom = atom<boolean>(false);

// AsyncStorage 키들
const STORAGE_KEYS = {
  USER: 'user_data',
  AUTH_TOKEN: 'auth_token',
  IS_LOGGED_IN: 'is_logged_in',
} as const;

// 사용자 정보 저장
export const saveUserToStorage = async (user: any) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    console.log('✅ 사용자 정보를 저장했습니다');
  } catch (error) {
    console.error('❌ 사용자 정보 저장 실패:', error);
  }
};

// 사용자 정보 불러오기
export const loadUserFromStorage = async () => {
  try {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    if (userData) {
      const user = JSON.parse(userData);
      console.log('✅ 저장된 사용자 정보를 불러왔습니다');
      return user;
    }
  } catch (error) {
    console.error('❌ 사용자 정보 불러오기 실패:', error);
  }
  return null;
};

// 인증 토큰 불러오기 (api.loadAuthToken() 사용 권장)
export const loadAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      console.log('✅ 저장된 인증 토큰을 불러왔습니다');
      return token;
    }
  } catch (error) {
    console.error('❌ 인증 토큰 불러오기 실패:', error);
  }
  return null;
};

// 로그인 상태 저장
export const saveLoginState = async (isLoggedIn: boolean) => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.IS_LOGGED_IN,
      JSON.stringify(isLoggedIn)
    );
    console.log('✅ 로그인 상태를 저장했습니다');
  } catch (error) {
    console.error('❌ 로그인 상태 저장 실패:', error);
  }
};

// 로그인 상태 불러오기
export const loadLoginState = async () => {
  try {
    const loginState = await AsyncStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
    if (loginState) {
      const isLoggedIn = JSON.parse(loginState);
      console.log('✅ 저장된 로그인 상태를 불러왔습니다');
      return isLoggedIn;
    }
  } catch (error) {
    console.error('❌ 로그인 상태 불러오기 실패:', error);
  }
  return false;
};

// 모든 사용자 데이터 삭제 (로그아웃 시)
export const clearUserData = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER,
      STORAGE_KEYS.AUTH_TOKEN,
      STORAGE_KEYS.IS_LOGGED_IN,
    ]);
    console.log('✅ 사용자 데이터를 삭제했습니다');
  } catch (error) {
    console.error('❌ 사용자 데이터 삭제 실패:', error);
  }
};
