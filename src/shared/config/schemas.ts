import { z } from 'zod';

// 기본 응답 스키마
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    message: z.string().optional(),
    error: z.string().optional(),
  });

// 사용자 관련 스키마
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  phone: z.string().optional(),
  profileImage: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const LoginRequestSchema = z.object({
  email: z.string().email('올바른 이메일 형식을 입력해주세요'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
  remember_me: z.boolean().optional(),
});

// 로그인 응답 스키마
export const LoginResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  error: z.string().optional(),
  user: z.record(z.string(), z.any()).optional(),
  tokens: z.record(z.string(), z.any()).optional(),
  is_new_user: z.boolean().optional(),
});

// 회원가입 응답 스키마
export const SignupResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  error: z.string().optional(),
  user: z.record(z.string(), z.any()).optional(),
  tokens: z.record(z.string(), z.any()).optional(),
  is_new_user: z.boolean().optional(),
});

export const SignupRequestSchema = z
  .object({
    email: z.string().email('올바른 이메일 형식을 입력해주세요'),
    password: z
      .string()
      .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
        '비밀번호는 8자 이상, 영문과 숫자를 혼합하여 입력해주세요'
      ),
    confirm_password: z
      .string()
      .min(8, '비밀번호 확인은 최소 8자 이상이어야 합니다'),
    nickname: z
      .string()
      .min(2, '닉네임은 최소 2자 이상이어야 합니다')
      .max(50, '닉네임은 최대 50자까지 가능합니다'),
    country_id: z.number().int('국가 ID는 정수여야 합니다'),
    terms_agreement: z
      .boolean()
      .refine(val => val === true, '약관 동의는 필수입니다'),
    marketing_agreement: z.boolean().optional(),
  })
  .refine(data => data.password === data.confirm_password, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirm_password'],
  });

export const UpdateProfileRequestSchema = z.object({
  name: z.string().min(2, '이름은 최소 2자 이상이어야 합니다').optional(),
  phone: z.string().optional(),
  profileImage: z.string().optional(),
});

// 프로필 생성 관련 스키마
export const CreateProfileRequestSchema = z.object({
  gender: z.enum(['male', 'female', 'none']).optional(),
  birthdate: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      '올바른 날짜 형식을 입력해주세요 (YYYY-MM-DD)'
    )
    .optional(),
  height: z.number().min(0).max(300).optional(),
  weight: z.number().min(0).max(500).optional(),
  topics_of_interest: z.array(z.string()).optional(),
});

export const CreateProfileResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  error: z.string().optional(),
  user: z.record(z.string(), z.any()).optional(),
});

// 클리닉 관련 스키마
export const ClinicSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  address: z.string(),
  phone: z.string(),
  email: z.string().optional(),
  website: z.string(),
  line: z.string(),
  instagram: z.string(),
  youtube: z.string(),
  established_date: z.string(),
  description_jp: z.string(),
  description_en: z.string(),
  address_jp: z.string(),
  address_en: z.string(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().optional(),
  images: z.array(z.string()).optional(),
  services: z.array(z.string()).optional(),
  location: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),
  operatingHours: z
    .object({
      open: z.string(),
      close: z.string(),
    })
    .optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// ... existing code ...

export const ClinicSearchRequestSchema = z.object({
  query: z.string().optional(),
  location: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),
  services: z.array(z.string()).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(50).optional(),
});

// 예약 관련 스키마
export const BookingSchema = z.object({
  id: z.string(),
  clinicId: z.string(),
  clinicName: z.string(),
  userId: z.string(),
  date: z.string(),
  time: z.string(),
  serviceType: z.string(),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
  notes: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateBookingRequestSchema = z.object({
  clinicId: z.string(),
  date: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      '올바른 날짜 형식을 입력해주세요 (YYYY-MM-DD)'
    ),
  time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, '올바른 시간 형식을 입력해주세요 (HH:MM)'),
  serviceType: z.string(),
  notes: z.string().optional(),
});

