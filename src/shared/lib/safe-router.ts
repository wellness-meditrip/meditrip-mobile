import { router } from 'expo-router';

export type SafeRouterHandler = {
  back: () => void;
  push: (href: any) => void;
  replace: (href: any) => void;
  navigate: (href: any) => void;
  canGoBack: () => boolean;
};

export const useSafeRouter = (): SafeRouterHandler => {
  const handleError = (error: any, action: string) => {
    console.error(`SafeRouter error during ${action}:`, error);
    // 여기에 에러 로깅, 분석 도구 연동 등을 추가할 수 있습니다
    // 예: Sentry, Crashlytics 등
  };

  return {
    back: () => {
      try {
        router.back();
      } catch (error) {
        handleError(error, 'back');
      }
    },

    push: (href: any) => {
      try {
        router.push(href);
      } catch (error) {
        handleError(error, 'push');
      }
    },

    replace: (href: any) => {
      try {
        router.replace(href);
      } catch (error) {
        handleError(error, 'replace');
      }
    },

    navigate: (href: any) => {
      try {
        router.navigate(href);
      } catch (error) {
        handleError(error, 'navigate');
      }
    },

    canGoBack: () => {
      // router에는 canGoBack이 없으므로 항상 true를 반환
      return true;
    },
  };
}; 