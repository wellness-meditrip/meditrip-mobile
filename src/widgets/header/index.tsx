import { scale, useSafeRouter } from '@/src/shared/lib';
import { Button, Text, View } from '@/src/shared/ui/custom';
import { Icon } from '@/components/icons';
import { usePathname } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { useAtom } from 'jotai';
import {
  webViewRouteAtom,
  requestWebViewGoBackAtom,
} from '../../shared/lib/route-store';

interface HeaderProps {
  title?: string;
}

const Header = ({ title }: HeaderProps) => {
  const safeRouter = useSafeRouter();
  const pathname = usePathname();
  const [webViewRoute] = useAtom(webViewRouteAtom);
  const [, requestWebViewGoBack] = useAtom(requestWebViewGoBackAtom);

  // 탭 최상단 페이지들 (뒤로가기 불가능한 페이지들)
  const isTopLevelPage =
    ['/home', '/my-page'].includes(pathname) ||
    (!webViewRoute && pathname === '/clinics') ||
    webViewRoute === '/clinics';

  // webViewRoute에 따른 동적 타이틀 생성
  const getDynamicTitle = () => {
    // pathname이 clinics일 때만 webViewRoute에 따른 동적 타이틀 사용
    if (pathname === '/clinics' && webViewRoute && webViewRoute !== pathname) {
      const routeName = webViewRoute.split('/').pop(); // 마지막 경로 부분 추출
      switch (routeName) {
        case 'clinics':
          return '한의원';
        case 'reservations':
          return '예약하기';
        default:
          return 'MEDITRIP';
      }
    }
    // 기본 타이틀 또는 props로 전달된 타이틀
    return title || 'MEDITRIP';
  };

  const handleGoBack = () => {
    if (isTopLevelPage) return;

    // clinics 페이지이고 webViewRoute가 clinics가 아닌 경우 웹뷰 뒤로가기 요청
    if (pathname === '/clinics' && webViewRoute !== '/clinics') {
      requestWebViewGoBack();
    } else {
      safeRouter.back();
    }
  };

  const Bin = () => {
    return <View style={{ width: scale(24), height: scale(24) }} />;
  };

  return (
    <View style={styles.container}>
      {!isTopLevelPage && (
        <Button onPress={handleGoBack}>
          <View>
            <Icon name='ic-chevron-left' size={scale(24)} color='#000000' />
          </View>
        </Button>
      )}
      {isTopLevelPage && <Bin />}
      <Text fontSize={18} weight='bold' style={{ lineHeight: 24 }}>
        {getDynamicTitle()}
      </Text>
      <Bin />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fafafa',
    paddingVertical: scale(14),
    paddingHorizontal: scale(16),
  },
});
