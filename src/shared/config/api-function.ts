import { api, API_ENDPOINTS } from './api-client';

// 사용 예시들

// 1. 로그인
export const loginUser = async (email: string, password: string) => {
  const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
    email,
    password,
  });

  if (response.success && response.data?.token) {
    // 토큰 저장
    api.setAuthToken(response.data.token);
  }

  return response;
};

// 2. 클리닉 목록 조회
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
