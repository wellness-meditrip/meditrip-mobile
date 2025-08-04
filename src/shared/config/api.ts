// API 기본 설정
export const API_CONFIG = {
  // 개발 환경에서는 로컬 서버 사용, 프로덕션에서는 Azure 서버 사용
  BASE_URL: 'https://wellness-meditrip-backend.eastus2.cloudapp.azure.com:8010', // 프로덕션 서버
  TIMEOUT: 10000, // 10초
  HEADERS: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
} as const;

// API 엔드포인트 상수
export const API_ENDPOINTS = {
  // 인증 관련
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    REFRESH: '/auth/refresh',
  },

  // 사용자 관련
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
  },

  // 클리닉 관련
  CLINICS: {
    LIST: '/clinics',
    DETAIL: '/clinics/:id',
    SEARCH: '/clinics/search',
  },

  // 예약 관련
  BOOKINGS: {
    CREATE: '/bookings',
    LIST: '/bookings',
    DETAIL: '/bookings/:id',
    CANCEL: '/bookings/:id/cancel',
  },

  // 챗봇 관련
  CHATBOT: {
    SEND_MESSAGE: '/chat',
    GET_HISTORY: '/chat/history',
  },
} as const;

// API 응답 타입
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// API 에러 타입
export interface ApiError {
  status: number;
  message: string;
  code?: string;
}
