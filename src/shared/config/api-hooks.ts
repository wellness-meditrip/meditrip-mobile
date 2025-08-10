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
  LoginResponseSchema,
  SignupRequestSchema,
  SignupResponseSchema,
  UpdateProfileRequestSchema,
  CreateProfileRequestSchema,
  CreateProfileResponseSchema,
  CreateBookingRequestSchema,
  SendChatMessageRequestSchema,
  ClinicSearchRequestSchema,
  ReviewListResponseSchema,
  HospitalListResponseSchema,
  type User,
  type Clinic,
  type Booking,
  type ChatMessage,
  type LoginRequest,
  type LoginResponse,
  type SignupRequest,
  type SignupResponse,
  type UpdateProfileRequest,
  type CreateProfileRequest,
  type CreateProfileResponse,
  type CreateBookingRequest,
  type SendChatMessageRequest,
  type ClinicSearchRequest,
  type ReviewListResponse,
  type HospitalListResponse,
  type ClinicListResponse,
} from './schemas';
import {
  loginUser,
  signupUser,
  createProfile,
  getMyReviews,
  updateUserProfileImage,
  UpdateUserProfileImageRequest,
  getClinicList,
  getUserProfileImage,
  deleteReview,
  getReservationList,
} from './api-function';

// 인증 관련 훅들
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: LoginRequest): Promise<LoginResponse> => {
      const validatedData = LoginRequestSchema.parse(userData);
      const response = await api.post(
        'AUTH',
        API_ENDPOINTS.AUTH.LOGIN,
        validatedData
      );

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
      // 로그인 중 오류 발생
    },
  });
};

// 회원가입 훅
export const useSignup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: SignupRequest): Promise<SignupResponse> => {
      const validatedData = SignupRequestSchema.parse(userData);
      const response = await api.post(
        'AUTH',
        API_ENDPOINTS.AUTH.SIGNUP,
        validatedData
      );

      // 중첩된 응답 구조 처리
      const actualResponse = response.data || response;

      // 응답 데이터 검증
      const validatedResponse = SignupResponseSchema.parse(actualResponse);

      return validatedResponse;
    },
    onSuccess: () => {
      // 회원가입 성공 시 사용자 프로필 캐시 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile() });
    },
    onError: error => {
      // 회원가입 중 오류 발생
    },
  });
};

// 사용자 프로필 관련 훅들
export const useUserProfile = () => {
  return useQuery({
    queryKey: queryKeys.auth.profile(),
    queryFn: async () => {
      const response = await api.get('USER', API_ENDPOINTS.USER.PROFILE);
      if (response.success && response.data) {
        return UserSchema.parse(response.data);
      }
      throw new Error(response.error || '사용자 프로필을 불러올 수 없습니다.');
    },
  });
};

// 프로필 생성 훅
export const useCreateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      profileData: CreateProfileRequest
    ): Promise<CreateProfileResponse> => {
      const response = await createProfile(profileData);
      return response;
    },
    onSuccess: () => {
      // 프로필 생성 성공 시 캐시 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile() });
    },
  });
};

// 프로필 업데이트 훅
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData: UpdateProfileRequest): Promise<User> => {
      const validatedData = UpdateProfileRequestSchema.parse(profileData);
      const response = await api.put(
        'USER',
        API_ENDPOINTS.USER.UPDATE_PROFILE,
        validatedData
      );

      if (response.success && response.data) {
        return UserSchema.parse(response.data);
      }
      throw new Error(response.error || '프로필 업데이트에 실패했습니다.');
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
    queryFn: async (): Promise<ClinicListResponse> => {
      const response = await api.get(
        'CLINICS',
        API_ENDPOINTS.CLINICS.LIST,
        filters
      );
      if (response.success && response.data) {
        return ClinicListResponseSchema.parse(response.data);
      }
      throw new Error(response.error || '클리닉 목록을 불러올 수 없습니다.');
    },
  });
};

// 클리닉 상세 정보 훅
export const useClinicDetail = (clinicId: string) => {
  return useQuery({
    queryKey: queryKeys.clinics.detail(clinicId),
    queryFn: async () => {
      const endpoint = API_ENDPOINTS.CLINICS.DETAIL.replace(':id', clinicId);
      const response = await api.get('CLINICS', endpoint);
      if (response.success && response.data) {
        return ClinicSchema.parse(response.data);
      }
      throw new Error(response.error || '클리닉 정보를 불러올 수 없습니다.');
    },
    enabled: !!clinicId,
  });
};

// 챗봇 관련 훅들
export const useChatHistory = () => {
  return useQuery({
    queryKey: queryKeys.chatbot.history(),
    queryFn: async () => {
      const response = await api.get(
        'CHATBOT',
        API_ENDPOINTS.CHATBOT.GET_HISTORY
      );
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
        'CHATBOT',
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

export const useGetMyReviews = (user_id: number) => {
  return useQuery({
    queryKey: queryKeys.reviews.list(),
    queryFn: async () => {
      const response = await getMyReviews(user_id);
      if (response.success && response.data) {
        // 스키마 검증 없이 직접 반환
        return response.data;
      }
      throw new Error(response.error || '리뷰 목록을 불러올 수 없습니다.');
    },
  });
};

export const useDeleteReview = () => {
  return useMutation({
    mutationFn: async (review_id: string) => {
      const response = await deleteReview(review_id);
      return response;
    },
  });
};

// 프로필 이미지 업로드 훅
export const useUpdateProfileImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (imageData: {
      user_id: number;
      image_data: string;
      image_type: string;
      original_filename: string;
    }) => {
      const response = await api.post(
        'USER',
        API_ENDPOINTS.USER.UPDATE_PROFILE_IMAGE,
        imageData
      );

      // 서버 응답의 success 필드를 확인
      if (!response.success) {
        throw new Error(response.error || '이미지 업로드에 실패했습니다.');
      }

      return response;
    },
    onSuccess: () => {
      // 프로필 이미지 업데이트 성공 시 사용자 프로필 캐시 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile() });
    },
  });
};

export const useGetProfileImage = (user_id: number) => {
  return useQuery({
    queryKey: queryKeys.auth.profile(),
    queryFn: async () => {
      const response = await getUserProfileImage(user_id);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error || '프로필 이미지를 불러올 수 없습니다.');
    },
  });
};

export const useGetClinicList = () => {
  return useQuery({
    queryKey: queryKeys.clinics.lists(),
    queryFn: async (): Promise<ClinicListResponse> => {
      const response = await getClinicList();
      if (response.success && response.data) {
        // 스키마 검증을 통해 올바른 데이터 구조 확인
        return ClinicListResponseSchema.parse(response.data);
      }
      throw new Error(response.error || '클리닉 목록을 불러올 수 없습니다.');
    },
  });
};

export const useGetReservationList = (user_id: number) => {
  return useQuery({
    queryKey: queryKeys.reservation.lists(),
    queryFn: async () => {
      const response = await getReservationList(user_id);
      return response;
    },
  });
};
