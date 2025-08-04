import { QueryClient } from '@tanstack/react-query';

// React Query 클라이언트 설정
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 기본 stale time (데이터가 fresh하다고 간주되는 시간)
      staleTime: 5 * 60 * 1000, // 5분

      // 기본 cache time (캐시에서 데이터가 유지되는 시간)
      gcTime: 10 * 60 * 1000, // 10분 (이전 버전의 cacheTime)

      // 재시도 횟수
      retry: 3,

      // 재시도 간격 (지수 백오프)
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),

      // 에러 발생 시 재시도 여부
      retryOnMount: true,

      // 윈도우 포커스 시 데이터 리페치
      refetchOnWindowFocus: false,

      // 네트워크 재연결 시 데이터 리페치
      refetchOnReconnect: true,
    },
    mutations: {
      // 뮤테이션 재시도 횟수
      retry: 1,

      // 뮤테이션 재시도 간격
      retryDelay: 1000,
    },
  },
});

// Query Key 팩토리 함수들
export const queryKeys = {
  // 인증 관련
  auth: {
    all: ['auth'] as const,
    profile: () => [...queryKeys.auth.all, 'profile'] as const,
  },

  // 클리닉 관련
  clinics: {
    all: ['clinics'] as const,
    lists: () => [...queryKeys.clinics.all, 'list'] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.clinics.lists(), filters] as const,
    details: () => [...queryKeys.clinics.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.clinics.details(), id] as const,
  },

  // 예약 관련
  bookings: {
    all: ['bookings'] as const,
    lists: () => [...queryKeys.bookings.all, 'list'] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.bookings.lists(), filters] as const,
    details: () => [...queryKeys.bookings.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.bookings.details(), id] as const,
  },

  // 챗봇 관련
  chatbot: {
    all: ['chatbot'] as const,
    history: () => [...queryKeys.chatbot.all, 'history'] as const,
  },
} as const;
