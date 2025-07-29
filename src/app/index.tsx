import { useEffect } from 'react';
import { router } from 'expo-router';

export default function Index() {
  useEffect(() => {
    // 앱이 시작되면 탭 라우팅으로 리다이렉트
    router.replace('/(tabs)/home');
  }, []);

  return null; // 리다이렉트 중에는 아무것도 렌더링하지 않음
}
