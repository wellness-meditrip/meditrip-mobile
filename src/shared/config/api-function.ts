import { api, API_ENDPOINTS } from './api-client';
import { API_CONFIG } from './api';
import {
  LoginRequestSchema,
  LoginResponseSchema,
  SignupRequestSchema,
  SignupResponseSchema,
  CreateProfileRequestSchema,
  CreateProfileResponseSchema,
  HospitalListResponseSchema,
  ReservationListResponseSchema,
  ReservationListApiResponseSchema,
  type LoginRequest,
  type LoginResponse,
  type SignupRequest,
  type SignupResponse,
  type CreateProfileRequest,
  type CreateProfileResponse,
  type HospitalListResponse,
  type ReservationListResponse,
  type ReservationListApiResponse,
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
  const response = await api.post(
    'AUTH',
    API_ENDPOINTS.AUTH.LOGIN,
    validatedRequest
  );

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
export const signupUser = async (
  email: string,
  password: string,
  confirm_password: string,
  nickname: string,
  country_id: number,
  terms_agreement: boolean,
  marketing_agreement?: boolean
): Promise<SignupResponse> => {
  const requestData: SignupRequest = {
    email,
    password,
    confirm_password,
    nickname,
    country_id,
    terms_agreement,
    marketing_agreement,
  };

  // 요청 데이터 검증
  const validatedRequest = SignupRequestSchema.parse(requestData);
  const response = await api.post(
    'AUTH',
    API_ENDPOINTS.AUTH.SIGNUP,
    validatedRequest
  );

  // 응답 데이터 검증
  const validatedResponse = SignupResponseSchema.parse(response);

  return validatedResponse;
};

// 3. 프로필 생성
export const createProfile = async (
  userData: CreateProfileRequest
): Promise<CreateProfileResponse> => {
  // 요청 데이터 검증
  const validatedRequest = CreateProfileRequestSchema.parse(userData);
  const response = await api.post(
    'AUTH',
    API_ENDPOINTS.AUTH.CREATE_PROFILE,
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
  return await api.get('CLINICS', API_ENDPOINTS.CLINICS.LIST, params);
};

// 5. 특정 클리닉 상세 정보
export const getClinicDetail = async (clinicId: string) => {
  const endpoint = API_ENDPOINTS.CLINICS.DETAIL.replace(':id', clinicId);
  return await api.get('CLINICS', endpoint);
};

// 6. 예약 생성
export const createBooking = async (bookingData: {
  clinicId: string;
  date: string;
  time: string;
  serviceType: string;
}) => {
  return await api.post('BOOKINGS', API_ENDPOINTS.BOOKINGS.CREATE, bookingData);
};

// 7. 챗봇 메시지 전송
export const sendChatbotMessage = async (message: string) => {
  return await api.post('CHATBOT', API_ENDPOINTS.CHATBOT.SEND_MESSAGE, message);
};

// 8. 사용자 프로필 조회
export const getUserProfile = async () => {
  return await api.get('USER', API_ENDPOINTS.USER.PROFILE);
};

// 9. 사용자 프로필 업데이트
export const updateUserProfile = async (profileData: {
  name?: string;
  email?: string;
  phone?: string;
}) => {
  return await api.put('USER', API_ENDPOINTS.USER.UPDATE_PROFILE, profileData);
};

// 10. 예약 취소
export const cancelBooking = async (bookingId: string) => {
  const endpoint = API_ENDPOINTS.BOOKINGS.CANCEL.replace(':id', bookingId);
  return await api.delete('BOOKINGS', endpoint);
};

// 11. 내 리뷰 조회
export const getMyReviews = async (user_id: number) => {
  const response = await api.get('REVIEWS', API_ENDPOINTS.REVIEWS.LIST, {
    user_id,
  });
  // API 응답을 직접 반환 (스키마 검증 없이)
  return {
    success: response.success,
    data: response.data,
    error: response.error,
  };
};

export const deleteReview = async (review_id: string) => {
  console.log(review_id);
  const endpoint = API_ENDPOINTS.REVIEWS.DELETE.replace(
    '{review_id}',
    review_id
  );
  return await api.delete('REVIEWS', endpoint);
};

// 12. 프로필 이미지 업로드
export interface UpdateUserProfileImageRequest {
  image: string; // base64 encoded image
}

export const updateUserProfileImage = async (
  imageData: UpdateUserProfileImageRequest
) => {
  const response = await api.post(
    'USER',
    API_ENDPOINTS.USER.UPDATE_PROFILE_IMAGE,
    imageData
  );
  return response;
};

export const getUserProfileImage = async (user_id: number) => {
  const endpoint = API_ENDPOINTS.USER.GET_PROFILE_IMAGE.replace(
    '{user_id}',
    user_id.toString()
  );
  const response = await api.get('USER', endpoint);
  return response;
};

export const getClinicList = async () => {
  try {
    const response = await api.get('CLINICS', API_ENDPOINTS.CLINICS.LIST);

    // 응답 데이터가 있는지 확인
    if (!response.data) {
      throw new Error('API 응답에 데이터가 없습니다.');
    }

    // 스키마 검증 시도
    try {
      const validatedData = HospitalListResponseSchema.parse(response.data);

      return {
        success: response.success,
        data: validatedData,
        error: response.error,
      };
    } catch (validationError) {
      // 검증 실패해도 원본 데이터 반환
      return {
        success: response.success,
        data: response.data,
        error: response.error,
      };
    }
  } catch (error) {
    throw error;
  }
};

export const getReservationList = async (
  userId: number
): Promise<ReservationListApiResponse> => {
  try {
    const params = {
      user_id: userId,
      limit: 20,
      offset: 0,
    };
    const response = await api.get(
      'RESERVATION',
      API_ENDPOINTS.RESERVATION.LIST,
      params
    );

    // 응답 데이터가 있는지 확인
    if (!response.data) {
      throw new Error('API 응답에 데이터가 없습니다.');
    }

    // 스키마 검증 시도
    try {
      const validatedData = ReservationListResponseSchema.parse(response.data);

      return {
        success: response.success,
        data: validatedData,
        error: response.error,
      };
    } catch (validationError) {
      // 검증 실패해도 원본 데이터 반환
      return {
        success: response.success,
        data: response.data,
        error: response.error,
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
