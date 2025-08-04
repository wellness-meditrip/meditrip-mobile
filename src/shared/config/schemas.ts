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
});

export const SignupRequestSchema = z.object({
  email: z.string().email('올바른 이메일 형식을 입력해주세요'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
  name: z.string().min(2, '이름은 최소 2자 이상이어야 합니다'),
  phone: z.string().optional(),
});

export const UpdateProfileRequestSchema = z.object({
  name: z.string().min(2, '이름은 최소 2자 이상이어야 합니다').optional(),
  phone: z.string().optional(),
  profileImage: z.string().optional(),
});

// 클리닉 관련 스키마
export const ClinicSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  address: z.string(),
  phone: z.string(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
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

export const ClinicListResponseSchema = z.object({
  clinics: z.array(ClinicSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  hasNext: z.boolean(),
});

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

// API 응답 타입들
export type User = z.infer<typeof UserSchema>;
export type Clinic = z.infer<typeof ClinicSchema>;
export type Booking = z.infer<typeof BookingSchema>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type SignupRequest = z.infer<typeof SignupRequestSchema>;
export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequestSchema>;
export type CreateBookingRequest = z.infer<typeof CreateBookingRequestSchema>;
export type SendChatMessageRequest = z.infer<
  typeof SendChatMessageRequestSchema
>;
export type ClinicSearchRequest = z.infer<typeof ClinicSearchRequestSchema>;

export type ClinicListResponse = z.infer<typeof ClinicListResponseSchema>;
export type BookingListResponse = z.infer<typeof BookingListResponseSchema>;
export type ChatMessageResponse = z.infer<typeof ChatMessageSchema>;