export const BookingListResponseSchema = z.object({
  bookings: z.array(BookingSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  hasNext: z.boolean(),
});

// 챗봇 관련 스키마
export const ChatMessageSchema = z.object({
  answer: z.string(),
  sources: z.array(z.string()),
  confidence: z.number(),
});

export const SendChatMessageRequestSchema = z.object({
  question: z.string().min(1, '질문을 입력해주세요'),
});

export const ChatHistoryResponseSchema = z.object({
  messages: z.array(ChatMessageSchema),
  total: z.number(),
});

// 리뷰 관련 스키마
export const ReviewSchema = z.object({
  review_id: z.number(),
  hospital_id: z.number(),
  user_id: z.number(),
  doctor_id: z.number(),
  doctor_name: z.string(),
  title: z.string(),
  rating: z.number().min(1).max(5),
  is_verified: z.boolean(),
  created_at: z.string().datetime(),
  keyword_count: z.number(),
  image_count: z.number(),
  images: z.array(z.string()).optional(), // base64 이미지 배열 추가
});

// 병원 관련 스키마 (새로운 API 응답 구조)
export const HospitalOperatingHoursSchema = z.object({
  day_of_week: z.number(),
  open_time: z.string().nullable(),
  close_time: z.string().nullable(),
  lunch_start: z.string().nullable(),
  lunch_end: z.string().nullable(),
  is_closed: z.boolean(),
  notes: z.string().nullable(),
});

export const HospitalImageSchema = z.object({
  image_type: z.string(),
  image_url: z.string(),
  alt_text: z.string(),
  is_main: z.boolean(),
});

export const HospitalDepartmentSchema = z.object({
  name: z.string(),
  name_en: z.string(),
  name_jp: z.string(),
  description: z.string(),
  is_available: z.boolean(),
});

export const HospitalDetailsSchema = z.object({
  parking_available: z.boolean(),
  parking_description: z.string().nullable(),
  wifi_available: z.boolean(),
  wifi_description: z.string().nullable(),
  luggage_storage: z.boolean(),
  luggage_storage_description: z.string().nullable(),
  private_treatment: z.boolean(),
  private_treatment_description: z.string().nullable(),
  airport_pickup: z.boolean(),
  airport_pickup_description: z.string().nullable(),
  translation_service: z.boolean(),
  translation_description: z.string().nullable(),
  operating_hours: z.array(HospitalOperatingHoursSchema),
  images: z.array(HospitalImageSchema),
  departments: z.array(HospitalDepartmentSchema),
  id: z.number(),
  hospital_id: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const HospitalSchema = z.object({
  hospital_name: z.string(),
  address: z.string(),
  contact: z.string(),
  website: z.string().nullable(),
  line: z.string().nullable(),
  instagram: z.string().nullable(),
  youtube: z.string().nullable(),
  established_date: z.string(),
  hospital_description: z.string(),
  hospital_description_jp: z.string().nullable(),
  hospital_description_en: z.string().nullable(),
  hospital_address_jp: z.string().nullable(),
  hospital_address_en: z.string().nullable(),
  hospital_id: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  hospital_details: z.array(HospitalDetailsSchema),
});

export const HospitalListResponseSchema = z.object({
  hospitals: z.array(HospitalSchema),
  total: z.number(),
  page: z.number(),
  size: z.number(),
});

// 클리닉 목록 응답 스키마 (병원 데이터 구조와 동일)
export const ClinicListResponseSchema = z.object({
  hospitals: z.array(HospitalSchema),
  total: z.number(),
  page: z.number(),
  size: z.number(),
});

export const ReviewListResponseSchema = z.object({
  items: z.array(ReviewSchema),
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
  has_next: z.boolean(),
  has_prev: z.boolean(),
});

// 예약 관련 스키마
export const ReservationSchema = z.object({
  reservation_id: z.number(),
  hospital_id: z.number(),
  hospital_name: z.string(),
  doctor_id: z.number(),
  doctor_name: z.string(),
  user_id: z.number(),
  symptoms: z.string(),
  reservation_date: z.string(),
  reservation_time: z.string(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']),
  contact_email: z.string().email(),
  contact_phone: z.string(),
  interpreter_language: z.string(),
  created_at: z.string(),
  image_count: z.number(),
});

export const ReservationListResponseSchema = z.object({
  items: z.array(ReservationSchema),
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
  has_next: z.boolean(),
  has_prev: z.boolean(),
});

// 예약 목록 API 응답 스키마 (API 응답 래퍼 포함)
export const ReservationListApiResponseSchema = ApiResponseSchema(
  ReservationListResponseSchema
);

// API 응답 타입들
export type User = z.infer<typeof UserSchema>;
export type Clinic = z.infer<typeof ClinicSchema>;
export type Booking = z.infer<typeof BookingSchema>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type SignupRequest = z.infer<typeof SignupRequestSchema>;
export type SignupResponse = z.infer<typeof SignupResponseSchema>;
export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequestSchema>;
export type CreateProfileRequest = z.infer<typeof CreateProfileRequestSchema>;
export type CreateProfileResponse = z.infer<typeof CreateProfileResponseSchema>;
export type CreateBookingRequest = z.infer<typeof CreateBookingRequestSchema>;
export type SendChatMessageRequest = z.infer<
  typeof SendChatMessageRequestSchema
>;
export type ClinicSearchRequest = z.infer<typeof ClinicSearchRequestSchema>;

export type ClinicListResponse = z.infer<typeof ClinicListResponseSchema>;
export type BookingListResponse = z.infer<typeof BookingListResponseSchema>;
export type ChatMessageResponse = z.infer<typeof ChatMessageSchema>;
export type Review = z.infer<typeof ReviewSchema>;
export type ReviewListResponse = z.infer<typeof ReviewListResponseSchema>;

// 예약 관련 타입들
export type Reservation = z.infer<typeof ReservationSchema>;
export type ReservationListResponse = z.infer<
  typeof ReservationListResponseSchema
>;
export type ReservationListApiResponse = z.infer<
  typeof ReservationListApiResponseSchema
>;

// 병원 관련 타입들
export type HospitalOperatingHours = z.infer<
  typeof HospitalOperatingHoursSchema
>;
export type HospitalImage = z.infer<typeof HospitalImageSchema>;
export type HospitalDepartment = z.infer<typeof HospitalDepartmentSchema>;
export type HospitalDetails = z.infer<typeof HospitalDetailsSchema>;
export type Hospital = z.infer<typeof HospitalSchema>;
export type HospitalListResponse = z.infer<typeof HospitalListResponseSchema>;
