// API 기본 설정
export const API_CONFIG = {
  // 개발 환경에서는 로컬 서버 사용, 프로덕션에서는 Azure 서버 사용
  BASE_URL: 'https://wellness-meditrip-backend.eastus2.cloudapp.azure.com', // 프로덕션 서버
  TIMEOUT: 10000, // 10초
  HEADERS: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
} as const;

// 서비스별 BASE URL 설정
export const SERVICE_URLS = {
  AUTH: `${API_CONFIG.BASE_URL}:8013`,
  USER: `${API_CONFIG.BASE_URL}:8014`,
  CLINICS: `${API_CONFIG.BASE_URL}:8015`,

  PACKAGES: `${API_CONFIG.BASE_URL}:8008`,
  REVIEWS: `${API_CONFIG.BASE_URL}:8016`,
  RESERVATION: `${API_CONFIG.BASE_URL}:8017`,
  DOCTORS: `${API_CONFIG.BASE_URL}:8011`,
  CHATBOT: `${API_CONFIG.BASE_URL}:8010`,
} as const;

// API 엔드포인트 상수
export const API_ENDPOINTS = {
  // 인증 관련
  AUTH: {
    LOGIN: '/auth/email/login',
    SIGNUP: '/auth/email/register',
    REFRESH: '/auth/refresh',
    CREATE_PROFILE: '/profile/create',
  },

  // 사용자 관련
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    UPDATE_PROFILE_IMAGE: '/api/v1/profile-image',
    GET_PROFILE_IMAGE: '/api/v1/profile-image/{user_id}',
  },

  // 클리닉 관련
  CLINICS: {
    LIST: '/hospitals/',
    DETAIL: '/clinics/:id',
    SEARCH: '/clinics/search',
  },

  REVIEWS: {
    CREATE: '/reviews',
    LIST: '/api/v1/reviews',
    DETAIL: '/api/v1/reviews/{review_id}',
    UPDATE: '/api/v1/reviews/{review_id}',
    DELETE: '/api/v1/reviews/{review_id}',
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

  RESERVATION: {
    LIST: '/reservations',
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
