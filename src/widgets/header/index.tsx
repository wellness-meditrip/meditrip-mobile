import { scale, useSafeRouter } from '@/src/shared/lib';
import { Button, Text, View } from '@/src/shared/ui/custom';
import { Icon } from '@/components/icons';
import { usePathname } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

interface HeaderProps {
  title?: string;
}

const Header = ({ title }: HeaderProps) => {
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
          <View>
            <Icon name='ic-chevron-left' size={scale(24)} color='#000000' />
          </View>
        </Button>
      )}
      {isTopLevelPage && <Bin />}
      <Text fontSize={18} weight='bold' style={{ lineHeight: 24 }}>
        {title || 'MEDITRIP'}
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
