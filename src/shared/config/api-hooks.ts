import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, API_ENDPOINTS } from './api-client';
import { API_CONFIG } from './api';
import { queryKeys } from './query-client';
import {
  UserSchema,
  ClinicSchema,
  ClinicListResponseSchema,
  BookingSchema,
  BookingListResponseSchema,
  ChatHistoryResponseSchema,
  ChatMessageSchema,
  LoginRequestSchema,
  LoginResponseSchema,
  SignupRequestSchema,
  SignupResponseSchema,
  UpdateProfileRequestSchema,
  CreateBookingRequestSchema,
  SendChatMessageRequestSchema,
  ClinicSearchRequestSchema,
  type User,
  type Clinic,
  type Booking,
  type ChatMessage,
  type LoginRequest,
  type LoginResponse,
  type SignupRequest,
  type SignupResponse,
  type UpdateProfileRequest,
  type CreateBookingRequest,
  type SendChatMessageRequest,
  type ClinicSearchRequest,
  CreateProfileRequest,
  CreateProfileResponse,
  CreateProfileRequestSchema,
  CreateProfileResponseSchema,
} from './schemas';
import { loginUser, signupUser, createProfile } from './api-function';

// 인증 관련 훅들
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: LoginRequest): Promise<LoginResponse> => {
      const validatedData = LoginRequestSchema.parse(userData);
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, validatedData);

      // 중첩된 응답 구조 처리
      const actualResponse = response.data || response;

      // 응답 데이터 검증
      const validatedResponse = LoginResponseSchema.parse(actualResponse);

      if (validatedResponse.success && validatedResponse.tokens) {
        // access_token을 우선적으로 찾기
        if (validatedResponse.tokens.access_token) {
          await api.setAuthToken(validatedResponse.tokens.access_token);
        } else {
          // 기존 로직 (첫 번째 토큰 사용)
          const tokenKeys = Object.keys(validatedResponse.tokens);
          if (tokenKeys.length > 0) {
            const firstToken = validatedResponse.tokens[tokenKeys[0]];
            if (typeof firstToken === 'string') {
              await api.setAuthToken(firstToken);
            }
          }
        }
      }

      return validatedResponse;
    },
    onSuccess: () => {
      // 로그인 성공 시 사용자 프로필 캐시 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile() });
    },
    onError: error => {
      console.error('로그인 중 오류 발생:', error);
    },
  });
};

export const useSignup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: SignupRequest): Promise<SignupResponse> => {
      const validatedData = SignupRequestSchema.parse(userData);
      const response = await api.post(API_ENDPOINTS.AUTH.SIGNUP, validatedData);

      // 응답 데이터 검증
      const validatedResponse = SignupResponseSchema.parse(response);

      if (validatedResponse.success && validatedResponse.tokens) {
        // access_token을 우선적으로 찾기
        if (validatedResponse.tokens.access_token) {
          await api.setAuthToken(validatedResponse.tokens.access_token);
        } else {
          // 기존 로직 (첫 번째 토큰 사용)
          const tokenKeys = Object.keys(validatedResponse.tokens);
          if (tokenKeys.length > 0) {
            const firstTokenKey = tokenKeys[0];
            const firstToken = validatedResponse.tokens[firstTokenKey];
            if (typeof firstToken === 'string') {
              await api.setAuthToken(firstToken);
            }
          }
        }
      }

      return validatedResponse;
    },
    onSuccess: () => {
      // 회원가입 성공 시 사용자 프로필 캐시 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile() });
    },
    onError: error => {
      console.error('회원가입 중 오류 발생:', error);
    },
  });
};

export const useCreateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
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

      const validatedData = CreateProfileRequestSchema.parse(profileData);
      const response = await api.post(
        API_ENDPOINTS.USER.CREATE_PROFILE,
        validatedData
      );

      // 응답 데이터 검증
      const validatedResponse = CreateProfileResponseSchema.parse(response);
      return validatedResponse;
    },
    onSuccess: data => {
      // 성공 시 쿼리 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
    onError: error => {
      console.error('프로필 생성 중 오류 발생:', error);
    },
  });
};

// 클리닉 관련 훅들
export const useClinics = (filters?: ClinicSearchRequest) => {
  return useQuery({
    queryKey: queryKeys.clinics.list(filters || {}),
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.CLINICS.LIST, filters);
      if (response.success && response.data) {
        return ClinicListResponseSchema.parse(response.data);
      }
      throw new Error(response.error || '클리닉 목록을 불러올 수 없습니다.');
    },
  });
};

export const useClinicDetail = (clinicId: string) => {
  return useQuery({
    queryKey: queryKeys.clinics.detail(clinicId),
    queryFn: async () => {
      const endpoint = API_ENDPOINTS.CLINICS.DETAIL.replace(':id', clinicId);
      const response = await api.get(endpoint);
      if (response.success && response.data) {
        return ClinicSchema.parse(response.data);
      }
      throw new Error(response.error || '클리닉 정보를 불러올 수 없습니다.');
    },
    enabled: !!clinicId,
  });
};

// 예약 관련 훅들
export const useBookings = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: queryKeys.bookings.list(filters || {}),
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.BOOKINGS.LIST, filters);
      if (response.success && response.data) {
        return BookingListResponseSchema.parse(response.data);
      }
      throw new Error(response.error || '예약 목록을 불러올 수 없습니다.');
    },
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingData: CreateBookingRequest) => {
      const validatedData = CreateBookingRequestSchema.parse(bookingData);
      return await api.post(API_ENDPOINTS.BOOKINGS.CREATE, validatedData);
    },
    onSuccess: () => {
      // 예약 생성 성공 시 예약 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.lists() });
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      const endpoint = API_ENDPOINTS.BOOKINGS.CANCEL.replace(':id', bookingId);
      return await api.delete(endpoint);
    },
    onSuccess: () => {
      // 예약 취소 성공 시 예약 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.lists() });
    },
  });
};

// 챗봇 관련 훅들
export const useChatHistory = () => {
  return useQuery({
    queryKey: queryKeys.chatbot.history(),
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.CHATBOT.GET_HISTORY);
      if (response.success && response.data) {
        return ChatHistoryResponseSchema.parse(response.data);
      }
      throw new Error(response.error || '채팅 기록을 불러올 수 없습니다.');
    },
  });
};

export const useSendChatMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ question }: SendChatMessageRequest) => {
      const validatedData = SendChatMessageRequestSchema.parse({ question });
      const response = await api.post(
        API_ENDPOINTS.CHATBOT.SEND_MESSAGE,
        validatedData
      );

      if (response.success && response.data) {
        return ChatMessageSchema.parse(response.data);
      }
      throw new Error(response.error || '메시지 전송에 실패했습니다.');
    },
    onSuccess: () => {
      // 메시지 전송 성공 시 채팅 기록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.chatbot.history() });
    },
  });
};
