import { api, API_ENDPOINTS } from './api-client';
import { API_CONFIG } from './api';
import {
  LoginRequestSchema,
  LoginResponseSchema,
  SignupRequestSchema,
  SignupResponseSchema,
  CreateProfileRequestSchema,
  CreateProfileResponseSchema,
  type LoginRequest,
  type LoginResponse,
  type SignupRequest,
  type SignupResponse,
  type CreateProfileRequest,
  type CreateProfileResponse,
} from './schemas';

// 사용 예시들

// 1. 로그인
export const loginUser = async (
  email: string,
  password: string,
  remember_me: boolean = false
): Promise<LoginResponse> => {
  const requestData: LoginRequest = {
    email,
    password,
    remember_me,
  };

  // 요청 데이터 검증
  const validatedRequest = LoginRequestSchema.parse(requestData);
  const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, validatedRequest);

  // 응답 데이터 검증
  const validatedResponse = LoginResponseSchema.parse(response);

  if (validatedResponse.success && validatedResponse.tokens) {
    // 토큰이 있는 경우 저장 (첫 번째 토큰 사용)
    const tokenKeys = Object.keys(validatedResponse.tokens);
    if (tokenKeys.length > 0) {
      const firstToken = validatedResponse.tokens[tokenKeys[0]];
      if (typeof firstToken === 'string') {
        api.setAuthToken(firstToken);
      }
    }
  }

  return validatedResponse;
};

// 2. 회원가입
export const signupUser = async (userData: {
  email: string;
  password: string;
  confirm_password: string;
  nickname: string;
  country_id: number;
  terms_agreement: boolean;
  marketing_agreement?: boolean;
}): Promise<SignupResponse> => {
  const requestData: SignupRequest = {
    email: userData.email,
    password: userData.password,
    confirm_password: userData.confirm_password,
    nickname: userData.nickname,
    country_id: userData.country_id,
    terms_agreement: userData.terms_agreement,
    marketing_agreement: userData.marketing_agreement,
  };

  // 요청 데이터 검증
  const validatedRequest = SignupRequestSchema.parse(requestData);
  const response = await api.post(API_ENDPOINTS.AUTH.SIGNUP, validatedRequest);

  // 응답 데이터 검증
  const validatedResponse = SignupResponseSchema.parse(response);

  if (validatedResponse.success && validatedResponse.tokens) {
    // 토큰이 있는 경우 저장 (첫 번째 토큰 사용)
    const tokenKeys = Object.keys(validatedResponse.tokens);
    if (tokenKeys.length > 0) {
      const firstToken = validatedResponse.tokens[tokenKeys[0]];
      if (typeof firstToken === 'string') {
        api.setAuthToken(firstToken);
      }
    }
  }

  return validatedResponse;
};

// 3. 프로필 생성
export const createProfile = async (
  profileData: CreateProfileRequest
): Promise<CreateProfileResponse> => {
  // 토큰 확인
  const currentToken = await api.loadAuthToken();
  if (!currentToken) {
    return {
      success: false,
      error: '인증 토큰이 필요합니다. 다시 로그인해주세요.',
    };
  }

  // 요청 데이터 검증
  const validatedRequest = CreateProfileRequestSchema.parse(profileData);
  const response = await api.post(
    API_ENDPOINTS.USER.CREATE_PROFILE,
    validatedRequest
  );

  // 응답 데이터 검증
  const validatedResponse = CreateProfileResponseSchema.parse(response);
  return validatedResponse;
};

// 4. 클리닉 목록 조회
export const getClinics = async (params?: {
  page?: number;
  limit?: number;
}) => {
  return await api.get(API_ENDPOINTS.CLINICS.LIST, params);
};

// 3. 특정 클리닉 상세 정보
export const getClinicDetail = async (clinicId: string) => {
  const endpoint = API_ENDPOINTS.CLINICS.DETAIL.replace(':id', clinicId);
  return await api.get(endpoint);
};

// 4. 예약 생성
export const createBooking = async (bookingData: {
  clinicId: string;
  date: string;
  time: string;
  serviceType: string;
}) => {
  return await api.post(API_ENDPOINTS.BOOKINGS.CREATE, bookingData);
};

// 5. 챗봇 메시지 전송
export const sendChatbotMessage = async (message: string) => {
  return await api.post(API_ENDPOINTS.CHATBOT.SEND_MESSAGE, message);
};

// 6. 사용자 프로필 조회
export const getUserProfile = async () => {
  return await api.get(API_ENDPOINTS.USER.PROFILE);
};

// 7. 사용자 프로필 업데이트
export const updateUserProfile = async (profileData: {
  name?: string;
  email?: string;
  phone?: string;
}) => {
  return await api.put(API_ENDPOINTS.USER.UPDATE_PROFILE, profileData);
};

// 8. 예약 취소
export const cancelBooking = async (bookingId: string) => {
  const endpoint = API_ENDPOINTS.BOOKINGS.CANCEL.replace(':id', bookingId);
  return await api.delete(endpoint);
};
