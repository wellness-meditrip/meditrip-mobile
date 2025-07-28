import { ARROW_LEFT } from '@/assets/icons/components/header';
import { scale, useSafeRouter } from '@/src/shared/lib';
import { Button, Text, View } from '@/src/shared/ui/custom';
import { usePathname } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

const Header = () => {
  const safeRouter = useSafeRouter();
  const pathname = usePathname();

  // 탭 최상단 페이지들 (뒤로가기 불가능한 페이지들)
  const isTopLevelPage = ['/home', '/clinics', '/my-page'].includes(pathname);

  const handleGoBack = () => {
    safeRouter.back();
  };

  const Bin = () => {
    return <View style={{ width: scale(24), height: scale(24) }} />;
  };

  return (
    <View style={styles.container}>
      {!isTopLevelPage && (
        <Button onPress={handleGoBack}>
          <ARROW_LEFT width={scale(24)} height={scale(24)} />
        </Button>
      )}
      {isTopLevelPage && <Bin />}
      <Text fontSize={18} weight='bold'>
        MEDITRIP
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
