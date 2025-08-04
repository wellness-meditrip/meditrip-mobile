import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, API_ENDPOINTS } from './api-client';
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
  SignupRequestSchema,
  UpdateProfileRequestSchema,
  CreateBookingRequestSchema,
  SendChatMessageRequestSchema,
  ClinicSearchRequestSchema,
  type User,
  type Clinic,
  type Booking,
  type ChatMessage,
  type LoginRequest,
  type SignupRequest,
  type UpdateProfileRequest,
  type CreateBookingRequest,
  type SendChatMessageRequest,
  type ClinicSearchRequest,
} from './schemas';

// 인증 관련 훅들
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const validatedData = LoginRequestSchema.parse(credentials);
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, validatedData);

      if (response.success && response.data?.token) {
        api.setAuthToken(response.data.token);
      }

      return response;
    },
    onSuccess: () => {
      // 로그인 성공 시 사용자 프로필 캐시 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile() });
    },
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: async (userData: SignupRequest) => {
      const validatedData = SignupRequestSchema.parse(userData);
      return await api.post(API_ENDPOINTS.AUTH.SIGNUP, validatedData);
    },
  });
};

export const useUserProfile = () => {
  return useQuery({
    queryKey: queryKeys.auth.profile(),
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.USER.PROFILE);
      if (response.success && response.data) {
        return UserSchema.parse(response.data);
      }
      throw new Error(response.error || '프로필을 불러올 수 없습니다.');
    },
    enabled: false, // 수동으로 호출하도록 설정
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData: UpdateProfileRequest) => {
      const validatedData = UpdateProfileRequestSchema.parse(profileData);
      return await api.put(API_ENDPOINTS.USER.UPDATE_PROFILE, validatedData);
    },
    onSuccess: () => {
      // 프로필 업데이트 성공 시 캐시 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile() });
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
